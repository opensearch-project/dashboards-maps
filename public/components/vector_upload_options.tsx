/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import './vector_upload_options.scss';
import React, { useState } from 'react';
import path from 'path';
import {
  EuiSmallButton,
  EuiFilePicker,
  EuiFlexItem,
  EuiFlexGroup,
  EuiText,
  EuiSpacer,
  EuiCard,
  EuiFieldText,
  EuiTextColor,
  EuiFormRow,
  EuiCodeBlock,
} from '@elastic/eui';
import { getIndex, postGeojson } from '../services';
import { ShowErrorModal } from './show_error_modal';
import {
  ALLOWED_FILE_EXTENSIONS,
  MAX_FILE_PAYLOAD_SIZE,
  MAX_FILE_PAYLOAD_SIZE_IN_MB,
} from '../../common';
import {
  toMountPoint,
  useOpenSearchDashboards,
} from '../../../../src/plugins/opensearch_dashboards_react/public';
import { RegionMapOptionsProps } from '../../../../src/plugins/region_map/public';

const VectorUploadOptions = (props: RegionMapOptionsProps) => {
  const opensearchDashboards = useOpenSearchDashboards();
  const notifications = opensearchDashboards.services.notifications;
  const http = opensearchDashboards.services.http;

  const INDEX_NAME_SUFFIX = '-map';
  const INDEX_NAME_UPPERCASE_CHECK = /[A-Z]+/;
  const INDEX_NAME_SPECIAL_CHARACTERS_CHECK = /[`!@#$%^&*()\=\[\]{};':"\\|,.<>\/?~]/;
  const INDEX_NAME_NOT_BEGINS_WITH_CHECK = /^[-+_.]/;
  const INDEX_NAME_BEGINS_WITH_CHECK = /^[a-z]/;
  const INDEX_NAME_NOT_ENDS_WITH_CHECK = /.*-map$/;
  const MAX_LENGTH_OF_INDEX_NAME = 250;
  const GEO_SHAPE_TYPE = 'geo_shape';

  const [value, setValue] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState();

  const onTextChange = (e) => {
    setValue(e.target.value);
  };

  const onChange = (files) => {
    if (files[0]) {
      validateGeojsonFileFormat(files);
      validateFileSize(files);
      setFileContent(files);
    }
  };

  const validateGeojsonFileFormat = (files) => {
    const uploadedFileExtension = path.extname(files[0].name);
    if (ALLOWED_FILE_EXTENSIONS.includes(uploadedFileExtension.toLowerCase())) {
      return true;
    } else {
      notifications.toasts.addDanger(
        'Error. File format is incorrect. It should be either json or geojson file.'
      );
      return;
    }
  };

  const fetchElementByName = (elementName: string) => {
    return document.getElementsByName(elementName)[0];
  };

  const dataSourceRefId = props.vis.data.indexPattern?.dataSourceRef?.id || '';

  const validateIndexName = (typedIndexName: string, isIndexNameWithSuffix: boolean) => {
    const error = [];
    const errorIndexNameDiv = fetchElementByName('errorIndexName');

    // check for presence of index name entered by the user
    if (!typedIndexName) {
      error.push('Required');
    } else {
      // check for restriction on length of the index name
      if (MAX_LENGTH_OF_INDEX_NAME < typedIndexName.length) {
        error.push('Map name should be less than ' + MAX_LENGTH_OF_INDEX_NAME + ' characters.\n');
      }

      // check for restriction on the usage of upper case characters in the index name
      if (INDEX_NAME_UPPERCASE_CHECK.test(typedIndexName)) {
        error.push('Upper case letters are not allowed.\n');
      }

      // check for restriction on the usage of special characters in the index name
      if (INDEX_NAME_SPECIAL_CHARACTERS_CHECK.test(typedIndexName)) {
        error.push('Special characters are not allowed.\n');
      }

      // check for restriction on the usage of characters at the beginning in the index name
      if (
        INDEX_NAME_NOT_BEGINS_WITH_CHECK.test(typedIndexName) ||
        !INDEX_NAME_BEGINS_WITH_CHECK.test(typedIndexName)
      ) {
        error.push("Map name can't start with + , _ , - or . It should start with a-z.\n");
      }

      // check for restriction on the usage of -map in map name if entered by the user
      if (!isIndexNameWithSuffix && INDEX_NAME_NOT_ENDS_WITH_CHECK.test(typedIndexName)) {
        error.push("Map name can't end with -map.\n");
      }
    }

    if (error.length > 0) {
      errorIndexNameDiv.textContent = error.join(' ');
      setLoading(false);
      return false;
    }
    errorIndexNameDiv.textContent = '';
    return true;
  };

  const validateFileSize = async (files) => {
    // check if the file size is permitted
    if (MAX_FILE_PAYLOAD_SIZE < files[0].size) {
      notifications.toasts.addDanger(
        'File size should be less than ' + MAX_FILE_PAYLOAD_SIZE_IN_MB + ' MB.'
      );
      setLoading(false);
      return false;
    }
    if (files[0].size === 0) {
      notifications.toasts.addDanger(
        'Error. File does not contain valid features. Check your json format.'
      );
      setLoading(false);
      return false;
    }
    return true;
  };

  const clearUserInput = () => {
    setValue('');
  };

  const getFileData = async (files) => {
    const fileData = await files[0].text();
    return fileData;
  };

  const handleSubmit = async () => {
    // show import button as loading
    setLoading(true);
    const newIndexName = fetchElementByName('customIndex').value + INDEX_NAME_SUFFIX;

    // if index name is valid, validate the file size and upload the geojson data
    const isValidIndexName = validateIndexName(newIndexName, true);
    const files = fileContent;
    let fileData;
    if (isValidIndexName) {
      if (files && validateGeojsonFileFormat(files) && validateFileSize(files)) {
        fileData = await getFileData(files);
        await handleUploadGeojson(newIndexName, fileData);
      }
    }

    // removes loading symbol from import button
    setLoading(false);
    clearUserInput();
  };

  const checkIfIndexExists = async (indexName: string) => {
    try {
      const result = await getIndex(indexName, http, dataSourceRefId);
      return result.ok;
    } catch (e) {
      return false;
    }
  };

  const formatSuccessToast = (indexName: string, totalRecords: number) => {
    const textContent =
      totalRecords > 1
        ? 'Successfully added ' + totalRecords + ' features to ' + indexName + '.'
        : 'Successfully added 1 feature to ' + indexName + '.';
    notifications.toasts.addSuccess({
      text: toMountPoint(
        <div>
          <p>{textContent} Refresh to visualize the uploaded map.</p>
          <EuiFlexGroup justifyContent="flexEnd" gutterSize="s">
            <EuiFlexItem grow={false}>
              <EuiButton size="s" onClick={refresh}>
                Refresh
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      ),
    });
  };

  const formatWarningToast = (
    indexName: string,
    successfullyIndexedRecordCount: number,
    failedToIndexRecordCount: number,
    totalRecords: number,
    failures: object
  ) => {
    const title =
      'Partially indexed ' +
      successfullyIndexedRecordCount +
      ' of ' +
      totalRecords +
      ' features in ' +
      indexName;
    const showModalProps = {
      modalTitle: 'Error Details',
      modalBody: JSON.stringify(failures),
      buttonText: 'View error details',
    };
    const textContent =
      failedToIndexRecordCount > 1
        ? 'There were' + failedToIndexRecordCount + ' errors processing the custom map.'
        : 'There was 1 error processing the custom map.';
    notifications.toasts.addDanger({
      title,
      iconType: 'alert',
      text: toMountPoint(
        <div>
          <p>{textContent} Refresh to visualize the uploaded map.</p>
          <EuiFlexGroup justifyContent="flexEnd" gutterSize="s">
            <EuiFlexItem grow={false}>
              <ShowErrorModal {...showModalProps} />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton size="s" onClick={refresh}>
                Refresh
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      ),
    });
  };

  const parsePostGeojsonResult = (result: object, indexName: string) => {
    const successfullyIndexedRecordCount = result.resp.success;
    const failedToIndexRecordCount = result.resp.failure;
    const totalRecords = result.resp.total;

    if (successfullyIndexedRecordCount === totalRecords) {
      formatSuccessToast(indexName, totalRecords);
    }

    if (successfullyIndexedRecordCount > 0 && failedToIndexRecordCount > 0) {
      formatWarningToast(
        indexName,
        successfullyIndexedRecordCount,
        failedToIndexRecordCount,
        totalRecords,
        result.resp.failures
      );
    }

    if (successfullyIndexedRecordCount === 0) {
      notifications.toasts.addDanger(
        'Error. File does not contain valid features. Check your json format.'
      );
    }
  };

  const uploadGeojson = async (indexName: string, fileData: object) => {
    const bodyData = {
      index: indexName,
      field: 'location',
      type: GEO_SHAPE_TYPE,
      data: [JSON.parse(fileData || null)],
    };
    const result = await postGeojson(JSON.stringify(bodyData), http, dataSourceRefId);
    // error handling logic that displays correct toasts for the end users
    if (result?.ok) {
      parsePostGeojsonResult(result, indexName);
    } else {
      if (result?.resp) {
        notifications.toasts.addDanger({
          text: toMountPoint(
            <div>
              <EuiCodeBlock isCopyable>{result.resp}</EuiCodeBlock>
            </div>
          ),
        });
      }
    }
  };

  const handleUploadGeojson = async (indexName: string, fileData: object) => {
    const indexExists = await checkIfIndexExists(indexName);

    if (!indexExists) {
      await uploadGeojson(indexName, fileData);
    } else {
      notifications.toasts.addWarning('Map name ' + indexName + ' already exists.');
    }
  };

  const refresh = () => {
    location.reload(true);
  };

  return (
    <div id="uploadCustomVectorMap">
      <EuiCard textAlign="left" title="" description="" aria-label="import-vector-map-card">
        <EuiSpacer size="s" aria-label="medium-spacer" />

        <EuiText size="s" aria-label="upload-map-text">
          Upload map
        </EuiText>
        <EuiSpacer size="m" aria-label="medium-spacer" />

        <EuiFormRow aria-label="form-row-for-file-picker">
          <EuiFilePicker
            id="filePicker"
            data-testid="filePicker"
            data-test-subj="filePicker"
            initialPromptText="Select or drag and drop a json file"
            onChange={(files) => {
              onChange(files);
            }}
            display="large"
            accept=".json,.geojson"
            required={true}
            aria-label="geojson-file-picker"
          />
        </EuiFormRow>
        <EuiSpacer size="m" aria-label="medium-spacer" />

        <EuiText size="xs" color="subdued" aria-label="geojson-file-format-text">
          <p>
            <span className="formattedSpan">Formats accepted: .json, .geojson</span>
            <span className="formattedSpan">Max size: 25 MB</span>
            <span className="formattedSpan">
              Coordinates must be in EPSG:4326 coordinate reference system.
            </span>
          </p>
        </EuiText>
        <EuiSpacer size="m" aria-label="medium-spacer" />

        <EuiText size="s" aria-label="map-name-prefix-text">
          Map name prefix
        </EuiText>
        <EuiSpacer size="m" aria-label="medium-spacer" />

        <EuiFieldText
          data-testid="customIndex"
          data-test-subj="customIndex"
          tabIndex="0"
          placeholder="Enter a valid map name prefix"
          value={value}
          onChange={(e) => onTextChange(e)}
          onBlur={(e) => validateIndexName(e?.target?.value, false)}
          id="customIndex"
          name="customIndex"
          required={true}
          label="Map name"
          aria-label="map-name-text-field"
        />
        <EuiSpacer size="m" aria-label="medium-spacer" />

        <EuiText size="xs" color="subdued" aria-label="map-name-guidelines-text">
          Map name guidleines:
          <ul>
            <li> Map name prefix must contain 1-250 characters.</li>
            <li> Map name prefix must start with a-z.</li>
            <li> Valid characters are a-z, 0-9, - and _ .</li>
            <li>
              The final map name will be the entered prefix here followed by -map as the suffix.
            </li>
          </ul>
        </EuiText>
        <EuiText size="xs" aria-label="map-name-error-text">
          <EuiTextColor color="danger" aria-label="map-name-error-text-color">
            <p name="errorIndexName" />
          </EuiTextColor>
        </EuiText>
        <EuiSpacer size="m" aria-label="medium-spacer" />

        <div className="importFileButton">
          <EuiSmallButton
            id="submitButton"
            type="button"
            fill
            onClick={handleSubmit}
            isLoading={isLoading}
            aria-label="import-file-button"
          >
            Import file
          </EuiSmallButton>
        </div>
      </EuiCard>
    </div>
  );
};

export { VectorUploadOptions };

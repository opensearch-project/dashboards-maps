/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { VectorUploadOptions } from './vector_upload_options';
import { screen, render, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import * as serviceApiCalls from '../services';

jest.mock('../../../../src/plugins/opensearch_dashboards_react/public', () => ({
  useOpenSearchDashboards: jest.fn().mockReturnValue({
    services: {
      http: {
        post: () => {
          Promise.resolve({});
        },
      },
      notifications: {
        toasts: { addSuccess: jest.fn(), addDanger: jest.fn(), addWarning: jest.fn() },
      },
    },
  }),
  toMountPoint: jest.fn().mockReturnValue({}),
}));

describe('vector_upload_options', () => {
  const props = {
    vis: {
      data: {
        indexPattern: {
          dataSourceRef: {
            id: 'mock-data-source-id',
          },
        },
      },
    },
  };

  const getIndexResponseWhenIndexIsNotPresent = {
    ok: false,
    resp: [],
  };

  const getIndexResponseWhenIndexIsPresent = {
    ok: true,
    resp: [
      {
        health: 'yellow',
        index: 'sample-map',
        status: 'open',
      },
    ],
  };

  const failedPostGeojsonResponse = {
    ok: false,
    resp: {},
  };

  const singlePartialFailurePostGeojsonResponse = {
    ok: true,
    resp: {
      took: 1969,
      errors: true,
      total: 3220,
      success: 3219,
      failure: 1,
      failures: [],
    },
  };

  const multiplePartialFailuresPostGeojsonResponse = {
    ok: true,
    resp: {
      took: 1969,
      errors: true,
      total: 3220,
      success: 3218,
      failure: 2,
      failures: [],
    },
  };

  const noDocumentsIndexedPostGeojsonResponse = {
    ok: true,
    resp: {
      took: 1969,
      errors: true,
      total: 3220,
      success: 0,
      failure: 3220,
      failures: [],
    },
  };

  const multipleSuccessfulPostGeojsonResponse = {
    ok: true,
    resp: {
      took: 1969,
      errors: true,
      total: 3220,
      success: 3220,
      failure: 0,
      failures: [],
    },
  };

  const singleSuccessfulPostGeojsonResponse = {
    ok: true,
    resp: {
      took: 1969,
      errors: true,
      total: 1,
      success: 1,
      failure: 0,
      failures: [],
    },
  };

  const vectorUploadOptionsWithIndexNameUtil = (userEnteredIndexName: string, message: string) => {
    render(<VectorUploadOptions {...props} />);
    const indexName = screen.getByTestId('customIndex');
    fireEvent.change(indexName, { target: { value: userEnteredIndexName } });
    const button = screen.getByRole('button', { name: 'import-file-button' });
    fireEvent.click(button);
    expect(screen.getByText(message)).toBeInTheDocument();
  };

  const vectorUploadOptionsWithIndexNameRendererUtil = async (
    userEnteredIndexName: string,
    message: string
  ) => {
    const tree = render(<VectorUploadOptions {...props} />);
    const indexName = screen.getByTestId('customIndex');
    fireEvent.change(indexName, { target: { value: userEnteredIndexName } });
    const button = screen.getByRole('button', { name: 'import-file-button' });
    fireEvent.click(button);
    console.log(tree.getByText('errorIndexName'));
    await expect(tree.findAllByText(message)).toBeTruthy();
  };

  const addUserInputToDOM = async () => {
    const jsonData = {
      type: 'FeatureCollection',
      name: 'sample',
      features: [
        {
          type: 'Feature',
          properties: { name: 'sample' },
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ],
    };
    const { getByTestId } = render(<VectorUploadOptions {...props} />);
    const indexName = screen.getByTestId('customIndex');
    fireEvent.change(indexName, { target: { value: 'sample' } });
    const uploader = getByTestId('filePicker');

    const str = JSON.stringify([jsonData]);
    const blob = new Blob([str]);
    const file = new File([blob], 'sample.json', { type: 'application/JSON' });
    File.prototype.text = jest.fn().mockResolvedValueOnce(JSON.stringify([jsonData]));
    await fireEvent.change(uploader, {
      target: { files: [file] },
    });
    await expect(uploader.files[0].name).toBe('sample.json');
  };

  it('renders the VectorUploadOptions based on props provided', () => {
    const vectorUploadOptions = render(<VectorUploadOptions {...props} />);
    expect(vectorUploadOptions).toMatchSnapshot();
  });

  it('renders the VectorUploadOptions component with error message when index name is invalid', () => {
    vectorUploadOptionsWithIndexNameUtil(
      '+abc',
      "Map name can't start with + , _ , - or . It should start with a-z."
    );
  });

  it('renders the VectorUploadOptions component with error message when index name is greater than 250 characters', () => {
    vectorUploadOptionsWithIndexNameUtil(
      'berhtoe7k9yyl43uuzlh6hqsc00iunkqu49110u3kxizck9hy6f584mfaksjcx3zekntyid2tqy39msp25kp0r1gnib5noqmtz1hatq3s4lsbluwrfljrglt7sg3fp1uebukm1ycvh1onrylwrogclvhpf7npzhcfbrvcybmofee5sflwnsx2xxkgqjfsrsg7nz032jlmm0cpahltdekhyg66pcv2plukby8fgm3vze9jhewrilre07kdakb0ul7',
      'Map name should be less than 250 characters.'
    );
  });

  it('renders the VectorUploadOptions component with error message when index name has upper case letters', async () => {
    try {
      await vectorUploadOptionsWithIndexNameRendererUtil(
        'ABC',
        'Upper case letters are not allowed'
      );
    } catch (err) {}
  });

  it('renders the VectorUploadOptions component with error message when index name has special characters', async () => {
    try {
      await vectorUploadOptionsWithIndexNameRendererUtil(
        'a#bc',
        'Special characters are not allowed.'
      );
    } catch (err) {}
  });

  it('renders the VectorUploadOptions component with error message when index name has -map as suffix', async () => {
    try {
      await vectorUploadOptionsWithIndexNameRendererUtil(
        'sample-map',
        "Map name can't end with -map."
      );
    } catch (err) {}
  });

  it('renders the VectorUploadOptions component when we have successfully indexed all the data having multiple features', async () => {
    addUserInputToDOM();
    console.log('test case for successfully indexed file data');
    const button = screen.getByRole('button', { name: 'import-file-button' });
    jest.spyOn(serviceApiCalls, 'getIndex').mockImplementation(() => {
      return Promise.resolve(getIndexResponseWhenIndexIsNotPresent);
    });
    jest.spyOn(serviceApiCalls, 'postGeojson').mockImplementation(() => {
      return Promise.resolve(multipleSuccessfulPostGeojsonResponse);
    });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it('renders the VectorUploadOptions component when we have successfully indexed the data having single feature', async () => {
    addUserInputToDOM();
    console.log('test case for successfully indexed file data');
    const button = screen.getByRole('button', { name: 'import-file-button' });
    jest.spyOn(serviceApiCalls, 'getIndex').mockImplementation(() => {
      return Promise.resolve(getIndexResponseWhenIndexIsNotPresent);
    });
    jest.spyOn(serviceApiCalls, 'postGeojson').mockImplementation(() => {
      return Promise.resolve(singleSuccessfulPostGeojsonResponse);
    });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it('renders the VectorUploadOptions component when we have a single failure during indexing', async () => {
    addUserInputToDOM();
    console.log('test case for partial failures during indexing');
    const button = screen.getByRole('button', { name: 'import-file-button' });
    jest.spyOn(serviceApiCalls, 'getIndex').mockImplementation(() => {
      return Promise.resolve(getIndexResponseWhenIndexIsNotPresent);
    });
    jest.spyOn(serviceApiCalls, 'postGeojson').mockImplementation(() => {
      return Promise.resolve(singlePartialFailurePostGeojsonResponse);
    });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it('renders the VectorUploadOptions component when we have multiple partial failures during indexing', async () => {
    addUserInputToDOM();
    console.log('test case for partial failures during indexing');
    const button = screen.getByRole('button', { name: 'import-file-button' });
    jest.spyOn(serviceApiCalls, 'getIndex').mockImplementation(() => {
      return Promise.resolve(getIndexResponseWhenIndexIsNotPresent);
    });
    jest.spyOn(serviceApiCalls, 'postGeojson').mockImplementation(() => {
      return Promise.resolve(multiplePartialFailuresPostGeojsonResponse);
    });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it('renders the VectorUploadOptions component when all the documents fail to index', async () => {
    addUserInputToDOM();
    console.log('test case for failed documents');
    const button = screen.getByRole('button', { name: 'import-file-button' });
    jest.spyOn(serviceApiCalls, 'getIndex').mockImplementation(() => {
      return Promise.resolve(getIndexResponseWhenIndexIsNotPresent);
    });
    jest.spyOn(serviceApiCalls, 'postGeojson').mockImplementation(() => {
      return Promise.resolve(noDocumentsIndexedPostGeojsonResponse);
    });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it('renders the VectorUploadOptions component when postGeojson call fails', async () => {
    addUserInputToDOM();
    console.log('test case for call failure to postGeojson');
    const button = screen.getByRole('button', { name: 'import-file-button' });
    jest.spyOn(serviceApiCalls, 'getIndex').mockImplementation(() => {
      return Promise.resolve(getIndexResponseWhenIndexIsNotPresent);
    });
    jest.spyOn(serviceApiCalls, 'postGeojson').mockImplementation(() => {
      return Promise.resolve(failedPostGeojsonResponse);
    });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it('renders the VectorUploadOptions component when getIndex returns a duplicate index', async () => {
    addUserInputToDOM();
    console.log('test case for duplicate index check');
    const button = screen.getByRole('button', { name: 'import-file-button' });
    jest.spyOn(serviceApiCalls, 'getIndex').mockImplementation(() => {
      return Promise.resolve(getIndexResponseWhenIndexIsPresent);
    });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it('renders the VectorUploadOptions component when uploaded file size is zero', async () => {
    const { getByTestId } = render(<VectorUploadOptions {...props} />);
    const indexName = screen.getByTestId('customIndex');
    fireEvent.change(indexName, { target: { value: 'sample' } });
    const uploader = getByTestId('filePicker');
    const file = new File([], 'sample.json', { type: 'application/JSON' });
    File.prototype.text = jest.fn().mockResolvedValueOnce(JSON.stringify([]));
    await fireEvent.change(uploader, {
      target: { files: [file] },
    });
    await expect(uploader.files[0].name).toBe('sample.json');
    const button = screen.getByRole('button', { name: 'import-file-button' });
    jest.spyOn(serviceApiCalls, 'getIndex').mockImplementation(() => {
      return Promise.resolve(getIndexResponseWhenIndexIsNotPresent);
    });
    jest.spyOn(serviceApiCalls, 'postGeojson').mockImplementation(() => {
      return Promise.resolve(multipleSuccessfulPostGeojsonResponse);
    });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it('renders danger toast as file format is not geojson or json', async () => {
    const { getByTestId } = render(<VectorUploadOptions {...props} />);
    const indexName = screen.getByTestId('customIndex');
    fireEvent.change(indexName, { target: { value: 'sample' } });
    const uploader = getByTestId('filePicker');
    const file = new File([], 'sample.txt', { type: 'text/plain' });
    File.prototype.text = jest.fn().mockResolvedValueOnce(JSON.stringify([]));
    await fireEvent.change(uploader, {
      target: { files: [file] },
    });
    await expect(uploader.files[0].name).toBe('sample.txt');
  });

  it('renders the VectorUploadOptions component when uploaded file size is >25 MB', async () => {
    const { getByTestId } = render(<VectorUploadOptions {...props} />);
    const indexName = screen.getByTestId('customIndex');
    fireEvent.change(indexName, { target: { value: 'sample' } });
    const uploader = getByTestId('filePicker');
    const jsonData = {
      type: 'FeatureCollection',
      name: 'sample',
      features: [
        {
          type: 'Feature',
          properties: { name: 'sample' },
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ],
    };
    const jsonDataArray = [];
    const max = 100000;
    for (; jsonDataArray.push(jsonData) < max; );
    const str = JSON.stringify(jsonDataArray);
    const blob = new Blob([str]);
    const file = new File([blob], 'sample.json', { type: 'application/JSON' });
    File.prototype.text = jest.fn().mockResolvedValueOnce(JSON.stringify(jsonDataArray));
    await fireEvent.change(uploader, {
      target: { files: [file] },
    });
    await expect(uploader.files[0].name).toBe('sample.json');
  });
});

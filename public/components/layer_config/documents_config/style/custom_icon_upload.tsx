/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  EuiButton,
  EuiCompressedFieldText,
  EuiCompressedFormRow,
  EuiFilePicker,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiSpacer,
  EuiTitle,
  EuiText,
  EuiCallOut,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { CoreStart } from '../../../../../../src/core/public';

interface CustomIconUploadProps {
  http: CoreStart['http'];
  notifications: CoreStart['notifications'];
  onUploadSuccess: (iconId: string, iconName: string, svg: string) => void;
  onClose: () => void;
}

const MAX_SVG_SIZE = 100 * 1024; // 100KB

const validateSvg = (content: string): { valid: boolean; error?: string } => {
  if (!content.includes('<svg')) {
    return {
      valid: false,
      error: i18n.translate('maps.icons.upload.invalidSvg', {
        defaultMessage: 'File does not appear to be a valid SVG',
      }),
    };
  }
  return { valid: true };
};

export const CustomIconUpload = ({
  http,
  notifications,
  onUploadSuccess,
  onClose,
}: CustomIconUploadProps) => {
  const [iconName, setIconName] = useState('');
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const filePickerRef = useRef<EuiFilePicker>(null);

  const onFileChange = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) {
      setSvgContent(null);
      setFileName(null);
      setValidationError(null);
      return;
    }

    const file = files[0];
    setFileName(file.name);

    if (!file.name.endsWith('.svg')) {
      setValidationError(
        i18n.translate('maps.icons.upload.svgOnly', {
          defaultMessage: 'Only SVG files are supported',
        })
      );
      setSvgContent(null);
      return;
    }

    // Check byte size from File object before reading into memory
    if (file.size > MAX_SVG_SIZE) {
      setValidationError(
        i18n.translate('maps.icons.upload.tooLarge', {
          defaultMessage: 'SVG file must be less than 100KB',
        })
      );
      setSvgContent(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const validation = validateSvg(content);
      if (!validation.valid) {
        setValidationError(validation.error!);
        setSvgContent(null);
      } else {
        setValidationError(null);
        setSvgContent(content);
        // Auto-fill name from filename if not set
        if (!iconName) {
          const nameFromFile = file.name.replace(/\.svg$/i, '').replace(/[-_]/g, ' ');
          setIconName(nameFromFile);
        }
      }
    };
    reader.readAsText(file);
  }, [iconName]);

  const onUpload = useCallback(async () => {
    if (!svgContent || !iconName.trim()) {
      return;
    }

    setIsUploading(true);
    try {
      const result = await http.post('/api/maps-dashboards/icons', {
        body: JSON.stringify({
          name: iconName.trim(),
          svg: svgContent,
        }),
      });

      notifications.toasts.addSuccess(
        i18n.translate('maps.icons.upload.success', {
          defaultMessage: 'Icon "{name}" uploaded successfully',
          values: { name: iconName },
        })
      );

      onUploadSuccess((result as any).id, iconName.trim(), svgContent);
      onClose();
    } catch (error: any) {
      notifications.toasts.addDanger(
        i18n.translate('maps.icons.upload.error', {
          defaultMessage: 'Failed to upload icon: {message}',
          values: { message: error.body?.message || error.message || 'Unknown error' },
        })
      );
    } finally {
      setIsUploading(false);
    }
  }, [svgContent, iconName, http, notifications, onUploadSuccess, onClose]);

  const isUploadDisabled = !svgContent || !iconName.trim() || !!validationError || isUploading;

  return (
    <EuiFlyout onClose={onClose} size="s" aria-labelledby="customIconUploadTitle">
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2 id="customIconUploadTitle">
            {i18n.translate('maps.icons.upload.title', {
              defaultMessage: 'Upload custom icon',
            })}
          </h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiText size="s" color="subdued">
          {i18n.translate('maps.icons.upload.description', {
            defaultMessage:
              'Upload an SVG file to use as a custom map icon. The icon will be available across all maps.',
          })}
        </EuiText>
        <EuiSpacer size="m" />
        {validationError && (
          <>
            <EuiCallOut
              title={validationError}
              color="danger"
              iconType="alert"
              size="s"
            />
            <EuiSpacer size="m" />
          </>
        )}
        <EuiCompressedFormRow
          label={i18n.translate('maps.icons.upload.nameLabel', {
            defaultMessage: 'Icon name',
          })}
          fullWidth={true}
        >
          <EuiCompressedFieldText
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            placeholder={i18n.translate('maps.icons.upload.namePlaceholder', {
              defaultMessage: 'Enter a name for this icon',
            })}
            fullWidth={true}
          />
        </EuiCompressedFormRow>
        <EuiSpacer size="m" />
        <EuiCompressedFormRow
          label={i18n.translate('maps.icons.upload.fileLabel', {
            defaultMessage: 'SVG file',
          })}
          fullWidth={true}
        >
          <EuiFilePicker
            ref={filePickerRef}
            accept=".svg"
            onChange={onFileChange}
            display="default"
            fullWidth={true}
            initialPromptText={i18n.translate('maps.icons.upload.filePrompt', {
              defaultMessage: 'Select or drag and drop an SVG file',
            })}
          />
        </EuiCompressedFormRow>
        {svgContent && (
          <>
            <EuiSpacer size="m" />
            <EuiCompressedFormRow
              label={i18n.translate('maps.icons.upload.previewLabel', {
                defaultMessage: 'Preview',
              })}
              fullWidth={true}
            >
              <EuiFlexGroup justifyContent="center" alignItems="center">
                <EuiFlexItem grow={false}>
                  <img
                    src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`}
                    width={48}
                    height={48}
                    alt="Icon preview"
                    style={{
                      border: '1px solid #D3DAE6',
                      borderRadius: 4,
                      padding: 8,
                    }}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiCompressedFormRow>
          </>
        )}
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiButton onClick={onClose} color="text">
              {i18n.translate('maps.icons.upload.cancel', { defaultMessage: 'Cancel' })}
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              onClick={onUpload}
              fill
              isDisabled={isUploadDisabled}
              isLoading={isUploading}
            >
              {i18n.translate('maps.icons.upload.uploadButton', { defaultMessage: 'Upload' })}
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
};

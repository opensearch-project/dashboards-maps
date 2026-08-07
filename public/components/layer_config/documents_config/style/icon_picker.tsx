/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
  EuiButtonEmpty,
  EuiTabs,
  EuiTab,
  EuiSpacer,
  EuiToolTip,
  EuiText,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import {
  ALL_BUILT_IN_ICONS,
  getBuiltInIconById,
  DEFAULT_ICON_ID,
  DEFAULT_ICON_FILL_COLOR,
  DEFAULT_ICON_STROKE_COLOR,
  applyIconColors,
} from '../../../map_icons';
import { useOpenSearchDashboards } from '../../../../../../../src/plugins/opensearch_dashboards_react/public';
import { CustomIconUpload } from './custom_icon_upload';

interface IconPickerProps {
  selectedIconId: string;
  onIconSelect: (iconId: string, svg?: string) => void;
}

interface CustomIcon {
  id: string;
  name: string;
  svg: string;
}

interface CustomIconMetadata {
  id: string;
  name: string;
}

const ICON_BUTTON_SIZE = 32;

const IconPreview = ({ svg, size = 20 }: { svg: string; size?: number }) => {
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return (
    <img
      src={dataUrl}
      width={size}
      height={size}
      alt=""
      style={{ display: 'inline-block' }}
    />
  );
};

export const IconPicker = ({ selectedIconId, onIconSelect }: IconPickerProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'builtin' | 'custom'>('builtin');
  const [customIcons, setCustomIcons] = useState<CustomIcon[]>([]);
  const [showUploadFlyout, setShowUploadFlyout] = useState(false);

  const { services } = useOpenSearchDashboards();
  const http = services.http!;
  const notifications = services.notifications!;

  // Load custom icons — list returns metadata only, then fetch each SVG
  const loadCustomIcons = useCallback(async () => {
    try {
      const response = (await http.get('/api/maps-dashboards/icons')) as { icons: CustomIconMetadata[] };
      const iconMetadataList = response.icons || [];

      // Fetch SVG content for each icon
      const iconsWithSvg = await Promise.all(
        iconMetadataList.map(async (meta) => {
          try {
            const detail = (await http.get(`/api/maps-dashboards/icons/${meta.id}`)) as CustomIcon;
            return { id: meta.id, name: meta.name, svg: detail.svg };
          } catch {
            return { id: meta.id, name: meta.name, svg: '' };
          }
        })
      );
      setCustomIcons(iconsWithSvg.filter((icon) => icon.svg));
    } catch (e) {
      setCustomIcons([]);
    }
  }, [http]);

  useEffect(() => {
    loadCustomIcons();
  }, [loadCustomIcons]);

  const deleteCustomIcon = useCallback(
    async (iconIdToDelete: string) => {
      try {
        await http.delete(`/api/maps-dashboards/icons/${iconIdToDelete}`);
        setCustomIcons((prev) => prev.filter((icon) => icon.id !== iconIdToDelete));
        notifications.toasts.addSuccess(
          i18n.translate('maps.documents.iconDeleted', {
            defaultMessage: 'Icon deleted',
          })
        );
      } catch (e: any) {
        notifications.toasts.addDanger(
          i18n.translate('maps.documents.iconDeleteFailed', {
            defaultMessage: 'Failed to delete icon',
          })
        );
      }
    },
    [http, notifications]
  );

  // Check if selected icon is a custom one
  const selectedBuiltIn = getBuiltInIconById(selectedIconId);
  const selectedCustom = customIcons.find((icon) => icon.id === selectedIconId);
  const selectedIcon = selectedBuiltIn || selectedCustom;

  const togglePopover = () => setIsPopoverOpen(!isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  const handleIconClick = (iconId: string, svg: string) => {
    onIconSelect(iconId, svg);
    closePopover();
  };

  const handleUploadSuccess = (iconId: string, iconName: string, svg: string) => {
    setCustomIcons((prev) => [...prev, { id: iconId, name: iconName, svg }]);
    onIconSelect(iconId, svg);
  };

  const tabs = [
    {
      id: 'builtin',
      name: i18n.translate('maps.documents.iconSetBuiltIn', { defaultMessage: 'Built-in' }),
    },
    {
      id: 'custom',
      name: i18n.translate('maps.documents.iconSetCustom', { defaultMessage: 'Custom' }),
    },
  ];

  const getIconsForTab = () => {
    if (selectedTab === 'custom') {
      return customIcons.map((icon) => ({
        id: icon.id,
        name: icon.name,
        svg: icon.svg,
      }));
    }
    return ALL_BUILT_IN_ICONS;
  };

  const iconsToShow = getIconsForTab();

  // For built-in icon preview in the picker, show with default colors
  const getPreviewSvg = (icon: { id: string; svg: string }): string => {
    const builtIn = getBuiltInIconById(icon.id);
    if (builtIn) {
      return applyIconColors(builtIn.svg, DEFAULT_ICON_FILL_COLOR, DEFAULT_ICON_STROKE_COLOR, 'filled');
    }
    return icon.svg;
  };

  // Preview the selected icon in the trigger button with default colors
  const triggerPreviewSvg = selectedIcon
    ? getBuiltInIconById(selectedIcon.id)
      ? applyIconColors(selectedIcon.svg, DEFAULT_ICON_FILL_COLOR, DEFAULT_ICON_STROKE_COLOR, 'filled')
      : selectedIcon.svg
    : undefined;

  const button = (
    <EuiButtonEmpty
      onClick={togglePopover}
      iconType="arrowDown"
      iconSide="right"
      size="s"
      style={{ width: '100%', justifyContent: 'space-between' }}
    >
      <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
        <EuiFlexItem grow={false}>
          {triggerPreviewSvg && <IconPreview svg={triggerPreviewSvg} size={16} />}
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <span>{selectedIcon?.name || 'Select icon'}</span>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiButtonEmpty>
  );

  return (
    <>
      <EuiPopover
        button={button}
        isOpen={isPopoverOpen}
        closePopover={closePopover}
        panelPaddingSize="s"
        anchorPosition="downLeft"
      >
        <div style={{ width: 280 }}>
          <EuiTabs size="s">
            {tabs.map((tab) => (
              <EuiTab
                key={tab.id}
                isSelected={selectedTab === tab.id}
                onClick={() => setSelectedTab(tab.id as 'builtin' | 'custom')}
              >
                {tab.name}
              </EuiTab>
            ))}
          </EuiTabs>
          <EuiSpacer size="s" />
          {selectedTab === 'custom' && iconsToShow.length === 0 && (
            <>
              <EuiText size="s" color="subdued" textAlign="center">
                {i18n.translate('maps.documents.noCustomIcons', {
                  defaultMessage: 'No custom icons uploaded yet.',
                })}
              </EuiText>
              <EuiSpacer size="s" />
            </>
          )}
          <EuiFlexGroup wrap responsive={false} gutterSize="xs">
            {iconsToShow.map((icon) => (
              <EuiFlexItem key={icon.id} grow={false}>
                <EuiToolTip
                  content={
                    selectedTab === 'custom'
                      ? `${icon.name} (right-click to delete)`
                      : icon.name
                  }
                  position="top"
                >
                  <button
                    type="button"
                    onClick={() => handleIconClick(icon.id, icon.svg)}
                    onContextMenu={
                      selectedTab === 'custom'
                        ? (e) => {
                            e.preventDefault();
                            if (
                              window.confirm(
                                `Delete icon "${icon.name}"? Layers using it will show a placeholder.`
                              )
                            ) {
                              deleteCustomIcon(icon.id);
                            }
                          }
                        : undefined
                    }
                    aria-label={icon.name}
                    style={{
                      width: ICON_BUTTON_SIZE,
                      height: ICON_BUTTON_SIZE,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border:
                        selectedIconId === icon.id
                          ? '2px solid #006BB4'
                          : '1px solid transparent',
                      borderRadius: 4,
                      cursor: 'pointer',
                      background:
                        selectedIconId === icon.id ? 'rgba(0, 107, 180, 0.1)' : 'transparent',
                      padding: 2,
                    }}
                  >
                    <IconPreview svg={getPreviewSvg(icon)} size={20} />
                  </button>
                </EuiToolTip>
              </EuiFlexItem>
            ))}
          </EuiFlexGroup>
          {selectedTab === 'custom' && (
            <>
              <EuiSpacer size="s" />
              <EuiButtonEmpty
                size="s"
                iconType="plusInCircle"
                onClick={() => {
                  closePopover();
                  setShowUploadFlyout(true);
                }}
                style={{ width: '100%' }}
              >
                {i18n.translate('maps.documents.uploadCustomIcon', {
                  defaultMessage: 'Upload custom icon',
                })}
              </EuiButtonEmpty>
            </>
          )}
        </div>
      </EuiPopover>
      {showUploadFlyout && (
        <CustomIconUpload
          http={http}
          notifications={notifications}
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUploadFlyout(false)}
        />
      )}
    </>
  );
};

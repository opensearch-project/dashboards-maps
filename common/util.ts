/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { i18n } from '@osd/i18n';
import { OSD_LANGUAGES, FALLBACK_LANGUAGE } from './index';

export const fromMBtoBytes = (sizeInMB: number) => {
  return sizeInMB * 1024 * 1024;
};

export const getMapLanguage = () => {
  const OSDLanguage = i18n.getLocale().toLowerCase(),
    parts = OSDLanguage.split('-');
  const languageCode = parts.length > 1 ? parts[0] : OSDLanguage;
  return OSD_LANGUAGES.includes(languageCode) ? languageCode : FALLBACK_LANGUAGE;
};

export function isEscapeKey(e: KeyboardEvent) {
  return e.code === 'Escape';
}

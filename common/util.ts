/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { i18n } from '@osd/i18n';

export const fromMBtoBytes = (sizeInMB: number) => {
  return sizeInMB * 1024 * 1024;
};

//refer https://github.com/opensearch-project/i18n-plugin/blob/main/DEVELOPER_GUIDE.md#new-locale for OSD supported languages
const OSD_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja', 'ko', 'zh'], // all these codes are also supported in vector tiles map
  FALLBACK_LANGUAGE = 'en';

export const getMapLanguage = () => {
  const OSDLanguage = i18n.getLocale().toLowerCase(),
    parts = OSDLanguage.split('-');
  const languageCode = parts.length > 1 ? parts[0] : OSDLanguage;
  return OSD_LANGUAGES.includes(languageCode) ? languageCode : FALLBACK_LANGUAGE;
};

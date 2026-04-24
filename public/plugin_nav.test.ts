/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { coreMock } from '../../../src/core/public/mocks';
import { DEFAULT_APP_CATEGORIES, DEFAULT_NAV_GROUPS } from '../../../src/core/utils';
import { CustomImportMapPlugin } from './plugin';

jest.mock('@osd/monaco', () => ({
  monaco: {
    languages: {
      CompletionItemKind: { Function: 1, Field: 4, Module: 6, Operator: 12, Keyword: 14 },
      CompletionItemInsertTextRule: { InsertAsSnippet: 4 },
      registerCompletionItemProvider: jest.fn(),
    },
    editor: { create: jest.fn(), defineTheme: jest.fn() },
    Range: jest.fn(),
  },
}));

// Mock dynamic imports and dependencies
jest.mock('./application', () => ({
  renderApp: jest.fn(() => jest.fn()),
}));
jest.mock('./embeddable', () => ({
  MapEmbeddableFactoryDefinition: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('../../../src/plugins/opensearch_dashboards_react/public', () => ({
  OpenSearchDashboardsContextProvider: jest.fn(({ children }) => children),
}));

describe('CustomImportMapPlugin nav registration', () => {
  let coreSetup: ReturnType<typeof coreMock.createSetup>;
  let plugin: CustomImportMapPlugin;

  const mockSetupDeps = {
    regionMap: { addOptionTab: jest.fn() },
    embeddable: { registerEmbeddableFactory: jest.fn() },
    visualizations: {
      registerAlias: jest.fn(),
    },
  } as any;

  beforeEach(() => {
    coreSetup = coreMock.createSetup();
    coreSetup.chrome.navGroup.getNavGroupEnabled.mockReturnValue(true);
    if (!coreSetup.chrome.getIsIconSideNavEnabled) {
      coreSetup.chrome.getIsIconSideNavEnabled = jest.fn();
    }
    const initializerContext = coreMock.createPluginInitializerContext();
    plugin = new CustomImportMapPlugin(initializerContext);
  });

  it('should register maps in observability when icon side nav is disabled', () => {
    (coreSetup.chrome.getIsIconSideNavEnabled as jest.Mock).mockReturnValue(false);

    plugin.setup(coreSetup, mockSetupDeps);

    const calls = (coreSetup.chrome.navGroup.addNavLinksToGroup as jest.Mock).mock.calls;

    // When icon side nav is OFF, maps should be in observability
    const observabilityCall = calls.find(
      (call: any) =>
        call[0] === DEFAULT_NAV_GROUPS.observability &&
        call[1].some(
          (link: any) =>
            link.id === 'maps-dashboards' &&
            link.category === DEFAULT_APP_CATEGORIES.visualizeAndReport
        )
    );
    expect(observabilityCall).toBeDefined();
  });

  it('should not register maps in observability when icon side nav is enabled', () => {
    (coreSetup.chrome.getIsIconSideNavEnabled as jest.Mock).mockReturnValue(true);

    plugin.setup(coreSetup, mockSetupDeps);

    const calls = (coreSetup.chrome.navGroup.addNavLinksToGroup as jest.Mock).mock.calls;

    // When icon side nav is ON, maps should NOT be in observability
    const observabilityCall = calls.find(
      (call: any) =>
        call[0] === DEFAULT_NAV_GROUPS.observability &&
        call[1].some((link: any) => link.id === 'maps-dashboards')
    );
    expect(observabilityCall).toBeUndefined();

    // But should still be registered in search and all nav groups
    const searchCall = calls.find(
      (call: any) =>
        call[0] === DEFAULT_NAV_GROUPS.search &&
        call[1].some((link: any) => link.id === 'maps-dashboards')
    );
    expect(searchCall).toBeDefined();

    const allCall = calls.find(
      (call: any) =>
        call[0] === DEFAULT_NAV_GROUPS.all &&
        call[1].some((link: any) => link.id === 'maps-dashboards')
    );
    expect(allCall).toBeDefined();
  });
});

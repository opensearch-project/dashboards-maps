/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BASE_PATH } from '../utils/constants';

describe('Add map to dashboard', () => {
  before(() => {
    cy.visit(`${BASE_PATH}/app/home#/tutorial_directory/sampleData`, {
      retryOnStatusCodeFailure: true,
      timeout: 60000,
    });
    cy.get('div[data-test-subj="sampleDataSetCardflights"]', { timeout: 60000 })
      .contains(/(Add|View) data/)
      .click();
    cy.wait(60000);
  });

  it('Add new map to dashboard', () => {
    const testMapName = 'saved-map-' + Date.now().toString();
    cy.visit(`${BASE_PATH}/app/dashboards`);
    cy.get('button[data-test-subj="newItemButton"]').click();
    cy.get('button[data-test-subj="dashboardAddNewPanelButton"]').click();
    cy.get('button[data-test-subj="visType-customImportMap"]').click();
    cy.wait(5000).get('button[data-test-subj="mapSaveButton"]').click();
    cy.wait(5000).get('[data-test-subj="savedObjectTitle"]').type(testMapName);
    cy.wait(5000).get('[data-test-subj="confirmSaveSavedObjectButton"]').click();
    cy.get('.embPanel__titleText').should('contain', testMapName);
  });

  after(() => {
    cy.visit(`${BASE_PATH}/app/home#/tutorial_directory`);
    cy.get('button[data-test-subj="removeSampleDataSetflights"]').should('be.visible').click();
  });
});

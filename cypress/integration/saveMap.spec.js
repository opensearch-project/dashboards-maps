/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BASE_PATH } from '../utils/constants';

describe('Open and save map', () => {
  before(() => {
    cy.wait(180000).visit(`${BASE_PATH}/app/home#/tutorial_directory/sampleData`);
    cy.get('div[data-test-subj="sampleDataSetCardflights"]', { timeout: 60000 })
      .contains(/(Add|View) data/)
      .click();
  });

  it('check if map can be saved', () => {
    cy.visit(`${BASE_PATH}/app/maps-dashboards`);
    cy.contains('Create map').click();
    cy.get(`nav[data-test-subj="top-nav"]`).click();
    const uniqueName = 'saved-map-' + Date.now().toString();
    cy.get(`input[data-test-subj="savedObjectTitle"]`).type(uniqueName);
    cy.get(`button[data-test-subj="confirmSaveSavedObjectButton"]`).click();
    cy.contains(uniqueName);
    cy.url().should('not.include', 'create');
    cy.visit(`${BASE_PATH}/app/maps-dashboards`);
    cy.contains(uniqueName);
  });
});

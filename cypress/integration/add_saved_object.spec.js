/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BASE_PATH } from '../utils/constants';

describe('Add flights dataset saved object', () => {
  before(() => {
    cy.visit(`${BASE_PATH}/app/maps-dashboards`, {
      retryOnStatusCodeFailure: true,
      timeout: 60000,
    });
    cy.get('div[data-test-subj="indexPatternEmptyState"]', { timeout: 60000 })
      .contains(/Add sample data/)
      .click();
    cy.get('div[data-test-subj="sampleDataSetCardflights"]', { timeout: 60000 })
      .contains(/Add data/)
      .click();
    cy.wait(60000);
  });

  after(() => {
    cy.visit(`${BASE_PATH}/app/home#/tutorial_directory`);
    cy.get('button[data-test-subj="removeSampleDataSetflights"]').should('be.visible').click();
  });

  it('check if maps saved object of flights dataset can be found and open', () => {
    cy.visit(`${BASE_PATH}/app/maps-dashboards`);
    cy.contains('[Flights] Maps Cancelled Flights Destination Location').click();
    cy.get('[data-test-subj="layerControlPanel"]').should('contain', 'Cancelled flights');
  });
});

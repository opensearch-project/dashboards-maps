/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BASE_PATH } from '../utils/constants';

describe('Documents layer', () => {
  before(() => {
    cy.wait(180000).visit(`${BASE_PATH}/app/home#/tutorial_directory/sampleData`);
    cy.get('div[data-test-subj="sampleDataSetCardflights"]', { timeout: 60000 })
      .contains(/(Add|View) data/)
      .click();
  });

  it('check if documents layer can be added', () => {
    cy.visit(`${BASE_PATH}/app/maps-dashboards`);
    cy.contains('Create map').click();
    cy.get('canvas.maplibregl-canvas').trigger('mousemove', {
      x: 600,
      y: 100,
      force: true,
    });
    cy.get("button[data-test-subj='addLayerButton']").click();
    cy.contains('Documents').click();
    cy.contains('Select data source', { timeout: 60000 }).click({ force: true });
    cy.contains('opensearch_dashboards_sample_data_flights').click();
    cy.contains('Select data field', { timeout: 60000 }).click({ force: true });
    cy.contains('DestLocation').click();
    cy.get(`button[testSubj="styleTab"]`).click();
    cy.contains('Fill color').click();
    cy.get(`button[aria-label="Select #E7664C as the color"]`).click();
    cy.contains('Border color').click();
    cy.get(`button[aria-label="Select #E7664C as the color"]`).click();
    cy.get(`button[data-test-subj="updateButton"]`).click();
    cy.get(`button[data-test-subj="superDatePickerToggleQuickMenuButton"]`).click();
    cy.get(`button[data-test-subj="superDatePickerCommonlyUsed_Last_24 hours"]`).click();
    cy.wait(15000).matchImageSnapshot();
  });
});

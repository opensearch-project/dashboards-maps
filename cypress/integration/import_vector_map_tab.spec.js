/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="cypress" />

import { BASE_PATH } from '../utils/constants';

describe('Verify the presence of import custom map tab in region map plugin', () => {
  before(() => {
    cy.wait(120000);
    cy.visit(`${BASE_PATH}/app/home#/tutorial_directory/sampleData`);
    cy.get('div[data-test-subj="sampleDataSetCardflights"]', { timeout: 60000 })
      .contains(/(Add|View) data/)
      .click();

    cy.visit(`${BASE_PATH}/app/visualize#/`);

    // Click on "Create Visualization" tab
    cy.contains('Create visualization').click({ force: true });

    // Click on "Region Map" icon
    cy.contains('Region Map').click({ force: true });

    // Select index source - [Flights] Flight Log
    cy.contains('[Flights] Flight Log').click({ force: true });
  });

  it('checks import custom map tab is present', () => {
    // Click on "Import Vector Map" tab, which is part of customImportMap plugin
    cy.contains('Import Vector Map').click({ force: true });
  });

  after(() => {
    cy.visit(`${BASE_PATH}/app/home#/tutorial_directory`);
    cy.get('button[data-test-subj="removeSampleDataSetflights"]').should('be.visible').click();
  });
});

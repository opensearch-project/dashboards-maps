/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="cypress" />

import { BASE_PATH } from '../utils/constants';
import 'cypress-file-upload';

describe('Verify successful custom geojson file upload', () => {
  before(() => {
    cy.visit(`${BASE_PATH}/app/home#/tutorial_directory/sampleData`);
    // Click on "Sample data" tab
    cy.contains('Sample data').click({ force: true });
    // Load sample flights data
    cy.get(`button[data-test-subj="addSampleDataSetflights"]`).click({
      force: true,
    });

    // Verify that sample data is add by checking toast notification
    cy.contains('Sample flight data installed', { timeout: 240000 });

    cy.visit(`${BASE_PATH}/app/visualize#/`);

    // Click on "Create Visualization" tab
    cy.contains('Create visualization').click({ force: true });

    // Click on "Region Map" icon
    cy.contains('Region Map').click({ force: true });

    // Select index source - [Flights] Flight Log
    cy.contains('[Flights] Flight Log').click({ force: true });
  });

  it('checks if the file uploaded successfully', () => {
    // Click on "Import Vector Map" tab, which is part of customImportMap plugin
    cy.contains('Import Vector Map').click({ force: true });

    cy.get('[data-testId="filePicker"]').attachFile('sample_geojson.json');
    cy.get('[data-testId="customIndex"]').type('sample');
    cy.contains('Import file').click({ force: true });
    cy.contains('Successfully added 2 features to sample-map. Refresh to visualize the uploaded map.', { timeout: 240000 });
  })

  after(() => {
    cy.visit(`${BASE_PATH}/app/home#/tutorial_directory`);
    cy.get('button[data-test-subj="removeSampleDataSetflights"]').should('be.visible').click();
  })
});

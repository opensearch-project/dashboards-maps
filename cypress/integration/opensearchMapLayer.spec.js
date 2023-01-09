/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BASE_PATH } from '../utils/constants';

describe('Default OpenSearch base map layer', () => {
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

  it('check if default OpenSearch map layer can be open', () => {
    cy.visit(`${BASE_PATH}/app/maps-dashboards`);
    cy.contains('Create map').click();
    cy.get('[data-test-subj="layerControlPanel"]').should('contain', 'Default map');
    cy.get('canvas.maplibregl-canvas').trigger('mousemove', {
      x: 100,
      y: 100,
      force: true,
    });
    cy.get('canvas.maplibregl-canvas').trigger('mousemove', {
      x: 200,
      y: 200,
      force: true,
    });
    for (let i = 0; i < 21; i++) {
      cy.wait(1000).get('canvas.maplibregl-canvas').trigger('dblclick', { force: true });
    }
    cy.get('[data-test-subj="mapStatusBar"]').should('contain', 'zoom: 22');
  });
});

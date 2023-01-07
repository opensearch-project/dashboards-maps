/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BASE_PATH } from '../utils/constants';

describe('Default OpenSearch base map layer', () => {
  before(() => {
    cy.wait(180000).visit(`${BASE_PATH}/app/home#/tutorial_directory/sampleData`);
    cy.get('div[data-test-subj="sampleDataSetCardflights"]', { timeout: 60000 })
      .contains(/(Add|View) data/)
      .click();
  });

  it('check if default OpenSearch map can be open', () => {
    cy.visit(`${BASE_PATH}/app/maps-dashboards`);
    cy.contains('Create map').click();
    cy.get('canvas.maplibregl-canvas').trigger('mousemove', {
      x: 600,
      y: 100,
      force: true,
    });
    cy.get('canvas.maplibregl-canvas').trigger('dblclick', { force: true });
    cy.wait(15000).matchImageSnapshot();
  });
});

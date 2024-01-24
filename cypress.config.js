const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: true,
  defaultCommandTimeout: 120000,
  env: {
    opensearch_url: 'localhost:9200',
    opensearch_dashboards: 'http://localhost:5601',
    security_enabled: false,
    base_url: 'http://localhost:5601',
    username: 'admin',
    password: 'admin',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
  },
})

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    env: {
      API_URL: 'https://api.clickup.com/api/v2',
      SPACE_ID: '90155091041',
      TOKEN: 'pk_188620723_8L0Z3A8MOHZBATG8T6726UMN7PB6ENTC',
      allureLogCypress: false,
      allureReuseAfterSpec: true
    },
    setupNodeEvents(on, config) {
      require('@shelex/cypress-allure-plugin/writer')(on, config);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,ts}',
  }
});
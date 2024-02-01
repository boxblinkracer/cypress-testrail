const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const {addCucumberPreprocessorPlugin} = require('@badeball/cypress-cucumber-preprocessor');
const {createEsbuildPlugin} = require('@badeball/cypress-cucumber-preprocessor/esbuild');

const {defineConfig} = require('cypress');

const TestRailReporter = require('../../src/../index');

module.exports = defineConfig({

    watchForFileChanges: false,

    e2e: {

        baseUrl: 'https://www.boxblinkracer.com',
        viewportWidth: 1500,
        viewportHeight: 1000,

        specPattern: ['cypress/e2e/**/*.feature', 'cypress/e2e/**/*.js'],

        async setupNodeEvents(cypressOn, config) {

            const on = require('cypress-on-fix')(cypressOn)

            await addCucumberPreprocessorPlugin(on, config);

            on('file:preprocessor', createBundler({
                plugins: [createEsbuildPlugin(config)],
            }));

            new TestRailReporter(on, config).register();

            return config
        },
    },
});

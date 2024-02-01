import TestRailReporter from '../../index.js';

import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import {addCucumberPreprocessorPlugin} from '@badeball/cypress-cucumber-preprocessor';
import {createEsbuildPlugin} from '@badeball/cypress-cucumber-preprocessor/esbuild';
import {defineConfig} from 'cypress';


export default defineConfig({

    watchForFileChanges: false,

    e2e: {

        baseUrl: 'https://www.boxblinkracer.com',
        viewportWidth: 1500,
        viewportHeight: 1000,

        specPattern: ['cypress/e2e/**/*.feature', 'cypress/e2e/**/*.js'],

        async setupNodeEvents(on, config) {

            new TestRailReporter(on, config).register();

            await addCucumberPreprocessorPlugin(on, config);

            on('file:preprocessor', createBundler({
                plugins: [createEsbuildPlugin(config)],
            }));

            return config
        },
    },
});

const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {

            const TestRailReporter = require('../../src/../index');

            new TestRailReporter(on, config).register();
            return config
        },
    },
});

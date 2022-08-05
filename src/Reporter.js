const ApiClient = require('./components/TestRail/ApiClient');
const TestCaseParser = require('./services/TestCaseParser');
const Result = require('./components/TestRail/Result');
const ConfigService = require('./services/ConfigService');
const TestData = require('./components/Cypress/TestData');


class Reporter {

    /**
     *
     * @param on
     * @param config
     */
    constructor(on, config) {
        this.on = on;

        this.testCaseParser = new TestCaseParser();
        /* eslint-disable no-undef */
        this.config = new ConfigService(config.env.testrail);
    }

    /**
     *
     */
    register() {

        this.on('before:run', (details) => {
            this.cypressVersion = details.cypressVersion;
            this.browser = details.browser.displayName + ' (' + details.browser.version + ')';
            this.system = details.system.osName + ' (' + details.system.osVersion + ')';
            this.baseURL = details.config.baseUrl;

            /* eslint-disable no-console */
            console.log('  Starting TestRail Integration');
            /* eslint-disable no-console */
            console.log('  ....................................................');
            /* eslint-disable no-console */
            console.log('  Cypress: ' + this.cypressVersion);
            /* eslint-disable no-console */
            console.log('  Browser: ' + this.browser);
            /* eslint-disable no-console */
            console.log('  System: ' + this.system);
            /* eslint-disable no-console */
            console.log('  Base URL: ' + this.baseURL);
        })

        this.on('after:spec', (spec, results) => {

            const specFile = spec.name;

            const api = new ApiClient(
                this.config.getDomain(),
                this.config.getUsername(),
                this.config.getPassword()
            );

            results.tests.forEach(test => {

                const testData = new TestData(test);

                if (!this.config.isValid()) {
                    return;
                }

                const caseId = this.testCaseParser.searchCaseId(testData.getTitle());

                if (caseId === '') {
                    return;
                }

                let status = this.config.getStatusPassed();

                if (testData.getState() !== 'passed') {
                    status = this.config.getStatusFailed();
                }

                const comment = 'Tested by Cypress ' + this.cypressVersion + '\n' +
                    'Browser: ' + this.browser + '\n' +
                    'Base URL: ' + this.baseURL + '\n' +
                    'System: ' + this.system + '\n' +
                    'Spec: ' + specFile + '\n' +
                    testData.getError();

                console.log('...sending results to TestRail for ' + caseId);
                const result = new Result(caseId, status, comment, testData.getDurationMS());
                api.sendResult(this.config.getRunId(), result);
            });

        })
    }

}

module.exports = Reporter;
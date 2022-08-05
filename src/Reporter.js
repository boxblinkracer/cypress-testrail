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
     * @param customComment provide a custom comment if you want to add something to the result comment
     */
    register(customComment) {

        if (customComment === undefined || customComment === null) {
            customComment = '';
        }

        this.customComment = customComment;


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
            /* eslint-disable no-console */
            console.log('  Comment: ' + this.customComment);
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

                let comment = 'Tested by Cypress';
                comment += '\nCypress: ' + this.cypressVersion;
                comment += '\nBrowser: ' + this.browser;
                comment += '\nBase URL: ' + this.baseURL;
                comment += '\nSystem: ' + this.system;
                comment += '\nSpec: ' + specFile;

                if (this.customComment !== '') {
                    comment += '\n' + this.customComment;
                }

                if (testData.getError() !== '') {
                    comment += '\nError: ' + testData.getError();
                }

                console.log('...sending results to TestRail for ' + caseId);
                const result = new Result(caseId, status, comment, testData.getDurationMS());
                api.sendResult(this.config.getRunId(), result);
            });

        })
    }

}

module.exports = Reporter;
const ApiClient = require('./components/TestRail/ApiClient');
const TestCaseParser = require('./services/TestCaseParser');
const Result = require('./components/TestRail/Result');
const ConfigService = require('./services/ConfigService');
const TestData = require('./components/Cypress/TestData');
const ColorConsole = require('./services/ColorConsole');

class Reporter {
    /**
     *
     * @param on
     * @param config
     * @param customComment provide a custom comment if you want to add something to the result comment
     */
    constructor(on, config, customComment) {
        this.on = on;

        this.testCaseParser = new TestCaseParser();

        /* eslint-disable no-undef */
        const configService = new ConfigService(config.env);

        this.enabled = configService.isApiValid();

        this.domain = configService.getDomain();
        this.projectId = configService.getProjectId();
        this.milestoneId = configService.getMilestoneId();
        this.runId = configService.getRunId();
        this.runName = configService.getRunName();

        this.modeCreateRun = !configService.hasRunID();
        this.closeRun = configService.shouldCloseRun();
        this.foundCaseIds = [];

        this.statusPassed = configService.getStatusPassed();
        this.statusFailed = configService.getStatusFailed();

        this.customComment = customComment !== undefined && customComment !== null ? customComment : '';

        this.testRailApi = new ApiClient(configService.getDomain(), configService.getUsername(), configService.getPassword());
    }

    /**
     *
     */
    register() {
        // if our config is not valid
        // then do not even register anything
        if (!this.enabled) {
            return;
        }

        this.on('before:run', async (details) => {
            await this._beforeRun(details);
        });

        this.on('after:spec', async (spec, results) => {
            await this._afterSpec(spec, results);
        });

        this.on('after:run', async () => {
            await this._afterRun();
        });
    }

    /**
     *
     * @param details
     * @private
     */
    async _beforeRun(details) {
        this.cypressVersion = details.cypressVersion;
        this.browser = details.browser.displayName + ' (' + details.browser.version + ')';
        this.system = details.system.osName + ' (' + details.system.osVersion + ')';
        this.baseURL = details.config.baseUrl;

        ColorConsole.success('  Starting TestRail Integration');
        ColorConsole.debug('  ....................................................');
        ColorConsole.debug('  Cypress: ' + this.cypressVersion);
        ColorConsole.debug('  Browser: ' + this.browser);
        ColorConsole.debug('  System: ' + this.system);
        ColorConsole.debug('  Base URL: ' + this.baseURL);
        ColorConsole.debug('  TestRail Domain: ' + this.domain);

        if (this.modeCreateRun) {
            ColorConsole.debug('  TestRail Mode: Create Run');
            ColorConsole.debug('  TestRail Project ID: ' + this.projectId);
            ColorConsole.debug('  TestRail Milestone ID: ' + this.milestoneId);
            ColorConsole.debug('  TestRail Run Name: ' + this.runName);
        } else {
            ColorConsole.debug('  TestRail Mode: Use existing Run');
            ColorConsole.debug('  TestRail Run ID: ' + this.runId);
        }

        // if we don't have a runID, then we need to create one
        if (this.runId === '') {
            const today = new Date();
            const dateTime = today.toLocaleString();

            let runName = this.runName === '' ? 'Cypress Run (__datetime__)' : this.runName;

            // now use our current date time if
            // that placeholder has been used
            runName = runName.replace('__datetime__', dateTime);

            let description = '';
            description += 'Tested by Cypress';
            description += '\nCypress: ' + this.cypressVersion;
            description += '\nBrowser: ' + this.browser;
            description += '\nBase URL: ' + this.baseURL;
            description += '\nSystem: ' + this.system;

            if (this.customComment !== '') {
                description += '\n' + this.customComment;
            }

            await this.testRailApi.createRun(this.projectId, this.milestoneId, runName, description, (runId) => {
                // run created
                this.runId = runId;
                /* eslint-disable no-console */
                console.log('  New TestRail Run: R' + this.runId);
            });
        }
    }

    /**
     *
     * @param spec
     * @param results
     * @private
     */
    async _afterSpec(spec, results) {
        if (this.modeCreateRun) {
            // if we are in the mode to dynamically create runs
            // then we also need to add the new found runs to our created test run
            await results.tests.forEach((test) => {
                const testData = new TestData(test);

                const foundCaseIDs = this.testCaseParser.searchCaseId(testData.getTitle());

                foundCaseIDs.forEach((singleCase) => {
                    this.foundCaseIds.push(singleCase);
                });
            });

            await this.testRailApi.updateRun(this.runId, this.foundCaseIds);
        }

        await this._sendSpecResults(spec, results);
    }

    /**
     *
     * @private
     */
    async _afterRun() {
        if (this.modeCreateRun) {
            if (this.closeRun) {
                // if we have just created a run then automatically close it
                await this.testRailApi.closeRun(this.runId, () => {
                    /* eslint-disable no-console */
                    console.log('  TestRail Run: R' + this.runId + ' is now closed');
                });
            } else {
                /* eslint-disable no-console */
                console.log('  Skipping closing of Test Run');
            }
        }
    }

    /**
     *
     * @param spec
     * @param results
     * @returns {Promise<void>}
     * @private
     */
    async _sendSpecResults(spec, results) {
        const allRequests = [];

        // iterate through all our test results
        // and send the data to TestRail
        await results.tests.forEach(async (test) => {
            const testData = new TestData(test);

            const foundCaseIDs = this.testCaseParser.searchCaseId(testData.getTitle());

            foundCaseIDs.forEach((caseId) => {
                let status = this.statusPassed;

                if (testData.getState() !== 'passed') {
                    status = this.statusFailed;
                }

                let comment = 'Tested by Cypress';

                // this is already part of the run description
                // if it was created dynamically.
                // otherwise add it to the result
                if (!this.modeCreateRun) {
                    comment += '\nCypress: ' + this.cypressVersion;
                    comment += '\nBrowser: ' + this.browser;
                    comment += '\nBase URL: ' + this.baseURL;
                    comment += '\nSystem: ' + this.system;
                    comment += '\nSpec: ' + spec.name;

                    if (this.customComment !== '') {
                        comment += '\n' + this.customComment;
                    }
                }

                if (testData.getError() !== '') {
                    comment += '\nError: ' + testData.getError();
                }

                const result = new Result(caseId, status, comment, testData.getDurationMS());
                const request = this.testRailApi.sendResult(this.runId, result);
                allRequests.push(request);
            });
        });

        await Promise.all(allRequests);
    }
}

module.exports = Reporter;

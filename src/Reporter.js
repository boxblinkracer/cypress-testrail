const TestRail = require('./components/TestRail/TestRail');
const TestCaseParser = require('./services/TestCaseParser');
const Result = require('./components/TestRail/Result');
const ConfigService = require('./services/Config/ConfigService');
const TestData = require('./components/Cypress/TestData');
const ColorConsole = require('./services/ColorConsole');
const CypressStatusConverter = require('./services/CypressStatusConverter');

const packageData = require('../package.json');
const FileWriter = require('./services/FileWriter');

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
        this.fileWriter = new FileWriter();

        /* eslint-disable no-undef */
        const configService = new ConfigService(config.env);

        this.enabled = configService.isApiValid();

        this.domain = configService.getDomain();
        this.projectId = configService.getProjectId();
        this.milestoneId = configService.getMilestoneId();
        this.suiteId = configService.getSuiteId();

        const singleRunId = configService.getRunId();
        if (singleRunId !== '') {
            this.runIds = [configService.getRunId()];
        } else {
            this.runIds = configService.getRunIds();
        }

        this.runName = configService.getRunName();
        this.screenshotsEnabled = configService.isScreenshotsEnabled();
        this.includeAllCasesDuringCreation = configService.includeAllCasesDuringCreation();
        this.includeAllFailedScreenshots = configService.includeAllFailedScreenshots();
        this.ignorePendingTests = configService.ignorePendingCypressTests();

        this.modeCreateRun = !configService.hasRunID();
        this.closeRun = configService.shouldCloseRun();
        this.foundCaseIds = [];

        this.statusConverter = new CypressStatusConverter(configService.getTestRailStatusPassed(), configService.getTestRailStatusFailed(), configService.getTestRailStatusSkipped());

        this.customComment = customComment !== undefined && customComment !== null ? customComment : '';

        this.testrail = new TestRail(configService.getDomain(), configService.getUsername(), configService.getPassword(), configService.isScreenshotsEnabled());
    }

    /**
     *
     */
    register() {
        // if our config is not valid
        // then do not even register anything
        if (!this.enabled) {
            ColorConsole.info('');
            ColorConsole.info('');
            ColorConsole.warn('TestRail Integration v' + packageData.version);
            ColorConsole.warn('....................................................');
            ColorConsole.warn('Integration is not correctly configured.');
            ColorConsole.warn('If you expect this to work, please check your configuration.');
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
        this.browser = details.browser !== undefined ? details.browser.displayName + ' (' + details.browser.version + ')' : 'unknown';
        this.system = details.system.osName + ' (' + details.system.osVersion + ')';
        this.baseURL = details.config.baseUrl;

        ColorConsole.success('Starting TestRail Integration v' + packageData.version);
        ColorConsole.info('....................................................');
        ColorConsole.info('Cypress: ' + this.cypressVersion);
        ColorConsole.info('Browser: ' + this.browser);
        ColorConsole.info('System: ' + this.system);
        ColorConsole.info('Base URL: ' + this.baseURL);
        ColorConsole.info('TestRail Domain: ' + this.domain);

        if (this.modeCreateRun) {
            ColorConsole.info('TestRail Mode: Create Run');
            ColorConsole.info('TestRail Project ID: ' + this.projectId);
            ColorConsole.info('TestRail Milestone ID: ' + this.milestoneId);
            ColorConsole.info('TestRail Suite ID: ' + this.suiteId);
            ColorConsole.info('TestRail Run Name: ' + this.runName);
            ColorConsole.info('TestRail Include All Cases: ' + this.includeAllCasesDuringCreation);
        } else {
            ColorConsole.info('TestRail Mode: Use existing Run(s)');
            ColorConsole.info('TestRail Run ID(s): ' + this.runIds.map((id) => 'R' + id));
        }

        ColorConsole.info('Ignore pending tests: ' + this.ignorePendingTests);
        ColorConsole.info('Screenshots: ' + this.screenshotsEnabled);
        ColorConsole.info('Include All Failed Screenshots: ' + this.includeAllFailedScreenshots);

        // if we don't have a runID, then we need to create one
        if (this.modeCreateRun) {
            await this._createTestRailRun();
        }
    }

    /**
     *
     * @param spec
     * @param results
     * @private
     */
    async _afterSpec(spec, results) {
        // usually all test cases are assigned to runs that are created,
        // but it's possible to turn off this feature, and only add
        // test cases that have actually been executed by Cypress.
        if (this.modeCreateRun && !this.includeAllCasesDuringCreation) {
            for (let i = 0; i < results.tests.length; i++) {
                const test = results.tests[i];

                // extract our custom test data from the Cypress test object
                const testData = new TestData(test);

                // search the case ids from the title of the Cypress test
                const foundCaseIDs = this.testCaseParser.searchCaseId(testData.getTitle());

                // add all found case ids to our list
                for (let i = 0; i < foundCaseIDs.length; i++) {
                    this.foundCaseIds.push(foundCaseIDs[i]);
                }
            }

            for (let i = 0; i < this.runIds.length; i++) {
                await this.testrail.updateRun(this.runIds[i], this.foundCaseIds);
            }
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
                for (let i = 0; i < this.runIds.length; i++) {
                    await this.testrail.closeRun(this.runIds[i], () => {
                        /* eslint-disable no-console */
                        console.log('  TestRail Run: R' + this.runIds[i] + ' is now closed');
                    });
                }
            } else {
                /* eslint-disable no-console */
                console.log('  Skipping closing of Test Run');
            }
        }
    }

    /**
     * This function is being triggered after each spec file.
     * It's the main entrypoint to send all test results of that file to TestRail.
     *
     * @param spec
     * @param results
     * @returns {Promise<void>}
     * @private
     */
    async _sendSpecResults(spec, results) {
        // if we don't have anything, just return
        if (!results.tests || results.tests.length === 0) {
            return;
        }

        const allRequests = [];
        const allResults = [];

        for (let i = 0; i < results.tests.length; i++) {
            const cyTest = new TestData(results.tests[i]);

            if (cyTest.isPending() && this.ignorePendingTests) {
                ColorConsole.debug('Ignoring pending test: ' + cyTest.getTitle());
                continue;
            }

            const testRailStatusID = this.statusConverter.convertToTestRail(cyTest.getState());

            let screenshotPaths = [];

            // if we have a failed test, then extract the screenshot
            if (cyTest.isFailed()) {
                screenshotPaths = this._getScreenshotByTestId(cyTest.getId(), cyTest.getTitle(), results.screenshots);

                if (screenshotPaths === null) {
                    screenshotPaths = [];
                }
            }

            let comment = cyTest.getTitle() ? cyTest.getTitle() : 'Tested by Cypress';

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

            if (cyTest.getError() !== '') {
                comment += '\nError: ' + cyTest.getError();
            }

            const foundCaseIDs = this.testCaseParser.searchCaseId(cyTest.getTitle());

            // now build a separate result entry
            // for each found case id for TestRail later on
            for (let i = 0; i < foundCaseIDs.length; i++) {
                const caseId = foundCaseIDs[i];

                const result = new Result(caseId, testRailStatusID, comment, cyTest.getDurationMS(), screenshotPaths);

                allResults.push(result);
            }
        }

        if (allResults.length > 0) {
            for (let i = 0; i < this.runIds.length; i += 1) {
                const request = this.testrail.sendBatchResults(this.runIds[i], allResults);
                allRequests.push(request);
            }

            await Promise.all(allRequests);
        }
    }

    /**
     *
     * @returns {Promise<void>}
     * @private
     */
    async _createTestRailRun() {
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

        const me = this;

        await this.testrail.createRun(this.projectId, this.milestoneId, this.suiteId, runName, description, this.includeAllCasesDuringCreation, (runId) => {
            // run created
            this.runIds = [runId];
            /* eslint-disable no-console */
            ColorConsole.debug('New TestRail Run: R' + runId);

            // we need to write the runId to a file
            // this allows developers to immediately fetch the new runID and
            // use it for their own purposes
            const data = {
                id: runId,
                name: runName,
                description: description,
                projectId: me.projectId,
                milestoneId: me.milestoneId,
                suiteId: me.suiteId,
            };

            me.fileWriter.write('created_run.json', JSON.stringify(data, null, 2));
        });
    }

    /**
     * {
     *   screenshotId: 'snzdd',
     *   name: null,
     *   testId: 'r4',
     *   testAttemptIndex: 3,
     *   takenAt: '2022-12-23T08:03:08.888Z',
     *   path: '/.../Test-Case ABC (failed) (attempt 4).png',
     *   height: 720,
     *   width: 1280
     * }
     * @param testId
     * @param testTitle
     * @param screenshots
     * @returns {null}
     * @private
     */
    _getScreenshotByTestId(testId, testTitle, screenshots) {
        var highestFoundAttemptId = -1;
        var foundScreenshots = [];
        var highestFoundScreenshot = [];

        screenshots.forEach((screenshot) => {
            var found = false;

            if (screenshot.testId === testId) {
                // only use images of our current test.
                // screenshots would include all test images
                found = true;
            } else if (screenshot.path.includes(testTitle)) {
                // Cypress 13 does not have a testId anymore?!
                // let's try to find our test title, a bit risky but should work in most cases
                found = true;
            }

            if (found) {
                // only use images with '(failed)' in it.
                // Other images might be custom  images taken by the developer
                if (screenshot.path.includes('(failed')) {
                    foundScreenshots.push(screenshot);
                    // only use the image of the latest test-attempt for now.
                    // testAttemptIndex doesn't always exist
                    const currentAttempt = screenshot.testAttemptIndex ? screenshot.testAttemptIndex : 0;

                    if (currentAttempt > highestFoundAttemptId) {
                        highestFoundScreenshot = [];
                        highestFoundScreenshot.push(screenshot);
                        highestFoundAttemptId = currentAttempt;
                    }
                }
            }
        });

        return this.includeAllFailedScreenshots ? foundScreenshots : highestFoundScreenshot;
    }
}

module.exports = Reporter;

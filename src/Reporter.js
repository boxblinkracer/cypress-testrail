const TestRail = require('./components/TestRail/TestRail');
const TestCaseParser = require('./services/TestCaseParser');
const Result = require('./components/TestRail/Result');
const ConfigService = require('./services/ConfigService');
const TestData = require('./components/Cypress/TestData');
const ColorConsole = require('./services/ColorConsole');

const packageData = require('../package.json');

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
        this.suiteId = configService.getSuiteId();
        this.runId = configService.getRunId();
        this.runName = configService.getRunName();
        this.screenshotsEnabled = configService.isScreenshotsEnabled();
        this.includeAllCasesDuringCreation = configService.includeAllCasesDuringCreation();
        this.includeAllFailedScreenshots = configService.includeAllFailedScreenshots();

        this.modeCreateRun = !configService.hasRunID();
        this.closeRun = configService.shouldCloseRun();
        this.foundCaseIds = [];

        this.statusPassed = configService.getStatusPassed();
        this.statusFailed = configService.getStatusFailed();

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

        ColorConsole.success('  Starting TestRail Integration v' + packageData.version);
        ColorConsole.info('  ....................................................');
        ColorConsole.info('  Cypress: ' + this.cypressVersion);
        ColorConsole.info('  Browser: ' + this.browser);
        ColorConsole.info('  System: ' + this.system);
        ColorConsole.info('  Base URL: ' + this.baseURL);
        ColorConsole.info('  TestRail Domain: ' + this.domain);

        if (this.modeCreateRun) {
            ColorConsole.info('  TestRail Mode: Create Run');
            ColorConsole.info('  TestRail Project ID: ' + this.projectId);
            ColorConsole.info('  TestRail Milestone ID: ' + this.milestoneId);
            ColorConsole.info('  TestRail Suite ID: ' + this.suiteId);
            ColorConsole.info('  TestRail Run Name: ' + this.runName);
            ColorConsole.info('  TestRail Include All Cases: ' + this.includeAllCasesDuringCreation);
        } else {
            ColorConsole.info('  TestRail Mode: Use existing Run');
            ColorConsole.info('  TestRail Run ID: ' + this.runId);
        }

        ColorConsole.info('  Screenshots: ' + this.screenshotsEnabled);
        ColorConsole.info('  Include All Failed Screenshots: ' + this.includeAllFailedScreenshots);

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

            await this.testrail.createRun(this.projectId, this.milestoneId, this.suiteId, runName, description, this.includeAllCasesDuringCreation, (runId) => {
                // run created
                this.runId = runId;
                /* eslint-disable no-console */
                ColorConsole.debug('  New TestRail Run: R' + this.runId);
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
        if (this.modeCreateRun && !this.includeAllCasesDuringCreation) {
            // if we are in the mode to dynamically create runs
            // then we also need to add the newly found runs to our created test run
            // but only if we don't want to associate all cases during creation
            await results.tests.forEach((test) => {
                const testData = new TestData(test);

                const foundCaseIDs = this.testCaseParser.searchCaseId(testData.getTitle());

                foundCaseIDs.forEach((singleCase) => {
                    this.foundCaseIds.push(singleCase);
                });
            });

            await this.testrail.updateRun(this.runId, this.foundCaseIds);
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
                await this.testrail.closeRun(this.runId, () => {
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
        const allResults = [];

        // iterate through all our test results
        // and send the data to TestRail
        await results.tests.forEach(async (test) => {
            const testData = new TestData(test);

            const foundCaseIDs = this.testCaseParser.searchCaseId(testData.getTitle());

            foundCaseIDs.forEach((caseId) => {
                let status = this.statusPassed;

                // if we have a pending status, then do not
                // send data to testrail
                if (testData.getState() === 'pending') {
                    return;
                }

                let screenshotPaths = [];

                if (testData.getState() !== 'passed') {
                    status = this.statusFailed;

                    screenshotPaths = this._getScreenshotByTestId(test.testId, results.screenshots);
                    if (screenshotPaths === null) {
                        screenshotPaths = [];
                    }
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

                const result = new Result(caseId, status, comment, testData.getDurationMS(), screenshotPaths);
                allResults.push(result);
            });
        });

        // now send all results in a single request
        const request = this.testrail.sendBatchResults(this.runId, allResults);
        allRequests.push(request);

        await Promise.all(allRequests);
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
     * @param screenshots
     * @returns {null}
     * @private
     */
    _getScreenshotByTestId(testId, screenshots) {
        var highestFoundAttemptId = -1;
        var foundScreenshots = [];
        var highestFoundScreenshot = [];
        screenshots.forEach((screenshot) => {
            // only use images of our current test.
            // screenshots would include all test images
            if (screenshot.testId === testId) {
                // only use images with '(failed)' in it. Other images might be custom
                // images taken by the developer
                if (screenshot.path.includes('(failed')) {
                    foundScreenshots.push(screenshot);
                    // only use the image of the latest test-attempt for now
                    const currentAttempt = screenshot.testAttemptIndex;

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

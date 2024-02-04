const ColorConsole = require('../../services/ColorConsole');
const ApiClient = require('./ApiClient');

class TestRail {
    /**
     *
     * @param domain
     * @param username
     * @param password
     * @param isScreenshotsEnabled
     */
    constructor(domain, username, password, isScreenshotsEnabled) {
        this.client = new ApiClient(domain, username, password);
        this.isScreenshotsEnabled = isScreenshotsEnabled;
    }

    /**
     *
     * @param projectId
     * @param milestoneId
     * @param suiteId
     * @param name
     * @param description
     * @param includeAllCasesDuringCreation
     * @param callback
     * @returns {Promise<AxiosResponse<*>>}
     */
    createRun(projectId, milestoneId, suiteId, name, description, includeAllCasesDuringCreation, callback) {
        if (typeof includeAllCasesDuringCreation !== 'boolean') {
            includeAllCasesDuringCreation = false; //preserving existing functionality
        }
        const postData = {
            name: name,
            description: description,
            include_all: includeAllCasesDuringCreation,
            case_ids: [],
        };

        if (milestoneId !== '') {
            postData['milestone_id'] = milestoneId;
        }

        if (suiteId !== '') {
            postData['suite_id'] = suiteId;
        }

        return this.client.sendData(
            '/add_run/' + projectId,
            postData,
            (response) => {
                ColorConsole.success('TestRun created in TestRail: ' + name);
                // notify our callback
                return callback(response.data.id);
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('Could not create TestRail run for project P' + projectId + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }

    /**
     *
     * @param runId
     * @param caseIds
     * @returns {Promise<AxiosResponse<any>>}
     */
    updateRun(runId, caseIds) {
        const postData = {
            include_all: false,
            case_ids: caseIds,
        };

        ColorConsole.debug('Updating TestRail run R' + runId + '. Adding test cases: ' + caseIds.join(', '));

        return this.client.sendData(
            '/update_run/' + runId,
            postData,
            () => {
                ColorConsole.success('TestRun updated in TestRail: ' + runId);
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('Could not add TestRail test cases to run R' + runId + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }

    /**
     *
     * @param runId
     * @param onSuccess
     */
    closeRun(runId, onSuccess) {
        return this.client.sendData(
            '/close_run/' + runId,
            {},
            () => {
                return onSuccess();
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('Could not close TestRail run R' + runId + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }

    /**
     *
     * @param runID
     * @param result
     */
    sendResult(runID, result) {
        const postData = {
            results: [
                {
                    case_id: result.getCaseId(),
                    status_id: result.getStatusId(),
                    comment: result.getComment().trim(),
                },
            ],
        };

        if (result.hasElapsedTime()) {
            postData.results[0].elapsed = result.getElapsed();
        }

        return this.client.sendData(
            '/add_results_for_cases/' + runID,
            postData,
            (response) => {
                const resultId = response.data[0].id;

                ColorConsole.success('TestRail result ' + resultId + ' sent for TestCase C' + result.getCaseId());

                const screenshotPaths = result.getScreenshotPaths();

                if (this.isScreenshotsEnabled && screenshotPaths.length) {
                    ColorConsole.debug('sending screenshots to TestRail for TestCase C' + result.getCaseId());

                    const allRequests = [];

                    screenshotPaths.forEach((screenshot) => {
                        const request = this.client.sendScreenshot(
                            resultId,
                            screenshot.path,
                            () => {
                                ColorConsole.success('created screenshot');
                            },
                            (error) => {
                                ColorConsole.error(`could not create screenshot: ${error}`);
                                ColorConsole.debug('');
                            }
                        );

                        allRequests.push(request);
                    });

                    return Promise.all(allRequests);
                }
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('Could not send TestRail result for case C' + result.getCaseId() + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }

    /**
     *
     * @param {string} runID
     * @param {Result[]} testResults
     * @returns {Promise<AxiosResponse<*>>}
     */
    sendBatchResults(runID, testResults) {
        const url = '/add_results_for_cases/' + runID;

        const postData = {
            results: [],
        };

        ColorConsole.debug('TestRail >> Sending case results to run R' + runID + ': ' + testResults.map((r) => 'C' + r.getCaseId()));

        testResults.forEach((result) => {
            var resultEntry = {
                case_id: result.getCaseId(),
                status_id: result.getStatusId(),
                comment: result.getComment().trim(),
            };

            // only add an elapsed time, if a valid value exists
            // otherwise TestRail will throw an error
            if (result.hasElapsedTime()) {
                resultEntry.elapsed = result.getElapsed();
            }

            postData.results.push(resultEntry);
        });

        return this.client.sendData(
            url,
            postData,
            (response) => {
                ColorConsole.success('Results sent to TestRail R' + runID + ' for: ' + testResults.map((r) => 'C' + r.getCaseId()));

                if (this.isScreenshotsEnabled) {
                    const allRequests = [];

                    testResults.forEach((result, i) => {
                        const screenshotPaths = result.getScreenshotPaths();

                        if (screenshotPaths.length) {
                            // there is no identifier, to match both, but
                            // we usually get the same order back as we sent it to TestRail
                            const matchingResultId = response.data[i].id;

                            screenshotPaths.forEach((screenshot) => {
                                ColorConsole.debug('sending screenshot to TestRail for TestCase C' + result.getCaseId());

                                const addScreenShotRequest = this.client.sendScreenshot(
                                    matchingResultId,
                                    screenshot.path,
                                    () => {
                                        ColorConsole.success('created screenshot');
                                    },
                                    (error) => {
                                        ColorConsole.error(`could not create screenshot: ${error}`);
                                        ColorConsole.debug('');
                                    }
                                );

                                allRequests.push(addScreenShotRequest);
                            });
                        }
                    });

                    return Promise.all(allRequests);
                }
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('Could not send list of TestRail results: ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }
}

module.exports = TestRail;

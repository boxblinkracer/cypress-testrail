const axios = require('axios');
const ColorConsole = require('../../services/ColorConsole');

class ApiClient {
    /**
     * @param domain
     * @param username
     * @param password
     */
    constructor(domain, username, password) {
        this.username = username;
        this.password = password;
        this.baseUrl = `https://${domain}/index.php?/api/v2`;
    }

    /**
     *
     * @param projectId
     * @param milestoneId
     * @param name
     * @param description
     * @param callback
     */
    createRun(projectId, milestoneId, name, description, callback) {
        const postData = {
            name: name,
            description: description,
            include_all: false,
            case_ids: [],
        };

        if (milestoneId !== '') {
            postData['milestone_id'] = milestoneId;
        }

        return this._post(
            '/add_run/' + projectId,
            postData,
            (response) => {
                ColorConsole.success('  TestRun created in TestRail: ' + name);
                // notify our callback
                callback(response.data.id);
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('  Could not create TestRail run for project P' + projectId + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
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

        return this._post(
            '/update_run/' + runId,
            postData,
            () => {
                ColorConsole.success('  TestRun updated in TestRail: ' + runId);
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('  Could not add TestRail test cases to run R' + runId + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
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
        return this._post(
            '/close_run/' + runId,
            {},
            () => {
                onSuccess();
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('  Could not close TestRail run R' + runId + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
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

        // 0s is not valid
        if (result.getElapsed() !== '0s') {
            postData.results[0].elapsed = result.getElapsed();
        }

        return this._post(
            '/add_results_for_cases/' + runID,
            postData,
            () => {
                ColorConsole.success('  TestRail result sent for TestCase C' + result.getCaseId());
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('  Could not send TestRail result for case C' + result.getCaseId() + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }

    /**
     *
     * @param slug
     * @param postData
     * @param onSuccess
     * @param onError
     * @returns {Promise<AxiosResponse<any>>}
     * @private
     */
    _post(slug, postData, onSuccess, onError) {
        return axios({
            method: 'post',
            url: this.baseUrl + slug,
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username: this.username,
                password: this.password,
            },
            data: JSON.stringify(postData),
        })
            .then((response) => {
                onSuccess(response);
            })
            .catch((error) => {
                const statusCode = error.response.status;
                const statusText = error.response.statusText;
                const errorText = error.response.data.error;

                onError(statusCode, statusText, errorText);
            });
    }
}

module.exports = ApiClient;

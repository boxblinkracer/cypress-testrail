const ConfigValueExtractor = require('./ConfigValueExtractor');

class ConfigService {
    /**
     *
     */
    constructor(configArray) {
        this._config = configArray;

        if (this._config === undefined) {
            this._config = null;
        }

        this._valueLoader = new ConfigValueExtractor(this._config);
    }

    /**
     *
     * @returns {*|string|string|string}
     */
    getDomain() {
        let domain = this._valueLoader.getStringValue('TESTRAIL_DOMAIN', 'domain');

        domain = String(domain);
        domain = domain.replace('http://', '');
        domain = domain.replace('https://', '');
        domain = domain.trim();

        return domain;
    }

    /**
     *
     * @returns {*|string|string|string}
     */
    getUsername() {
        return this._valueLoader.getStringValue('TESTRAIL_USERNAME', 'username');
    }

    /**
     *
     * @returns {*|string|string|string}
     */
    getPassword() {
        return this._valueLoader.getStringValue('TESTRAIL_PASSWORD', 'password');
    }

    /**
     *
     * @returns {boolean}
     */
    isApiValid() {
        if (this.getDomain() === '') {
            return false;
        }

        if (this.getUsername() === '') {
            return false;
        }

        if (this.getPassword() === '') {
            return false;
        }

        return true;
    }

    /**
     *
     * @returns {string}
     */
    getProjectId() {
        let projectId = this._valueLoader.getStringValue('TESTRAIL_PROJECT_ID', 'projectId');

        projectId = String(projectId);
        projectId = projectId.replace('P', '');
        projectId = projectId.trim();

        return projectId;
    }

    /**
     *
     * @returns {string}
     */
    getMilestoneId() {
        let milestoneId = this._valueLoader.getStringValue('TESTRAIL_MILESTONE_ID', 'milestoneId');

        milestoneId = String(milestoneId);
        milestoneId = milestoneId.replace('M', '');
        milestoneId = milestoneId.trim();

        return milestoneId;
    }

    /**
     *
     * @returns {string}
     */
    getSuiteId() {
        let suiteId = this._valueLoader.getStringValue('TESTRAIL_SUITE_ID', 'suiteId');

        suiteId = String(suiteId);
        suiteId = suiteId.replace('S', '');
        suiteId = suiteId.trim();

        return suiteId;
    }

    /**
     *
     * @returns {string}
     */
    getRunId() {
        let runId = this._valueLoader.getStringValue('TESTRAIL_RUN_ID', 'runId');

        runId = String(runId);
        runId = runId.replace('R', '');
        runId = runId.trim();

        return runId;
    }

    /**
     *
     * @returns {array}
     */
    getRunIds() {
        const runIds = this._valueLoader.getArrayValue('TESTRAIL_RUN_IDS', 'runIds');

        for (let i = 0; i < runIds.length; i++) {
            runIds[i] = String(runIds[i]);
            runIds[i] = runIds[i].replace('R', '');
            runIds[i] = runIds[i].trim();
        }

        return runIds;
    }

    /**
     *
     * @returns {boolean}
     */
    hasRunID() {
        return this.getRunId() !== '' || this.getRunIds().length > 0;
    }

    /**
     *
     * @returns {string}
     */
    getRunName() {
        return this._valueLoader.getStringValue('TESTRAIL_RUN_NAME', 'runName');
    }

    /**
     *
     * @returns {boolean}
     */
    shouldCloseRun() {
        return this._valueLoader.getBooleanValue('TESTRAIL_RUN_CLOSE', 'closeRun', false);
    }

    /**
     *
     * @returns {boolean}
     */
    isScreenshotsEnabled() {
        return this._valueLoader.getBooleanValue('TESTRAIL_SCREENSHOTS', 'screenshots', false);
    }

    /**
     *
     * @returns {boolean}
     */
    includeAllCasesDuringCreation() {
        return this._valueLoader.getBooleanValue('TESTRAIL_RUN_INCLUDE_ALL', 'runIncludeAll', false);
    }

    /**
     *
     * @returns {boolean}
     */
    includeAllFailedScreenshots() {
        return this._valueLoader.getBooleanValue('TESTRAIL_SCREENSHOTS_ALL', 'screenshotsAll', false);
    }

    /**
     * If enabled, all pending tests are skipped and not sent to TestRail
     * @returns {boolean}
     */
    ignorePendingCypressTests() {
        return this._valueLoader.getBooleanValue('TESTRAIL_IGNORE_PENDING', 'ignorePending', true);
    }

    /**
     * Gets the matching statusID for passed inside TestRail
     * TODO, make sure to allow a custom configuration.
     *
     * @returns {number}
     */
    getTestRailStatusPassed() {
        return 1;
    }

    /**
     * Gets the matching statusID for failed inside TestRail
     * TODO, make sure to allow a custom configuration.
     *
     * @returns {number}
     */
    getTestRailStatusFailed() {
        return 5;
    }

    /**
     * Gets the matching statusID for skipped inside TestRail
     * TODO, make sure to allow a custom configuration.
     *
     * @returns {number}
     */
    getTestRailStatusSkipped() {
        return 2;
    }
}

module.exports = ConfigService;

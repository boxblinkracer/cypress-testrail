const ObjectCompare = require('./ObjectCompare');

class ConfigService {
    /**
     *
     */
    constructor(configArray) {
        this.config = configArray;

        if (this.config === undefined) {
            this.config = null;
        }

        this._comparer = new ObjectCompare();
    }

    /**
     *
     * @returns {*|string|string|string}
     */
    getDomain() {
        let domain = this._getStringValue('TESTRAIL_DOMAIN', 'domain');

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
        return this._getStringValue('TESTRAIL_USERNAME', 'username');
    }

    /**
     *
     * @returns {*|string|string|string}
     */
    getPassword() {
        return this._getStringValue('TESTRAIL_PASSWORD', 'password');
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
        let projectId = this._getStringValue('TESTRAIL_PROJECT_ID', 'projectId');

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
        let milestoneId = this._getStringValue('TESTRAIL_MILESTONE_ID', 'milestoneId');

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
        let suiteId = this._getStringValue('TESTRAIL_SUITE_ID', 'suiteId');

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
        let runId = this._getStringValue('TESTRAIL_RUN_ID', 'runId');

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
        const runIds = this._getArrayValue('TESTRAIL_RUN_IDS', 'runIds');

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
        return this._getStringValue('TESTRAIL_RUN_NAME', 'runName');
    }

    /**
     *
     * @returns {boolean}
     */
    shouldCloseRun() {
        return this._getBooleanValue('TESTRAIL_RUN_CLOSE', 'closeRun');
    }

    /**
     *
     * @returns {boolean}
     */
    isScreenshotsEnabled() {
        return this._getBooleanValue('TESTRAIL_SCREENSHOTS', 'screenshots');
    }

    /**
     *
     * @returns {boolean}
     */
    includeAllCasesDuringCreation() {
        return this._getBooleanValue('TESTRAIL_RUN_INCLUDE_ALL', 'runIncludeAll');
    }

    /**
     *
     * @returns {boolean}
     */
    includeAllFailedScreenshots() {
        return this._getBooleanValue('TESTRAIL_SCREENSHOTS_ALL', 'screenshotsAll');
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

    /**
     *
     * @param {string} keyCLI
     * @param {string} keyJSON
     * @returns {string}
     * @private
     */
    _getStringValue(keyCLI, keyJSON) {
        const value = this._getValue(keyCLI, keyJSON);

        if (value === null) {
            return '';
        }

        return value.toString();
    }

    /**
     *
     * @param {string} keyCLI
     * @param {string} keyJSON
     * @returns {*[]}
     * @private
     */
    _getArrayValue(keyCLI, keyJSON) {
        const value = this._getValue(keyCLI, keyJSON);

        if (value === null) {
            return [];
        }

        if (Array.isArray(value)) {
            return value;
        }

        if (value.toString().indexOf(',') !== -1) {
            return value.split(',');
        }

        return [value];
    }

    /**
     *
     * @param {string} keyCLI
     * @param {string} keyJSON
     * @returns {boolean}
     * @private
     */
    _getBooleanValue(keyCLI, keyJSON) {
        const value = this._getValue(keyCLI, keyJSON);

        if (value === null) {
            return false;
        }

        return Boolean(value);
    }

    /**
     * Gets either a mixed value or NULL.
     *
     * @param keyCLI
     * @param keyJSON
     * @returns {*|null|string}
     * @private
     */
    _getValue(keyCLI, keyJSON) {
        let value = null;

        // ------------------------------------------------------------------------------------------------------------------------
        // search in ENV variables

        if (!this._comparer.isUndefinedOrNull(this.config)) {
            value = this.config[keyCLI];
        }

        if (!this._comparer.isEmpty(value)) {
            return value;
        }

        // ------------------------------------------------------------------------------------------------------------------------
        // search in process.env variables

        if (!this._comparer.isUndefinedOrNull(process.env)) {
            value = process.env[keyCLI];
        }

        if (!this._comparer.isEmpty(value)) {
            return value;
        }

        // ------------------------------------------------------------------------------------------------------------------------
        // search in config JSON

        if (!this._comparer.isUndefinedOrNull(this.config) && !this._comparer.isUndefinedOrNull(this.config.testrail)) {
            value = this.config.testrail[keyJSON];
        }

        if (!this._comparer.isEmpty(value)) {
            return value;
        }

        return null;
    }
}

module.exports = ConfigService;

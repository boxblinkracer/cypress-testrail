class ConfigService {
    /**
     *
     */
    constructor(configArray) {
        this.config = configArray;

        if (this.config === undefined) {
            this.config = null;
        }
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
        if (this.config === null) {
            return '';
        }

        var value = '';

        if (this.config[keyCLI] !== undefined) {
            value = this.config[keyCLI];
        } else if (this.config.testrail !== undefined && this.config.testrail !== null) {
            value = this.config.testrail[keyJSON];
        } else if (process.env !== undefined && process.env !== null) {
            value = process.env[keyCLI];
        }

        if (value === undefined || value === null || value === '') {
            return '';
        }

        return value;
    }

    /**
     *
     * @param {string} keyCLI
     * @param {string} keyJSON
     * @returns {*[]}
     * @private
     */
    _getArrayValue(keyCLI, keyJSON) {
        if (this.config === null) {
            return [];
        }

        var value = [];

        if (this.config[keyCLI] !== undefined) {
            const tmpString = this.config[keyCLI];

            // if we have a value, then try to split it
            if (tmpString !== undefined && tmpString !== null && tmpString !== '') {
                if (tmpString.toString().indexOf(',') !== -1) {
                    value = tmpString.split(',');
                } else {
                    value = [tmpString];
                }
            }
        } else if (this.config.testrail !== undefined && this.config.testrail !== null) {
            value = this.config.testrail[keyJSON];
        } else if (process.env !== undefined && process.env !== null) {
            const tmpString = process.env[keyCLI];

            // if we have a value, then try to split it
            if (tmpString !== undefined && tmpString !== null && tmpString !== '') {
                if (tmpString.toString().indexOf(',') !== -1) {
                    value = tmpString.split(',');
                } else {
                    value = [tmpString];
                }
            }
        }

        if (value === undefined || value === null || value === '') {
            return [];
        }

        return value;
    }

    /**
     *
     * @param {string} keyCLI
     * @param {string} keyJSON
     * @returns {boolean}
     * @private
     */
    _getBooleanValue(keyCLI, keyJSON) {
        if (this.config === null) {
            return false;
        }

        var value = false;

        if (this.config[keyCLI] !== undefined) {
            value = this.config[keyCLI];
        } else if (this.config.testrail !== undefined && this.config.testrail !== null) {
            value = this.config.testrail[keyJSON];
        } else if (process.env !== undefined && process.env !== null) {
            value = process.env[keyCLI];
        }

        if (value === undefined || value === null || value === '') {
            return false;
        }

        return Boolean(value);
    }
}

module.exports = ConfigService;

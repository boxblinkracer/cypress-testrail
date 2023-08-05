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
        if (this.config === null) {
            return '';
        }

        var domain = '';

        if (this.config.TESTRAIL_DOMAIN !== undefined) {
            domain = this.config.TESTRAIL_DOMAIN;
        } else if (this.config.testrail !== undefined && this.config.testrail !== null) {
            domain = this.config.testrail.domain;
        }

        if (domain === undefined || domain === null || domain === '') {
            return '';
        }

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
        if (this.config === null) {
            return '';
        }

        if (this.config.TESTRAIL_USERNAME !== undefined && this.config.TESTRAIL_USERNAME !== '') {
            return this.config.TESTRAIL_USERNAME;
        }

        if (this.config.testrail === undefined || this.config.testrail === null) {
            return '';
        }

        const value = this.config.testrail.username;

        if (value === undefined || value === null) {
            return '';
        }

        return value;
    }

    /**
     *
     * @returns {*|string|string|string}
     */
    getPassword() {
        if (this.config === null) {
            return '';
        }

        if (this.config.TESTRAIL_PASSWORD !== undefined && this.config.TESTRAIL_PASSWORD !== '') {
            return this.config.TESTRAIL_PASSWORD;
        }

        if (this.config.testrail === undefined || this.config.testrail === null) {
            return '';
        }

        const value = this.config.testrail.password;

        if (value === undefined || value === null) {
            return '';
        }

        return value;
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
        if (this.config === null) {
            return '';
        }

        let projectId = '';

        // CYPRESS_TESTRAIL_PROJECT_ID
        if (this.config.TESTRAIL_PROJECT_ID !== undefined && this.config.TESTRAIL_PROJECT_ID !== '') {
            projectId = this.config.TESTRAIL_PROJECT_ID;
        } else {
            if (this.config.testrail === undefined || this.config.testrail === null) {
                return '';
            }

            projectId = this.config.testrail.projectId;

            if (projectId === undefined || projectId === null) {
                return '';
            }
        }

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
        if (this.config === null) {
            return '';
        }

        let milestoneId = '';

        // CYPRESS_TESTRAIL_MILESTONE_ID
        if (this.config.TESTRAIL_MILESTONE_ID !== undefined && this.config.TESTRAIL_MILESTONE_ID !== '') {
            milestoneId = this.config.TESTRAIL_MILESTONE_ID;
        } else {
            if (this.config.testrail === undefined || this.config.testrail === null) {
                return '';
            }

            milestoneId = this.config.testrail.milestoneId;

            if (milestoneId === undefined || milestoneId === null) {
                return '';
            }
        }

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
        if (this.config === null) {
            return '';
        }

        let suiteId = '';

        // CYPRESS_TESTRAIL_SUITE_ID
        if (this.config.TESTRAIL_SUITE_ID !== undefined && this.config.TESTRAIL_SUITE_ID !== '') {
            suiteId = this.config.TESTRAIL_SUITE_ID;
        } else {
            if (this.config.testrail === undefined || this.config.testrail === null) {
                return '';
            }

            suiteId = this.config.testrail.suiteId;

            if (suiteId === undefined || suiteId === null) {
                return '';
            }
        }

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
        if (this.config === null) {
            return '';
        }

        let runId = '';

        // CYPRESS_TESTRAIL_RUN_ID
        if (this.config.TESTRAIL_RUN_ID !== undefined && this.config.TESTRAIL_RUN_ID !== '') {
            runId = this.config.TESTRAIL_RUN_ID;
        } else {
            if (this.config.testrail === undefined || this.config.testrail === null) {
                return '';
            }
            runId = this.config.testrail.runId;

            if (runId === undefined || runId === null) {
                return '';
            }
        }

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
        if (this.config === null) {
            return [];
        }

        let runIds = [];

        // CYPRESS_TESTRAIL_RUN_IDS
        if (this.config.TESTRAIL_RUN_IDS !== undefined && this.config.TESTRAIL_RUN_IDS !== null && this.config.TESTRAIL_RUN_IDS !== '') {
            const tmpString = this.config.TESTRAIL_RUN_IDS;
            if (tmpString.toString().indexOf(',') !== -1) {
                runIds = tmpString.split(',');
            } else {
                runIds = [tmpString];
            }
        } else {
            if (this.config.testrail === undefined || this.config.testrail === null) {
                return [];
            }
            runIds = this.config.testrail.runIds;

            if (runIds === undefined || runIds === null) {
                return [];
            }
        }

        if (runIds === undefined || runIds === null) {
            return [];
        }

        for (let i = 0; i < runIds.length; i++) {
            runIds[i] = String(runIds[i]);
            runIds[i] = runIds[i].replace('R', '');
            runIds[i] = runIds[i].trim();
        }

        return runIds;
    }

    /**
     *
     * @returns {string}
     */
    getRunName() {
        if (this.config === null) {
            return '';
        }

        // CYPRESS_TESTRAIL_RUN_NAME
        if (this.config.TESTRAIL_RUN_NAME !== undefined && this.config.TESTRAIL_RUN_NAME !== '') {
            return this.config.TESTRAIL_RUN_NAME;
        }

        if (this.config.testrail === undefined || this.config.testrail === null) {
            return '';
        }

        const runName = this.config.testrail.runName;

        if (runName === undefined || runName === null) {
            return '';
        }

        return runName;
    }

    /**
     *
     * @returns {boolean}
     */
    shouldCloseRun() {
        if (this.config === null) {
            return false;
        }

        // CYPRESS_TESTRAIL_RUN_NAME
        if (this.config.TESTRAIL_RUN_CLOSE !== undefined && this.config.TESTRAIL_RUN_CLOSE !== '') {
            return this.config.TESTRAIL_RUN_CLOSE;
        }

        if (this.config.testrail === undefined || this.config.testrail === null) {
            return false;
        }

        const closeRun = this.config.testrail.closeRun;

        if (closeRun === undefined || closeRun === null) {
            return false;
        }

        return closeRun;
    }

    /**
     *
     * @returns {boolean}
     */
    isScreenshotsEnabled() {
        if (this.config === null) {
            return false;
        }

        // CYPRESS_TESTRAIL_SCREENSHOTS
        if (this.config.TESTRAIL_SCREENSHOTS !== undefined && this.config.TESTRAIL_SCREENSHOTS !== '') {
            return Boolean(this.config.TESTRAIL_SCREENSHOTS);
        }

        if (this.config.testrail === undefined || this.config.testrail === null) {
            return false;
        }

        const screenshots = this.config.testrail.screenshots;

        if (screenshots === undefined || screenshots === null) {
            return false;
        }

        return Boolean(screenshots);
    }

    /**
     *
     * @returns {boolean}
     */
    includeAllCasesDuringCreation() {
        if (this.config === null) {
            return false;
        }

        // CYPRESS_TESTRAIL_SCREENSHOTS
        if (this.config.TESTRAIL_RUN_INCLUDE_ALL !== undefined && this.config.TESTRAIL_RUN_INCLUDE_ALL !== '') {
            return Boolean(this.config.TESTRAIL_RUN_INCLUDE_ALL);
        }

        if (this.config.testrail === undefined || this.config.testrail === null) {
            return false;
        }

        const includeAll = this.config.testrail.runIncludeAll;

        if (includeAll === undefined || includeAll === null) {
            return false;
        }

        return Boolean(includeAll);
    }

    /**
     *
     * @returns {boolean}
     */
    includeAllFailedScreenshots() {
        if (this.config === null) {
            return false;
        }

        // CYPRESS_TESTRAIL_SCREENSHOTS
        if (this.config.TESTRAIL_SCREENSHOTS_ALL !== undefined && this.config.TESTRAIL_SCREENSHOTS_ALL !== '') {
            return Boolean(this.config.TESTRAIL_SCREENSHOTS_ALL);
        }

        if (this.config.testrail === undefined || this.config.testrail === null) {
            return false;
        }

        const includeAll = this.config.testrail.screenshotsAll;

        if (includeAll === undefined || includeAll === null) {
            return false;
        }

        return Boolean(includeAll);
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
     * @returns {number}
     */
    getStatusPassed() {
        return 1;
    }

    /**
     *
     * @returns {number}
     */
    getStatusFailed() {
        return 5;
    }

    /**
     *
     * @returns {number}
     */
    getStatusSkipped() {
        return 2;
    }
}

module.exports = ConfigService;

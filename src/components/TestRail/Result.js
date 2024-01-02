class Result {
    /**
     *
     * @param caseId
     * @param statusId
     * @param comment
     * @param duration
     * @param screenshotPaths
     */
    constructor(caseId, statusId, comment, duration, screenshotPaths) {
        this._caseId = caseId;
        this._statusId = statusId;
        this._comment = comment;
        this._durationMS = duration;
        this._screenshotPaths = screenshotPaths;

        if (this._screenshotPaths === undefined) {
            this._screenshotPaths = [];
        }
    }

    /**
     *
     */
    getCaseId() {
        return this._caseId;
    }

    /**
     *
     */
    getStatusId() {
        return this._statusId;
    }

    /**
     *
     */
    getComment() {
        return this._comment;
    }

    /**
     *
     * @returns {*}
     */
    getElapsed() {
        if (this._durationMS === undefined) {
            return '0s';
        }
        return Math.round(this._durationMS / 1000) + 's';
    }

    /**
     * Returns if a valid elapsed time exists or not.
     * "0s" is not valid for TestRail and must NOT be sent to the TestRail API.
     * If sent, TestRail will throw an error.
     *
     * @returns {boolean}
     */
    hasElapsedTime() {
        return this.getElapsed() !== '0s';
    }

    /**
     *
     * @returns {*}
     */
    getScreenshotPaths() {
        return this._screenshotPaths;
    }
}

module.exports = Result;

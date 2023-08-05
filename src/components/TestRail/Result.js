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
        return Math.round(this._durationMS / 1000) + 's';
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

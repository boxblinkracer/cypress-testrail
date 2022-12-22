class Result {
    /**
     *
     * @param caseId
     * @param statusId
     * @param comment
     * @param duration
     * @param screenshotPath
     */
    constructor(caseId, statusId, comment, duration, screenshotPath) {
        this._caseId = caseId;
        this._statusId = statusId;
        this._comment = comment;
        this._durationMS = duration;
        this._screenshotPath = screenshotPath;
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
    getScreenshotPath() {
        return this._screenshotPath;
    }
}

module.exports = Result;

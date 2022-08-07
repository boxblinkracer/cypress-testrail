class Result {
    /**
     *
     * @param caseId
     * @param statusId
     * @param comment
     * @param duration
     */
    constructor(caseId, statusId, comment, duration) {
        this._caseId = caseId;
        this._statusId = statusId;
        this._comment = comment;
        this._durationMS = duration;
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
}

module.exports = Result;

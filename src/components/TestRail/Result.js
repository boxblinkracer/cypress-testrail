export default class Result {

    /**
     *
     * @param caseId
     * @param statusId
     * @param comment
     */
    constructor(caseId, statusId, comment) {
        this._caseId = caseId;
        this._statusId = statusId;
        this._comment = comment;
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

}

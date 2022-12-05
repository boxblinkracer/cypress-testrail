class ApiError {
    /**
     *
     * @param error
     */
    constructor(error) {
        if (error === undefined || error === null || error.response === undefined || error.response === null) {
            this._statusCode = 0;
            this._statusText = 'No response from TestRail';
            this._errorText = 'No response from TestRail';
        } else {
            this._statusCode = error.response.status !== undefined ? error.response.status : 0;
            this._statusText = error.response.statusText !== undefined ? error.response.statusText : 'Missing Status Text';
            this._errorText = error.response.data !== undefined && error.response.data.error !== undefined ? error.response.data.error : 'Missing Error';
        }
    }

    /**
     *
     */
    getStatusCode() {
        return this._statusCode;
    }

    /**
     *
     */
    getStatusText() {
        return this._statusText;
    }

    /**
     *
     */
    getErrorText() {
        return this._errorText;
    }
}

module.exports = ApiError;

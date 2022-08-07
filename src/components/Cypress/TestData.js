class TestData {
    /**
     *
     * @param data
     */
    constructor(data) {
        this._title = data.title !== undefined && data.title.length > 0 ? data.title[data.title.length - 1] : 'Title not found';
        this._state = data.state;

        this._error = data.displayError !== undefined && data.displayError !== null ? data.displayError : '';

        this._durationMS = 0;

        if (data.attempts !== undefined) {
            data.attempts.forEach((attempt) => {
                this._durationMS += attempt.wallClockDuration;
            });
        }
    }

    /**
     *
     * @returns {*}
     */
    getTitle() {
        return this._title;
    }

    /**
     *
     * @returns {boolean}
     */
    isPassed() {
        return this._error === '';
    }

    /**
     *
     * @returns {*}
     */
    getState() {
        return this._state;
    }

    /**
     *
     * @returns {*}
     */
    getDurationMS() {
        return this._durationMS;
    }

    /**
     *
     * @returns {string}
     */
    getError() {
        return this._error;
    }
}

module.exports = TestData;

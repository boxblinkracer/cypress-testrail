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

        if (data.duration) {
            this._durationMS = data.duration;
        } else {
            if (data.attempts !== undefined) {
                data.attempts.forEach((attempt) => {
                    this._durationMS += attempt.wallClockDuration;
                });
            }
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
     * @returns {*}
     */
    getState() {
        return this._state;
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
     * @returns {boolean}
     */
    isFailed() {
        return this._state === 'failed';
    }

    /**
     *
     * @returns {boolean}
     */
    isSkipped() {
        return this._state === 'pending';
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

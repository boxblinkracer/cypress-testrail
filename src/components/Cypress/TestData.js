class TestData {
    /**
     *
     * @param cypressData
     */
    constructor(cypressData) {
        this._cypressData = cypressData;

        this._title = cypressData.title !== undefined && cypressData.title.length > 0 ? cypressData.title[cypressData.title.length - 1] : 'Title not found';
        this._state = cypressData.state;

        this._error = cypressData.displayError !== undefined && cypressData.displayError !== null ? cypressData.displayError : '';
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
        if (this._cypressData.duration !== undefined && this._cypressData.duration !== null) {
            // this is since Cypress v13
            return this._cypressData.duration;
        }

        // if we don't have a .duration and no attempts, we return 0ms
        if (this._cypressData.attempts === undefined || this._cypressData.attempts === null) {
            return 0;
        }

        let durationMS = 0;

        // now sum up all attempts, but only if wallClockDuration is available
        this._cypressData.attempts.forEach((attempt) => {
            // check if wallClockDuration is available
            if (attempt.wallClockDuration !== undefined && attempt.wallClockDuration !== null) {
                durationMS += attempt.wallClockDuration;
            }
        });

        return durationMS;
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

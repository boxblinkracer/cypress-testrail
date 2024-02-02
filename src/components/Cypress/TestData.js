class TestData {
    /**
     *
     * @param cypressData
     */
    constructor(cypressData) {
        this._cypressData = cypressData;
    }

    /**
     *
     * @returns {*}
     */
    getId() {
        return this._cypressData.testId;
    }

    /**
     *
     * @returns {*}
     */
    getTitle() {
        if (this._cypressData.title !== undefined && this._cypressData.title.length > 0) {
            return this._cypressData.title[this._cypressData.title.length - 1];
        }

        return 'Title not found';
    }

    /**
     *
     * @returns {*}
     */
    getState() {
        return this._cypressData.state;
    }

    /**
     *
     * @returns {boolean}
     */
    isPassed() {
        return this.getError() === '';
    }

    /**
     *
     * @returns {boolean}
     */
    isFailed() {
        return this.getState() === 'failed';
    }

    /**
     *
     * @returns {boolean}
     */
    isPending() {
        return this.getState() === 'pending';
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
        if (this._cypressData.displayError !== undefined && this._cypressData.displayError !== null) {
            return this._cypressData.displayError;
        }

        return '';
    }
}

module.exports = TestData;

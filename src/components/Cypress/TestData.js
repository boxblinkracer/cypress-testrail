export default class TestData {

    /**
     *
     * @param data
     */
    constructor(data) {
        this._title = data.title;
        this._state = data.state;
        this._durationMS = data.duration;

        this._error = (data.err !== undefined) ? data.err.message : '';
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
        return (this._error === '');
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
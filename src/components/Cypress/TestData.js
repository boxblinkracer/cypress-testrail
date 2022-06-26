export default class TestData {

    /**
     *
     * @param data
     */
    constructor(data) {
        console.log(data);
        this._title = data.title;
        this._state = data.state;
        this._durationMS = data.duration;
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
     * @returns {*}
     */
    getDurationMS() {
        return this._durationMS;
    }

}
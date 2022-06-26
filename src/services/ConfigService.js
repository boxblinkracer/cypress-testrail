export default class ConfigService {

    /**
     *
     */
    constructor(configArray) {

        this.config = configArray;

        if (this.config === undefined) {
            this.config = null;
        }
    }

    /**
     *
     * @returns {boolean}
     */
    isValid() {
        if (this.getDomain() === '') {
            return false;
        }

        if (this.getRunId() === '') {
            return false;
        }

        return true;
    }

    /**
     *
     * @returns {*|string|string|string}
     */
    getDomain() {
        if (this.config === null) {
            return '';
        }

        const value = this.config.domain;

        if (value === undefined || value === null) {
            return '';
        }

        return value;
    }

    /**
     *
     * @returns {*|string|string|string}
     */
    getUsername() {
        if (this.config === null) {
            return '';
        }

        const value = this.config.username;

        if (value === undefined || value === null) {
            return '';
        }

        return value;
    }

    /**
     *
     * @returns {*|string|string|string}
     */
    getPassword() {
        if (this.config === null) {
            return '';
        }

        const value = this.config.password;

        if (value === undefined || value === null) {
            return '';
        }

        return value;
    }

    /**
     *
     * @returns {string}
     */
    getRunId() {

        if (this.config === null) {
            return '';
        }

        const runId = this.config.runId;

        if (runId === undefined || runId === null) {
            return '';
        }

        return runId;
    }

    /**
     *
     * @returns {number}
     */
    getStatusPassed() {
        return 1;
    }

    /**
     *
     * @returns {number}
     */
    getStatusFailed() {
        return 5;
    }

}

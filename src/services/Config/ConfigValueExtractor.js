const ObjectCompare = require('../ObjectCompare');

class ConfigValueExtractor {
    /**
     *
     */
    constructor(configArray) {
        this._config = configArray;

        if (this._config === undefined) {
            this._config = null;
        }

        this._comparer = new ObjectCompare();
    }

    /**
     *
     * @param {string} keyCLI
     * @param {string} keyJSON
     * @returns {string}
     * @private
     */
    getStringValue(keyCLI, keyJSON) {
        const value = this._getValue(keyCLI, keyJSON);

        if (value === null) {
            return '';
        }

        return value.toString();
    }

    /**
     *
     * @param keyCLI
     * @param keyJSON
     * @returns {any[]|(*|string)[]|string[]|*[]}
     * @private
     */
    getArrayValue(keyCLI, keyJSON) {
        const value = this._getValue(keyCLI, keyJSON);

        if (value === null) {
            return [];
        }

        if (Array.isArray(value)) {
            return value;
        }

        if (value.toString().indexOf(',') !== -1) {
            return value.split(',');
        }

        return [value];
    }

    /**
     *
     * @param keyCLI
     * @param keyJSON
     * @param defaultValue
     * @returns {*|boolean}
     */
    getBooleanValue(keyCLI, keyJSON, defaultValue) {
        const value = this._getValue(keyCLI, keyJSON);

        if (value === null) {
            return defaultValue;
        }

        return Boolean(value);
    }

    /**
     *
     * @param keyCLI
     * @param keyJSON
     * @returns {null}
     * @private
     */
    _getValue(keyCLI, keyJSON) {
        let value = null;

        // ------------------------------------------------------------------------------------------------------------------------
        // search in ENV variables

        if (!this._comparer.isUndefinedOrNull(this._config)) {
            value = this._config[keyCLI];
        }

        if (!this._comparer.isEmpty(value)) {
            return value;
        }

        // ------------------------------------------------------------------------------------------------------------------------
        // search in process.env variables

        /* eslint-disable no-undef */
        if (!this._comparer.isUndefinedOrNull(process.env)) {
            /* eslint-disable no-undef */
            value = process.env[keyCLI];
        }

        if (!this._comparer.isEmpty(value)) {
            return value;
        }

        // ------------------------------------------------------------------------------------------------------------------------
        // search in config JSON

        if (!this._comparer.isUndefinedOrNull(this._config) && !this._comparer.isUndefinedOrNull(this._config.testrail)) {
            value = this._config.testrail[keyJSON];
        }

        if (!this._comparer.isEmpty(value)) {
            return value;
        }

        return null;
    }
}

module.exports = ConfigValueExtractor;

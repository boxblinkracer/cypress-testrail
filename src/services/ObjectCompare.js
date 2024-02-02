class ObjectCompare {
    /**
     *
     * @param value
     * @returns {boolean}
     */
    isUndefinedOrNull(value) {
        return value === undefined || value === null;
    }

    /**
     *
     * @param value
     * @returns {boolean}
     */
    isEmpty(value) {
        return this.isUndefinedOrNull(value) || value === '';
    }
}

module.exports = ObjectCompare;

class CypressStatusConverter {
    /**
     *
     * @param statusPassed
     * @param statusFailed
     * @param statusPending
     */
    constructor(statusPassed, statusFailed, statusPending) {
        this.statusPassed = statusPassed;
        this.statusFailed = statusFailed;
        this.statusPending = statusPending;
    }

    /**
     *
     * @param statusText
     * @returns {number|string}
     */
    convertToTestRail(statusText) {
        switch (statusText) {
            case 'passed':
                return this.statusPassed;

            case 'failed':
                return this.statusFailed;

            case 'pending':
                return this.statusPending;
        }

        return -1;
    }
}

module.exports = CypressStatusConverter;

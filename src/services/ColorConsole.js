class ColorConsole {
    /**
     *
     * @param text
     */
    static debug(text) {
        /* eslint-disable no-console */
        console.log('\x1b[90m', text, '\x1b[0m');
    }

    /**
     *
     * @param text
     */
    static info(text) {
        /* eslint-disable no-console */
        console.log('\x1b[1m', text, '\x1b[0m');
    }

    /**
     *
     * @param text
     */
    static warn(text) {
        /* eslint-disable no-console */
        console.log('\x1b[33m', text, '\x1b[0m');
    }

    /**
     *
     * @param text
     */
    static success(text) {
        /* eslint-disable no-console */
        console.log('\x1b[32m', text, '\x1b[0m');
    }

    /**
     *
     * @param text
     */
    static error(text) {
        /* eslint-disable no-console */
        console.log('\x1b[31m', text, '\x1b[0m');
    }
}

module.exports = ColorConsole;

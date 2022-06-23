export default class TestCaseParser {

    /**
     *
     * @param title
     * @returns {string}
     */
    searchCaseId(title) {
        if (title.includes(':', 0) && title.startsWith('C')) {
            return title.substring(1, title.indexOf(":"));
        }

        return '';
    }

}

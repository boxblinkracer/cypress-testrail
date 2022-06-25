export default class TestCaseParser {

    /**
     *
     * @param title
     * @returns {string}
     */
    searchCaseId(title) {
        const trimmedTitle = title.trim();

        if (trimmedTitle.includes(':', 0) && trimmedTitle.startsWith('C')) {
            return trimmedTitle.substring(1, trimmedTitle.indexOf(':'));
        }

        return '';
    }

}

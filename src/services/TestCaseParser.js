class TestCaseParser {
    /**
     *
     * @param title
     * @returns {string[]|*[]}
     */
    searchCaseId(title) {
        const trimmedTitle = title.trim();

        const foundCases = [];

        if (trimmedTitle.includes(':')) {
            const caseSection = trimmedTitle.substring(0, trimmedTitle.indexOf(':'));

            const cases = caseSection.split(' ');

            cases.forEach((singleCase) => {
                if (singleCase.startsWith('C')) {
                    singleCase = singleCase.replace('C', '').replace(',', '');
                    foundCases.push(singleCase);
                }
            });
        }

        return foundCases;
    }
}

module.exports = TestCaseParser;

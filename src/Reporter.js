import ApiClient from './components/TestRail/ApiClient';
import TestCaseParser from './services/TestCaseParser';
import Result from "./components/TestRail/Result";


export default class Reporter {

    /**
     *
     */
    constructor() {

        this.PASSED = 1;
        this.FAILED = 5;

        this.testCaseParser = new TestCaseParser();
        this.config = Cypress.env('testrail');
    }

    /**
     *
     */
    register() {

        Cypress.on('test:after:run', (testData) => {

            if (this.config === null || this.config === undefined) {
                return;
            }

            if (this.config.domain === undefined || this.config.domain === null || this.config.domain === '') {
                return;
            }

            const caseId = this.testCaseParser.searchCaseId(testData.title);

            if (caseId === '') {
                return;
            }


            let status = this.PASSED;

            if (testData.state !== 'passed') {
                status = this.FAILED;
            }

            const api = new ApiClient(
                this.config.domain,
                this.config.username,
                this.config.password
            );

            const result = new Result(caseId, status, 'Tested by Cypress');

            api.sendResult(this.config.runId, result);
        })
    }

}

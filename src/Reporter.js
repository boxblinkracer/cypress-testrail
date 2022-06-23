import ApiClient from './components/TestRail/ApiClient';
import TestCaseParser from './services/TestCaseParser';
import Status from "./components/TestRail/Status";
import Result from "./components/TestRail/Result";


export default class Reporter {

    /**
     *
     */
    constructor() {

        this.testCaseParser = new TestCaseParser();

        this.config = Cypress.env('testrail');

        this.api = new ApiClient(
            this.config.domain,
            this.config.username,
            this.config.password
        );
    }

    /**
     *
     */
    register() {

        Cypress.on('test:after:run', (testData) => {

            if (this.config.domain === null || this.config.domain === '') {
                return;
            }

            const caseId = this.testCaseParser.searchCaseId(testData.title);

            if (caseId === '') {
                return;
            }


            let status = Status.PASSED;

            if (testData.state !== 'passed') {
                status = Status.FAILED;
            }

            const result = new Result(caseId, status, 'Tested by Cypress');

            this.api.sendResult(this.config.runId, result);
        })
    }

}

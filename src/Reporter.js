import ApiClient from './components/TestRail/ApiClient';
import TestCaseParser from './services/TestCaseParser';
import Result from './components/TestRail/Result';
import ConfigService from './services/ConfigService';


export default class Reporter {

    /**
     *
     */
    constructor() {
        this.testCaseParser = new TestCaseParser();
        /* eslint-disable no-undef */
        this.config = new ConfigService(Cypress.env('testrail'));
    }

    /**
     *
     */
    register() {

        /* eslint-disable no-undef */
        Cypress.on('test:after:run', (testData) => {

            if (this.config === null || this.config === undefined) {
                return;
            }

            if (this.config.getDomain() === '' || this.config.getRunId() === '') {
                return;
            }

            const caseId = this.testCaseParser.searchCaseId(testData.title);

            if (caseId === '') {
                return;
            }


            let status = this.config.getStatusPassed();

            if (testData.state !== 'passed') {
                status = this.config.getStatusFailed();
            }

            const api = new ApiClient(
                this.config.getDomain(),
                this.config.getUsername(),
                this.config.getPassword()
            );

            const result = new Result(caseId, status, 'Tested by Cypress');

            api.sendResult(this.config.getRunId(), result);
        })
    }

}

import ApiClient from './components/TestRail/ApiClient';
import TestCaseParser from './services/TestCaseParser';
import Result from './components/TestRail/Result';
import ConfigService from './services/ConfigService';
import TestData from './components/Cypress/TestData';


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
        Cypress.on('test:after:run', (test) => {

            const testData = new TestData(test);

            if (!this.config.isValid()) {
                return;
            }

            const caseId = this.testCaseParser.searchCaseId(testData.getTitle());

            if (caseId === '') {
                return;
            }


            let status = this.config.getStatusPassed();

            if (testData.getState() !== 'passed') {
                status = this.config.getStatusFailed();
            }

            const api = new ApiClient(
                this.config.getDomain(),
                this.config.getUsername(),
                this.config.getPassword()
            );

            const result = new Result(
                caseId,
                status,
                'Tested by Cypress',
                testData.getDurationMS()
            );

            api.sendResult(this.config.getRunId(), result);
        })
    }

}

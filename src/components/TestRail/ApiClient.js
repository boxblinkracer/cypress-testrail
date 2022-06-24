import Result from './Result';

const axios = require('axios');


export default class ApiClient {

    /**
     * @param domain
     * @param username
     * @param password
     */
    constructor(domain, username, password) {
        this.username = username;
        this.password = password;
        this.baseUrl = `https://${domain}/index.php?/api/v2`;
    }

    /**
     *
     * @param runID
     * @param result
     */
    sendResult(runID, result) {

        const postData = {
            "results": [
                {
                    "case_id": result.getCaseId(),
                    "status_id": result.getStatusId(),
                    "comment": result.getComment()
                }
            ]
        };

        axios(
            {
                method: 'post',
                url: `${this.baseUrl}/add_results_for_cases/${runID}`,
                headers: {'Content-Type': 'application/json'},
                auth: {
                    username: this.username,
                    password: this.password,
                },
                data: JSON.stringify(postData),
            })
            .then(response => {
                console.log("Sent TestRail result for TestCase " + result.getCaseId());
            })
            .catch(error => {
                console.error(error)
            });
    }

}

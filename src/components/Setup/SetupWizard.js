const ask = require('./service/Ask');
const toggle = require('./service/Toggle');

module.exports = async () => {
    const testrailDomain = await ask({
        message: 'TestRail Domain',
        hint: 'company.testrail.io',
        type: 'input',
    });

    const testrailUser = await ask({
        message: 'TestRail User',
        type: 'input',
    });

    const testrailPwd = await ask({
        message: 'TestRail Password',
        type: 'input',
    });

    const modeExistingRun = await toggle({
        message: 'Send results to an existing run in TestRail?',
    });

    let runID = '';
    let projectId = '';
    let suiteId = '';
    let milestoneId = '';
    let runName = '';
    let closeRun = false;

    if (modeExistingRun) {
        runID = await ask({
            message: 'TestRail Run ID',
            hint: '(R123)',
        });
    } else {
        projectId = await ask({
            message: 'TestRail Project ID',
            hint: '(required) P123',
        });

        suiteId = await ask({
            message: 'TestRail Suite ID',
            hint: '(optional) S123',
        });

        milestoneId = await ask({
            message: 'TestRail Milestone ID',
            hint: '(optional) M123',
        });

        runName = await ask({
            message: 'TestRail Run Name',
            hint: '(optional) template name for the run being created. Use this for the current date: (__datetime__)',
        });

        closeRun = await toggle({
            message: 'Automatically close run after execution?',
        });
    }

    const sendScreenshots = await toggle({
        message: 'Send screenshots to TestRail for failed tests?',
    });

    const config = {
        testrail: {
            domain: testrailDomain,
            username: testrailUser,
            password: testrailPwd,
        },
    };

    if (modeExistingRun) {
        config.testrail.runId = runID;
    } else {
        config.testrail.projectId = projectId;
        config.testrail.milestoneId = milestoneId;
        config.testrail.suiteId = suiteId;
        config.testrail.runName = runName;
        config.testrail.closeRun = closeRun;
    }

    config.testrail.screenshots = sendScreenshots;

    /* eslint-disable no-console */
    console.log();
    /* eslint-disable no-console */
    console.log();
    /* eslint-disable no-console */
    console.log('Here is your template:');
    /* eslint-disable no-console */
    console.log('Please add it to your "cypress.env.json" file.');
    /* eslint-disable no-console */
    console.log('================================================');
    /* eslint-disable no-console */
    console.log(JSON.stringify(config, null, 4));
};

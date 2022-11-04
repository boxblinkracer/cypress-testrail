<p align="center">
   <img width="200px" src="/assets/cypress.jpg">
</p>
<h1 align="center">(Super Easy) Cypress TestRail Integration</h1>


![Build Status](https://github.com/boxblinkracer/cypress-testrail/actions/workflows/ci_pipe.yml/badge.svg) ![NPM Downloads](https://badgen.net/npm/dt/cypress-testrail) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/boxblinkracer/cypress-testrail) ![NPM License](https://img.shields.io/npm/l/cypress-testrail)

This integration helps you to automatically send test results to TestRail. And yes, super easy and simple!

Add your TestRail credentials in Cypress, decide which test results should be sent to TestRail and you're done!

### 1. Installation

```ruby 
npm i cypress-testrail --save-dev
```

### 2. Setup TestRail credentials

Now configure your credentials for the TestRail API.
Just add this snippet in your `Cypress.env.json` file and adjust the values.
Please keep in mind, the `runId` is always the test run, that you want to send the results to.
You can find the ID inside the test run in TestRail. It usually starts with an R, like "R68".

```yaml 
{
  "testrail": {
    "domain": "my-company.testrail.io",
    "username": "myUser",
    "password": "myPwd"
  }
}
```

You can also set these variables as ENV variable.

```bash 
CYPRESS_TESTRAIL_DOMAIN=my-company.testrail.io CYPRESS_TESTRAIL_USERNAME=myUser CYPRESS_TESTRAIL_PASSWORD=myPwd  ./node_modules/.bin/cypress run 
```

### 3. Setup Mode

#### 3.1 Send result to specific Run in TestRail

Just assign the RunID of TestRail in your `Cypress.env.json` and all results will be sent to this run.

Results will only be saved, if the sent TestCaseID is also existing in that run inside TestRail.

```yaml 
{
  "testrail": {
    // ....
    "runId": "12345"
  }
}
```

You can also set this variable as ENV variable.

```bash 
CYPRESS_TESTRAIL_RUN_ID=15 ./node_modules/.bin/cypress run 
```

#### 3.2 Create new Run in TestRail for every Cypress run

Sometimes you want to create test runs dynamically inside TestRail.
For this, just assign the ProjectID and the optional MilestoneID of TestRail in your `Cypress.env.json`.

The integration will then start a new run in TestRail and send the results to this one.
It is also possible to provide a custom (or dynamically created) name for the new test run.

```yaml 
{
  "testrail": {
    // ....
    "projectId": "12",                      // required
    "milestoneId": "55",                    // optional
    "runName": "Version XY (__datetime__)",   // optional, use placeholder __datetime__ for current date time
    "closeRun": true,                       // optional (default FALSE), automatically close run in this mode
  }
}
```

You can also set these variables as ENV variable.
Here is a sample of 2 variables being used.

```bash 
CYPRESS_TESTRAIL_PROJECT_ID=2 CYPRESS_TESTRAIL_MILESTONE_ID=15 ./node_modules/.bin/cypress run 
```

| ENV Variable | Value |
| ------------- | ---------- |
| CYPRESS_TESTRAIL_PROJECT_ID | your ID from TestRail |
| CYPRESS_TESTRAIL_MILESTONE_ID | your ID from TestRail |
| CYPRESS_TESTRAIL_RUN_NAME | any string |
| CYPRESS_TESTRAIL_RUN_CLOSE | true, false |

### 4. Register Plugin

Just place this line in your `plugins/index.js` file.
There's nothing more that is required to register the TestRail reporter.

```javascript 
const TestRailReporter = require('cypress-testrail');

module.exports = (on, config) => {
    new TestRailReporter(on, config).register();
    return config
}
```

In addition to this, you can register the reporter with a **custom comment**.
That comment will then be sent to the TestRail result along with the other metadata,
such as Cypress version, browser, baseURL and more.

```javascript 
const customComment = 'AUT v' + Cypress.env('MY_APP_VERSION');

new TestRailReporter(on, config, customComment).register();
```

If you are running Cypress 10 and higher, then there is no classic plugin/index.js file anymore.
You can of course still use it. The new `cypress.config.js` has a configuration option called `setupNodeEvents`.
That one acts as the perfect entrypoint to either directly start the configuration, or just load a separate file.

```javascript
e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config)
    {
        return require('./cypress/plugins/index.js')(on, config)
    }
,
}
```

### 5. Map Test Cases

We're almost done.
You can now map TestRail test cases to your Cypress tests.
Please use the TestRail case ID as a prefix inside the Cypress test title.
The plugin will automatically extract it, and send the results to your test run in TestRail.
The Case ID needs to be at the beginning and separated with an `:` from the rest of the title.

You can also add multiple Case IDs before the `:`. Results will be sent for all found test cases.

```javascript 
it('C123: My Test for TestRail case 123', () => {

    cy.get('#sw-field--name').type('John');
    // ...
    // ...
    
})

it('C123 C54 C36: My Test for multiple TestRail case IDs', () => {

    cy.get('#sw-field--name').type('John');
    // ...
    // ...
    
})
```

## That's it!

You can now start Cypress (restart after config changes), and all your results should be sent to TestRail as soon as your mapped tests pass or fail!

### Copying / License

This repository is distributed under the MIT License (MIT). You can find the whole license text in the [LICENSE](LICENSE) file.

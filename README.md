<p align="center">
   <img width="200px" src="/assets/cypress.jpg">
</p>
<h1 align="center">(Super Easy) Cypress TestRail Integration</h1>


![Build Status](https://github.com/boxblinkracer/cypress-testrail/actions/workflows/ci_pipe.yml/badge.svg) ![NPM Downloads](https://badgen.net/npm/dt/cypress-testrail) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/boxblinkracer/cypress-testrail) ![NPM License](https://img.shields.io/npm/l/cypress-testrail)

This integration helps you to automatically send test results to TestRail. And yes, super easy and simple!

Add your TestRail credentials in Cypress, decide which test results should be sent to TestRail and you're done!

<!-- TOC -->
  * [1. Installation](#1-installation)
  * [2. Setup Wizard](#2-setup-wizard)
  * [3. Execution Modes](#3-execution-modes)
    * [3.1 Mode A: Send results to one or more runs in TestRail](#31-mode-a-send-results-to-one-or-more-runs-in-testrail)
    * [3.2 Mode B: Create new Run in TestRail for every Cypress run](#32-mode-b-create-new-run-in-testrail-for-every-cypress-run)
  * [4. Register Plugin](#4-register-plugin)
  * [5. Map Test Cases](#5-map-test-cases)
  * [6. Advanced Features](#6-advanced-features)
    * [6.1 Sending Screenshots to TestRail](#61-sending-screenshots-to-testrail)
    * [6.2 Using multiple Cypress plugins](#62-using-multiple-cypress-plugins)
    * [6.3 Cucumber Gherkin Support](#63-cucumber-gherkin-support)
    * [6.4 Get data of new TestRail runs](#64-get-data-of-new-testrail-runs)
  * [7. Variables](#7-variables)
    * [7.1 Use on CLI](#71-use-on-cli)
    * [7.2 Use in cypress.env.json](#72-use-in-cypressenvjson)
  * [8. Copying / License](#8-copying--license)
<!-- TOC -->

### 1. Installation

```ruby 
npm i cypress-testrail --save-dev
```

Please keep in mind that this integration requires a minimum version of Node.js v13.0.

Note: Versions of Node < Node 13 may work but will require enabling experimental-modules flag.

### 2. Setup Wizard

The integration has a CLI command that you can use to build your configuration in an interactive way.

Run it with this command and enter your data:

```ruby 
./node_modules/.bin/cypress-testrail 
```

Please copy the displayed JSON structure of that command to your `cypress.env.json` file.

You can of course also build such a JSON manually. In addition to this, you can also use ENV variables or process.env variables. Please see the section on variables below for more.

Here is a sample of a JSON from the CLI command.

```yaml 
{
  "testrail": {
    "domain": "my-company.testrail.io",
    "username": "myUser",
    "password": "myPwd",
    "runId": "R123",
    "screenshots": true
  }
}
```

Please note that you can use both, the **password** of your TestRail user, or a generated **API key** for the password field.

### 3. Execution Modes

The integration has 2 different modes, that you can select while running our **Setup CLI** command.

#### 3.1 Mode A: Send results to one or more runs in TestRail

With this mode, all results are fired against an existing Test Run or a list of Test Runs in TestRail.
This is a good option if you have already prepared your plan in TestRail and just need to have Cypress doing the work for you.

Please keep in mind, that the provided run must not be closed, so that the TestRail API allows you to send results to it.

Results will only be saved, if the sent TestCaseID is existing in that run inside TestRail.

#### 3.2 Mode B: Create new Run in TestRail for every Cypress run

Sometimes you want to create test runs dynamically inside TestRail.
For this, just assign the ProjectID and the optional MilestoneID or SuiteId of TestRail in your configuration.

The integration will then start a new run in TestRail and send the results to this one.
It is also possible to provide a custom (or dynamically created) name for the new test run.

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

If you want to register the plugin for using Cypress in "Open" mode,
please also enable ```experimentalInteractiveRunEvents``` in ```cypress.config.js```

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

That's it!

You can now start Cypress (restart after config changes), and all your results should be sent to TestRail as soon as your mapped tests pass or fail!

### 6. Advanced Features

#### 6.1 Sending Screenshots to TestRail

You can automatically send the latest failure screenshot of Cypress to TestRail.
This is not enabled by default. Just enable it, and it will automatically work.
Once enabled, the latest failed screenshot is sent to TestRail.

```yaml 
{
  "testrail": {
    "screenshots": true
  }
}
```

If you want to send all failed screenshots to TestRail, just enable the additional (optional) feature.
This will send all failed screenshots of all attempts in Cypress to TestRail.

```yaml 
{
  "testrail": {
    "screenshots": true,
    "screenshotsAll": true
  }
}
```

#### 6.2 Using multiple Cypress plugins

Let's start with the most important thing: The problem with the Cypress event listeners.

This integration uses events like "before:run" and more.
Unfortunately Cypress does not have a list of subscribed event handlers, that means if multiple plugins are using the same event, then they will overwrite each other.

Thanks to @bahmutov we have a solution for this problem (https://github.com/bahmutov/cypress-on-fix).

Please install his package "cypress-on-fix" as described on his website.

#### 6.3 Cucumber Gherkin Support

This integration works with both, plain Cypress tests but also in combination
with the Cucumber plugin and Gherkin documents (https://github.com/badeball/cypress-cucumber-preprocessor).

Once installed, you can easily prefix the titles of your **Scenario** entries with the TestRail case ID.
Internally they are converted into Cypress tests, which means everything works as with the plain usage of tests.

```markdown
Feature: Blog Page Features

Scenario: C123: Filter blog posts by tags
Given I am on the blog page
When I click on tag "testing"
Then I see tag "testing" as title of the page
```

**Installation**

Please install the cucumber plugin for Cypress as described on their website.
Also consider the problem of having multiple plugins using the same event listeners as described above.

Once done, you need to configure Cucumber, our Cypress TestRail integration and the cypress-on-fix package.
Here is a sample configuration with all 3 plugins being used (please note, this is just a sample):

```javascript
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const {addCucumberPreprocessorPlugin} = require('@badeball/cypress-cucumber-preprocessor');
const {createEsbuildPlugin} = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const {defineConfig} = require('cypress');
const TestRailReporter = require('cypress-testrail');

module.exports = defineConfig({
    e2e: {
        // sample to configure both, gerhkin documents and plain cypress tests
        specPattern: ['cypress/e2e/**/*.feature', 'cypress/e2e/**/*.js'],

        async setupNodeEvents(cypressOn, config) {
            // prepare the fix for event listeners
            const on = require('cypress-on-fix')(cypressOn)

            // configure cucumber
            await addCucumberPreprocessorPlugin(on, config);
            on('file:preprocessor', createBundler({
                plugins: [createEsbuildPlugin(config)],
            }));

            // configure TestRail
            new TestRailReporter(on, config).register();

            return config
        },
    },
});
```

That's it! When you now run tests based on Gherkin documents, the TestRail integration will automatically send the results to TestRail.

#### 6.4 Get data of new TestRail runs

When using the "Create Run Mode", the integration will now create a new file called **created_run.json**.
This is immediately created after the run was created in TestRail and contains data such as the ID, name and more.

You can use this file to immediately read and use data of the created run in other steps of your CI pipeline, while Cypress is running.

### 7. Variables

This is a list of all available variables and their explanation.

The list shows you the ENV variable name as well as their JSON structure name.
You can use all variables in both scopes.

Examples on how to use it are below the list.

| ENV / process.env                | JSON                    | Required        | Description                                                                                                                                                                           |
|----------------------------------|-------------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CYPRESS_TESTRAIL_DOMAIN          | testrail.domain         | yes             | TestRail domain                                                                                                                                                                       |
| CYPRESS_TESTRAIL_USERNAME        | testrail.username       | yes             | TestRail username                                                                                                                                                                     |
| CYPRESS_TESTRAIL_PASSWORD        | testrail.password       | yes             | TestRail password or TestRail API key.                                                                                                                                                |
| CYPRESS_TESTRAIL_SCREENSHOTS     | testrail.screenshots    | no              | Send last screenshot of failed test.<br />Values: true/false                                                                                                                          |
| CYPRESS_TESTRAIL_SCREENSHOTS_ALL | testrail.screenshotsAll | no              | Send all screenshots of failed test. (requires screenshots to be enabled).<br />Values: true/false                                                                                    |
| CYPRESS_TESTRAIL_RUN_ID          | testrail.runId          | yes (Mode A)    | TestRail RunID to fire against, e.g. R123                                                                                                                                             |
| CYPRESS_TESTRAIL_RUN_IDS         | testrail.runIds         | yes (Mode A)    | TestRail RunIDs to fire against, e.g. ["R123", "R456"]. Either provide single runID or this list. Send comma separated as ENV variable from CLI (xxx="R1,R2"                          |
| CYPRESS_TESTRAIL_PROJECT_ID      | testrail.projectId      | yes (Mode B)    | TestRail ProjectID, e.g. P45                                                                                                                                                          |
| CYPRESS_TESTRAIL_MILESTONE_ID    | testrail.milestoneId    | yes (Mode A)    | TestRail MilestoneID, e.g. M4                                                                                                                                                         |
| CYPRESS_TESTRAIL_SUITE_ID        | testrail.suiteId        | yes/no (Mode B) | TestRail SuiteID, e.g. S8.<br />Some projects might require this!                                                                                                                     |
| CYPRESS_TESTRAIL_RUN_NAME        | testrail.runName        | no (Mode B)     | Template for the names of created runs. You can provide a fixed text but also use dynamic variables.<br /><br />Variables: (\_\_datetime\_\_) => generates e.g. "01/04/2022 12:45:00" |
| CYPRESS_TESTRAIL_RUN_INCLUDE_ALL | testrail.runIncludeAll  | no              | Include all test cases in test run creation.<br />Values: true/false                                                                                                                  |
| CYPRESS_TESTRAIL_RUN_CLOSE       | testrail.closeRun       | no (Mode B)     | Automatically close test runs.<br />Values: true/false                                                                                                                                |
| CYPRESS_TESTRAIL_IGNORE_PENDING  | testrail.ignorePending  | no              | If enabled, pending Cypress tests will not be sent to TestRail.<br />Values: true/false                                                                                               |

#### 7.1 Use on CLI

To provide variables on CLI just expose them before executing your actual command.

```bash 
CYPRESS_TESTRAIL_PROJECT_ID=2 CYPRESS_TESTRAIL_MILESTONE_ID=15 ./node_modules/.bin/cypress run 
```

#### 7.2 Use in cypress.env.json

You can also provide the variables in a JSON structure like this inside your **cypress.env.json** file.

```
{
    "testrail": {
        "domain": "",
        "username": "",
        "password": "",
        "screenshots": false,
        "projectId": "",
        "milestoneId": "",
        "suiteId": "",
        "runName": "",
        "runIncludeAll": false,
        "closeRun": false,
        "screenshots": false
    }
}
```

### 8. Copying / License

This repository is distributed under the MIT License (MIT).

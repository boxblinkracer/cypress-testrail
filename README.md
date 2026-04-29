<p align="center">
   <img width="200px" src="/assets/cypress.jpg">
</p>
<h1 align="center">Cypress TestRail Integration — VoltServer Fork</h1>

![NPM License](https://img.shields.io/npm/l/cypress-testrail)

This is the **VoltServer fork** of [cypress-testrail](https://www.npmjs.com/package/cypress-testrail) (v2.10.0), installed from [github.com/VoltServer/cypress-testrail-greenwich](https://github.com/VoltServer/cypress-testrail-greenwich).

This fork adds:
- **`ResultsAggregator`** — deduplicates results across spec files (fail trumps pass, pass trumps skip).
- **`TestCaseParser`** — extracts `C<id>` tags from Cypress test titles.
- **`ignoreMissingCaseIds`** — suppress errors when case IDs are not in the target run.
- Full **Cypress 15** compatibility (`--env` / `--expose` split).

**Quick reference:** [CY-TO-TR-QUICK-USAGE-GUIDE.md](CY-TO-TR-QUICK-USAGE-GUIDE.md) — day-to-day usage guide.
**Architecture reference:** [TESTRAIL-INTEGRATION-README.md](TESTRAIL-INTEGRATION-README.md) — internals, config lookup, Cypress 15 migration details.

<!-- TOC -->
  * [1. Installation](#1-installation)
  * [2. Credentials Setup](#2-credentials-setup)
  * [3. Register the Plugin](#3-register-the-plugin)
  * [4. Map Test Cases](#4-map-test-cases)
  * [5. Execution Modes](#5-execution-modes)
    * [5.1 Mode A: Report to an existing TestRail run](#51-mode-a-report-to-an-existing-testrail-run)
    * [5.2 Mode B: Create a new TestRail run for every Cypress run](#52-mode-b-create-a-new-testrail-run-for-every-cypress-run)
  * [6. Running Tests with TestRail Reporting](#6-running-tests-with-testrail-reporting)
  * [7. `--env` vs `--expose` — Getting It Right (Cypress 15)](#7---env-vs---expose--getting-it-right-cypress-15)
  * [8. Result Aggregation](#8-result-aggregation)
  * [9. Screenshots](#9-screenshots)
  * [10. All Configuration Variables](#10-all-configuration-variables)
  * [11. Advanced Features](#11-advanced-features)
    * [11.1 Multiple Cypress Plugins](#111-multiple-cypress-plugins)
    * [11.2 Cucumber / Gherkin Support](#112-cucumber--gherkin-support)
    * [11.3 Created Run File](#113-created-run-file)
  * [12. Architecture](#12-architecture)
  * [13. Cypress Migration Notes](#13-cypress-migration-notes)
    * [13.1 Cypress 10+: plugins/index.js → setupNodeEvents](#131-cypress-10-pluginsindexjs--setupnodeevents)
    * [13.2 Cypress 15: --env / --expose split](#132-cypress-15---env----expose-split)
  * [14. License](#14-license)
<!-- TOC -->

---

## 1. Installation

Install from the VoltServer GitHub fork:

```bash
npm install github:VoltServer/cypress-testrail-greenwich --save-dev
```

Requires Node.js ≥ 13.

---

## 2. Credentials Setup

Set credentials as OS environment variables — **never** hard-code them in `cypress.config.js`:

```bash
# In ~/.zprofile or your CI environment:
export CYPRESS_TESTRAIL_USERNAME="name@yourcompany.com"
export CYPRESS_TESTRAIL_PASSWORD="your-testrail-api-key"
```

You can use either your TestRail account password or a generated **API key** in the password field.

The static, non-secret config (domain, feature flags) lives in `cypress.config.js`:

```js
env: {
  testrail: {
    domain: 'yourcompany.testrail.com',
    screenshots: true,
    ignorePending: true,
    ignoreMissingCaseIds: true,
  },
},
```

---

## 3. Register the Plugin

In `cypress.config.js`, register the reporter inside `setupNodeEvents`. Enable it conditionally so it only activates when `TESTRAIL_RUN_ID` is provided:

```js
const TestRailReporter = require('cypress-testrail');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      if (config.env.TESTRAIL_RUN_ID) {
        new TestRailReporter(on, config).register();
      }
      return config;
    },
  },
});
```

You can also pass a custom comment:

```js
new TestRailReporter(on, config, 'AUT v' + process.env.APP_VERSION).register();
```

---

## 4. Map Test Cases

Tag test titles with `C<id>` **before the colon**. The parser extracts IDs from the portion of the title before the first `:`.

```js
it('C12345: should do the thing', { tags: ['@testRail', '%C12345'] }, () => { … });

// Multiple case IDs in one test:
it('C12345 C67890: covers two cases', { tags: ['@testRail', '%C12345', '%C67890'] }, () => { … });
```

The `{ tags: … }` metadata enables filtering with `@cypress/grep`. Only tests with `C<id>` tags are reported to TestRail.

---

## 5. Execution Modes

### 5.1 Mode A: Report to an existing TestRail run

Provide `TESTRAIL_RUN_ID` (or a comma-separated list via `TESTRAIL_RUN_IDS`). The run must be open.

Results are only recorded if the sent case ID exists in that run.

### 5.2 Mode B: Create a new TestRail run for every Cypress run

Omit `TESTRAIL_RUN_ID` and instead provide `TESTRAIL_PROJECT_ID` (and optionally `TESTRAIL_MILESTONE_ID` / `TESTRAIL_SUITE_ID`). The reporter creates a new run, sends results to it, and optionally closes it after the suite finishes.

Use `TESTRAIL_RUN_NAME` to control the name of the created run. The placeholder `__datetime__` is replaced at runtime.

---

## 6. Running Tests with TestRail Reporting

Pass `TESTRAIL_RUN_ID` via `--env`. All other TestRail flags also go via `--env`.

```bash
# Smoke test (small subset first):
npx cypress run \
  --spec "cypress/e2e/4-inline-comms/*.cy.js" \
  --env TESTRAIL_RUN_ID=R29785 \
  --expose DEVICE_ID=voltserv-05dd

# Single spec:
npx cypress run \
  --spec "cypress/e2e/1-general/history_page.cy.js" \
  --env TESTRAIL_RUN_ID=R24219 \
  --expose DEVICE_ID=voltserv-896e

# All specs:
npx cypress run \
  --spec "cypress/e2e/**/*.cy.js" \
  --env TESTRAIL_RUN_ID=R24219 \
  --expose DEVICE_ID=voltserv-05dd
```

---

## 7. `--env` vs `--expose` — Getting It Right (Cypress 15)

Cypress 15 introduced a strict split between `--env` (Node-side / secrets) and `--expose` (browser + Node / public values). Mixing them up silently breaks TestRail reporting.

| Flag | Where it lands | Use for |
|---|---|---|
| `--env KEY=val` | `config.env` (Node-side) | `TESTRAIL_RUN_ID`, credentials, all TestRail flags |
| `--expose KEY=val` | `config.expose` (browser + Node) | `DEVICE_ID`, `grepTags`, other public values |

The reporter reads `config.env.TESTRAIL_RUN_ID`. If you pass it via `--expose`, it lands in `config.expose` and **the reporter will not activate** — with no error message.

```bash
# CORRECT:
npx cypress run \
  --env TESTRAIL_RUN_ID=R24219 \
  --expose DEVICE_ID=voltserv-896e

# WRONG — reporter will NOT activate:
npx cypress run \
  --expose TESTRAIL_RUN_ID=R24219,DEVICE_ID=voltserv-896e
```

**Rule of thumb:** TestRail values → always `--env`. Device/test-filtering values → always `--expose`.

---

## 8. Result Aggregation

When the same `C<id>` appears across multiple tests or spec files, results are automatically collapsed by the `ResultsAggregator`:

- **Fail trumps all** — first failure's comment and screenshot are reported.
- **Pass trumps skip** — if nothing failed, a pass wins over a skip.
- Aggregated comments are prefixed with `Summarization of {n} Cypress tests`.
- One result per case ID is sent to TestRail.

---

## 9. Screenshots

Attach failure screenshots to TestRail results by enabling `screenshots`:

```js
// cypress.config.js
env: {
  testrail: {
    screenshots: true,
  },
},
```

To attach **all** failed attempt screenshots (not just the last):

```js
env: {
  testrail: {
    screenshots: true,
    screenshotsAll: true,
  },
},
```

---

## 10. All Configuration Variables

Config is resolved from three sources in priority order:
1. `config.env[CLI_KEY]` — set via `--env` on the CLI (highest priority)
2. `process.env[CLI_KEY]` — OS environment variables
3. `config.env.testrail[jsonKey]` — the `testrail` object in `cypress.config.js`

| CLI key (`--env`) | JSON key (`testrail.…`) | Required | Description |
|---|---|---|---|
| `TESTRAIL_DOMAIN` | `domain` | Yes | TestRail hostname (no `https://`) |
| `TESTRAIL_USERNAME` | `username` | Yes | TestRail user email |
| `TESTRAIL_PASSWORD` | `password` | Yes | TestRail API key or password |
| `TESTRAIL_RUN_ID` | `runId` | Yes (Mode A) | Existing run to report into (prefix `R` stripped) |
| `TESTRAIL_RUN_IDS` | `runIds` | Alt. to `RUN_ID` | Comma-separated list of run IDs |
| `TESTRAIL_PROJECT_ID` | `projectId` | Yes (Mode B) | Project (prefix `P` stripped) |
| `TESTRAIL_MILESTONE_ID` | `milestoneId` | Optional | Milestone (prefix `M` stripped) |
| `TESTRAIL_SUITE_ID` | `suiteId` | Optional | Suite (prefix `S` stripped) |
| `TESTRAIL_RUN_NAME` | `runName` | Optional (Mode B) | Name template; `__datetime__` replaced at runtime |
| `TESTRAIL_RUN_CLOSE` | `closeRun` | Optional | Auto-close run after suite (default `false`) |
| `TESTRAIL_RUN_INCLUDE_ALL` | `runIncludeAll` | Optional | Include all suite cases when creating a run (default `false`) |
| `TESTRAIL_SCREENSHOTS` | `screenshots` | Optional | Upload last failure screenshot (default `false`) |
| `TESTRAIL_SCREENSHOTS_ALL` | `screenshotsAll` | Optional | Upload all failed screenshots, not just the last (default `false`) |
| `TESTRAIL_IGNORE_PENDING` | `ignorePending` | Optional | Skip pending tests — don't send to TestRail (default `true`) |
| `TESTRAIL_IGNORE_MISSING_CASE_IDS` | `ignoreMissingCaseIds` | Optional | Suppress errors when case IDs aren't in the run (default `false`) |

---

## 11. Advanced Features

### 11.1 Multiple Cypress Plugins

Cypress does not natively support multiple plugins subscribing to the same event — later registrations overwrite earlier ones. Use [`cypress-on-fix`](https://github.com/bahmutov/cypress-on-fix) to resolve this:

```bash
npm install cypress-on-fix --save-dev
```

```js
async setupNodeEvents(cypressOn, config) {
  const on = require('cypress-on-fix')(cypressOn);
  // register other plugins first...
  new TestRailReporter(on, config).register();
  return config;
}
```

### 11.2 Cucumber / Gherkin Support

The integration works with [cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor). Tag the **Scenario** title the same way as a plain `it()`:

```gherkin
Feature: Blog Page Features

Scenario: C12345: Filter blog posts by tags
  Given I am on the blog page
  When I click on tag "testing"
  Then I see tag "testing" as title of the page
```

Sample `setupNodeEvents` with Cucumber, TestRail, and `cypress-on-fix`:

```js
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const { defineConfig } = require('cypress');
const TestRailReporter = require('cypress-testrail');

module.exports = defineConfig({
  e2e: {
    specPattern: ['cypress/e2e/**/*.feature', 'cypress/e2e/**/*.js'],
    async setupNodeEvents(cypressOn, config) {
      const on = require('cypress-on-fix')(cypressOn);
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      new TestRailReporter(on, config).register();
      return config;
    },
  },
});
```

### 11.3 Created Run File

When using Mode B, the reporter writes `created_run.json` immediately after creating the run. You can read this file from other CI pipeline steps while Cypress is still running.

```json
{
  "id": 24300,
  "name": "Cypress Run 4/29/2026, 10:00:00 AM",
  "description": "Tested by Cypress\nCypress: 15.11.0\n…",
  "projectId": "1",
  "milestoneId": "",
  "suiteId": "2"
}
```

---

## 12. Architecture

The reporter runs **entirely in Node.js** inside `setupNodeEvents` — it is not browser-side code.

```
cypress.config.js
  └─ setupNodeEvents(on, config)
       └─ new TestRailReporter(on, config).register()
              │
              ├── on('before:run')   → log config; optionally create TestRail run
              ├── on('after:spec')   → parse C<id> tags → aggregate → POST to TestRail
              └── on('after:run')    → optionally close the run
```

| Class | Role |
|---|---|
| `Reporter` | Main orchestrator; registers Cypress node-event hooks |
| `ConfigService` / `ConfigValueExtractor` | Resolves config from CLI, process.env, and cypress.config.js |
| `TestCaseParser` | Extracts `C<id>` case IDs from test titles (before the `:`) |
| `ResultsAggregator` | Merges duplicate results: fail > pass > skip |
| `TestRail` / `ApiClient` | HTTP client for the TestRail API (via `axios`) |
| `CypressStatusConverter` | Maps Cypress states → TestRail status IDs (1=pass, 5=fail, 2=skip) |

---

## 13. Cypress Migration Notes

### 13.1 Cypress 10+: `plugins/index.js` → `setupNodeEvents`

Cypress 10 removed the classic `plugins/index.js` entrypoint. Register the reporter directly in `cypress.config.js` via `setupNodeEvents` (see [Section 3](#3-register-the-plugin)).

### 13.2 Cypress 15: `--env` / `--expose` split

Cypress 15 introduced a formal split between public config (`expose`) and secret/Node-only config (`env`):

| Concept | Cypress ≤14 | Cypress 15+ |
|---|---|---|
| Public config values | `env` + `Cypress.env()` | `expose` + `Cypress.expose()` |
| Sensitive / Node-only values | `env` + `Cypress.env()` | `env` + `cy.env()` (async) |
| Disable legacy sync API | n/a | `allowCypressEnv: false` |

**The TestRailReporter is unaffected** by `allowCypressEnv: false` because it runs in Node.js and reads `config.env` directly — it never calls the browser-side `Cypress.env()` API.

What to watch for:
- Always pass `TESTRAIL_RUN_ID` via `--env`, not `--expose` (see [Section 7](#7---env-vs---expose--getting-it-right-cypress-15)).
- Credentials in OS environment (`CYPRESS_TESTRAIL_USERNAME`, `CYPRESS_TESTRAIL_PASSWORD`) are read via `process.env` in Node — unaffected by any Cypress 15 changes.

See [TESTRAIL-INTEGRATION-README.md](TESTRAIL-INTEGRATION-README.md) for full details on the Cypress 15 migration.

---

## 14. License

Distributed under the MIT License. See [LICENSE.md](LICENSE.md).

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

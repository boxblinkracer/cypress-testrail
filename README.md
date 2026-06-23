<p align="center">
  <img width="200px" src="/assets/cypress.jpg" alt="Cypress logo">
</p>

<h1 align="center">Cypress TestRail Integration - VoltServer Fork</h1>

![NPM License](https://img.shields.io/npm/l/cypress-testrail)

This project automates sending Cypress results to TestRail. It is the VoltServer fork of cypress-testrail (v2.10.0), installed from github.com/VoltServer/cypress-testrail-greenwich.

It is designed to reduce manual validation work by reporting reliable case-level outcomes to TestRail while preserving useful failure evidence.

## What this fork adds

- ResultsAggregator: deduplicates repeated case results across tests/specs.
- TestCaseParser: extracts C<id> case tags from test titles.
- ignoreMissingCaseIds: can suppress missing-case errors for strict runs.
- Cypress 15 compatibility: documented env vs expose usage.

## Purpose and reporting model

In many suites, one TestRail case is covered by multiple Cypress tests. This integration aggregates those multiple outcomes into one TestRail result per case.

Aggregation rules:

- Any failure means final case result is fail.
- If there are no failures, pass beats skip.
- If all results are skip, final case result is skip.
- For failures, the first failure comment and screenshot are reported.
- Comments include a short summary of pass/fail/skip counts.

## Architecture

The reporter runs in Node.js inside setupNodeEvents, not in browser-side test code.

```text
cypress.config.js
  └─ setupNodeEvents(on, config)
       └─ new TestRailReporter(on, config).register()
              ├── before:run  -> create/validate run, log metadata
              ├── after:spec  -> parse IDs, aggregate, send results
              └── after:run   -> optionally close run
```

Key classes:

- Reporter: lifecycle orchestration and Cypress event registration.
- ConfigService / ConfigValueExtractor: resolves config values by priority.
- TestCaseParser: extracts C<id> IDs (before first colon in title).
- ResultsAggregator: fail > pass > skip conflict resolution.
- TestRail / ApiClient: TestRail HTTP API calls.
- CypressStatusConverter: Cypress state to TestRail status mapping.

## Installation

```bash
npm install github:VoltServer/cypress-testrail-greenwich --save-dev
```

Requires Node.js 13+.

## Credentials and base config

Keep credentials out of config files.

```bash
# shell profile or CI secret store
export CYPRESS_TESTRAIL_USERNAME="name@yourcompany.com"
export CYPRESS_TESTRAIL_PASSWORD="your-testrail-api-key"
```

Set non-secret defaults in cypress.config.js:

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

## Register the reporter

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

Optional custom comment:

```js
new TestRailReporter(on, config, 'AUT v' + process.env.APP_VERSION).register();
```

## Tagging tests

Put C<id> tags before the first colon in the test title.

```js
it('C12345: should do the thing', { tags: ['@testRail', '%C12345'] }, () => {
  // test
});

it('C12345 C67890: covers two cases', { tags: ['@testRail', '%C12345', '%C67890'] }, () => {
  // test
});
```

Only tests with case IDs are reported.

## Execution modes

Mode A: report to an existing run

- Provide TESTRAIL_RUN_ID (or TESTRAIL_RUN_IDS).
- Run must be open.

Mode B: create a new run per Cypress run

- Omit TESTRAIL_RUN_ID.
- Provide TESTRAIL_PROJECT_ID (optional milestone/suite IDs).
- Optional TESTRAIL_RUN_NAME supports __datetime__ token.
- Optional TESTRAIL_RUN_CLOSE closes run at suite end.

## Running with TestRail

```bash
# Recommended smoke subset first
npx cypress run \
  --spec "cypress/e2e/4-inline-comms/*.cy.js" \
  --env TESTRAIL_RUN_ID=R29785 \
  --expose DEVICE_ID=voltserv-05dd

# Single spec
npx cypress run \
  --spec "cypress/e2e/1-general/history_page.cy.js" \
  --env TESTRAIL_RUN_ID=R24219 \
  --expose DEVICE_ID=voltserv-896e

# Full suite
npx cypress run \
  --spec "cypress/e2e/**/*.cy.js" \
  --env TESTRAIL_RUN_ID=R24219 \
  --expose DEVICE_ID=voltserv-05dd
```

## Cypress 15: env vs expose

Use env for TestRail values. Use expose for public browser-visible values.

| Flag | Lands in | Use for |
|---|---|---|
| --env KEY=val | config.env | TESTRAIL_* values, secrets, Node-side controls |
| --expose KEY=val | config.expose | DEVICE_ID, grep tags, other public values |

Important: the reporter checks config.env.TESTRAIL_RUN_ID. Passing TESTRAIL_RUN_ID via --expose will not activate the reporter.

## Configuration lookup and keys

Lookup priority:

1. config.env[CLI_KEY] from --env
2. process.env[CLI_KEY]
3. config.env.testrail[jsonKey]

| CLI key (--env) | JSON key (testrail.*) | Required | Description |
|---|---|---|---|
| TESTRAIL_DOMAIN | domain | Yes | TestRail hostname, no protocol |
| TESTRAIL_USERNAME | username | Yes | TestRail user email |
| TESTRAIL_PASSWORD | password | Yes | TestRail API key or password |
| TESTRAIL_RUN_ID | runId | Yes (Mode A) | Existing run id |
| TESTRAIL_RUN_IDS | runIds | Alternative | Comma-separated run ids |
| TESTRAIL_PROJECT_ID | projectId | Yes (Mode B) | Project id |
| TESTRAIL_MILESTONE_ID | milestoneId | Optional | Milestone id |
| TESTRAIL_SUITE_ID | suiteId | Optional | Suite id |
| TESTRAIL_RUN_NAME | runName | Optional | New run name template |
| TESTRAIL_RUN_CLOSE | closeRun | Optional | Auto-close run |
| TESTRAIL_RUN_INCLUDE_ALL | runIncludeAll | Optional | Include all suite cases on create |
| TESTRAIL_SCREENSHOTS | screenshots | Optional | Upload failure screenshot |
| TESTRAIL_SCREENSHOTS_ALL | screenshotsAll | Optional | Upload all failure screenshots |
| TESTRAIL_IGNORE_PENDING | ignorePending | Optional | Do not send pending tests |
| TESTRAIL_IGNORE_MISSING_CASE_IDS | ignoreMissingCaseIds | Optional | Ignore missing case ids in run |

## Screenshots

```js
env: {
  testrail: {
    screenshots: true,
    screenshotsAll: true,
  },
},
```

## Advanced integration

Multiple plugins on shared Cypress events:

```bash
npm install cypress-on-fix --save-dev
```

```js
async setupNodeEvents(cypressOn, config) {
  const on = require('cypress-on-fix')(cypressOn);
  // register additional plugins first
  new TestRailReporter(on, config).register();
  return config;
}
```

Cucumber/Gherkin support works by tagging Scenario titles with case IDs the same way.

```gherkin
Feature: Blog Page Features

Scenario: C12345: Filter blog posts by tags
  Given I am on the blog page
  When I click on tag "testing"
  Then I see tag "testing" as title of the page
```

## Created run metadata file

In run-creation mode, created_run.json is written as soon as the run is created so downstream CI steps can consume it.

```json
{
  "id": 24300,
  "name": "Cypress Run 4/29/2026, 10:00:00 AM",
  "projectId": "1",
  "milestoneId": "",
  "suiteId": "2"
}
```

## Quick references

- Day-to-day usage: CY-TO-TR-USAGE-GUIDE.md
- Historical deep-dive details: TESTRAIL-INTEGRATION-README.md
- Legacy design note: cypress-testrail-greenwich-design.md

## License

Distributed under the MIT License. See LICENSE.md.

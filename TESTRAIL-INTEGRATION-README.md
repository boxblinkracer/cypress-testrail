TESTRAIL-INTEGRATION-README.md
# TestRail Integration — How It Works

## Overview

This project uses a **VoltServer fork** of [cypress-testrail](https://www.npmjs.com/package/cypress-testrail) (v2.10.0), installed from
[github.com/VoltServer/cypress-testrail-greenwich](https://github.com/VoltServer/cypress-testrail-greenwich).
The fork adds a **ResultsAggregator** that deduplicates test-case results across spec files (fail trumps pass, pass
trumps skip) and a **TestCaseParser** that extracts `C<id>` tags from Cypress test titles.

The integration runs **in Node.js** inside Cypress's `setupNodeEvents` hook — it is not browser-side code.

---

## Architecture

```
cypress.config.js
  └─ setupNodeEvents(on, config)
       └─ new TestRailReporter(on, config).register()
              │
              ├── on('before:run')   → create/validate TestRail run
              ├── on('after:spec')   → parse results → aggregate → POST to TestRail
              └── on('after:run')    → optionally close the run
```

### Key Classes

| Class | Role |
|---|---|
| `Reporter` | Main orchestrator; registers Cypress node-event hooks |
| `ConfigService` / `ConfigValueExtractor` | Reads config from three sources (see below) |
| `TestCaseParser` | Extracts `C<id>` case IDs from Cypress test titles (before the `:`) |
| `ResultsAggregator` | Merges duplicate case results: fail > pass > skip |
| `TestRail` / `ApiClient` | HTTP client that talks to the TestRail API via `axios` |
| `CypressStatusConverter` | Maps Cypress states → TestRail status IDs (1=pass, 5=fail, 2=skip) |

---

## Configuration

### Configuration Lookup Order

`ConfigValueExtractor._getValue(keyCLI, keyJSON)` resolves each setting by checking **three sources**
in priority order:

| Priority | Source | Example |
|---|---|---|
| 1 (highest) | `config.env[keyCLI]` — flat keys set via Cypress `--env` CLI flag | `--env TESTRAIL_RUN_ID=R12345` |
| 2 | `process.env[keyCLI]` — OS environment variables (`CYPRESS_` prefix stripped by Cypress for `config.env`, but raw vars remain in `process.env`) | `export CYPRESS_TESTRAIL_USERNAME=…` |
| 3 (lowest) | `config.env.testrail[keyJSON]` — the `testrail` object inside `env` in `cypress.config.js` | `env: { testrail: { domain: '…' } }` |

### All Configuration Keys

| CLI key (`--env`) | JSON key (`testrail.…`) | Description | Required? |
|---|---|---|---|
| `TESTRAIL_DOMAIN` | `domain` | TestRail instance hostname (no `https://`) | Yes |
| `TESTRAIL_USERNAME` | `username` | TestRail user email | Yes |
| `TESTRAIL_PASSWORD` | `password` | TestRail API key or password | Yes |
| `TESTRAIL_PROJECT_ID` | `projectId` | TestRail project (prefix `P` stripped) | Only for "create run" mode |
| `TESTRAIL_MILESTONE_ID` | `milestoneId` | Milestone (prefix `M` stripped) | Optional |
| `TESTRAIL_SUITE_ID` | `suiteId` | Suite (prefix `S` stripped) | Optional |
| `TESTRAIL_RUN_ID` | `runId` | Existing run to report into (prefix `R` stripped) | Mutually exclusive with create mode |
| `TESTRAIL_RUN_IDS` | `runIds` | Comma-separated list of runs | Alternative to single `RUN_ID` |
| `TESTRAIL_RUN_NAME` | `runName` | Name for a newly created run. `__datetime__` is replaced at runtime. | Optional |
| `TESTRAIL_RUN_CLOSE` | `closeRun` | Auto-close the run after the suite finishes | Optional (default `false`) |
| `TESTRAIL_RUN_INCLUDE_ALL` | `runIncludeAll` | Include all suite cases when creating a run | Optional (default `false`) |
| `TESTRAIL_SCREENSHOTS` | `screenshots` | Upload failure screenshots to TestRail | Optional (default `false`) |
| `TESTRAIL_SCREENSHOTS_ALL` | `screenshotsAll` | Upload all failed attempt screenshots, not just the last | Optional (default `false`) |
| `TESTRAIL_IGNORE_PENDING` | `ignorePending` | Skip pending tests (don't send to TestRail) | Optional (default `true`) |
| `TESTRAIL_IGNORE_MISSING_CASE_IDS` | `ignoreMissingCaseIds` | Ignore errors when case IDs aren't found in the run | Optional (default `false`) |

### Current Project Configuration

In `cypress.config.js`, the static defaults are:

```js
env: {
  testrail: {
    domain: 'voltserver.testrail.com',
    screenshots: true,
    ignorePending: true,
    ignoreMissingCaseIds: true,
  },
},
```

Credentials are **not** in the config file. They come from OS environment variables (priority 2):

```bash
# In ~/.zprofile or CI environment:
export CYPRESS_TESTRAIL_USERNAME="name@voltserver.com"
export CYPRESS_TESTRAIL_PASSWORD="your-testrail-api-key"
```

The integration is **conditionally enabled** — it only runs when `TESTRAIL_RUN_ID` is provided:

```js
// cypress.config.js — setupNodeEvents
if (config.env.TESTRAIL_RUN_ID) {
  new TestRailReporter(on, config).register();
}
```

---

## How To Use

### Tagging Tests

Tag test titles with `C<id>` **before the colon**. The parser looks for `C` prefixed IDs in the portion of the title before the first `:`:

```js
it('C12345: should do the thing', { tags: ['@testRail', '%C12345'] }, () => { … });
it('C12345 C67890: covers two cases', { tags: ['@testRail', '%C12345', '%C67890'] }, () => { … });
```

The `{ tags: ['@testRail', '%C<id>'] }` metadata enables filtering with `@cypress/grep` and future TestRail tooling.

### Running with TestRail Reporting

```bash
# Report results to an existing TestRail run:
npx cypress run \
  --spec "cypress/e2e/1-general/history_page.cy.js" \
  --env TESTRAIL_RUN_ID=R24219

# Credentials must be in env (see above), or pass them explicitly:
npx cypress run \
  --spec "cypress/e2e/**/*.cy.js" \
  --expose DEVICE_ID=voltserv-05dd
  --env TESTRAIL_RUN_ID=R24219,TESTRAIL_USERNAME=me@co.com,TESTRAIL_PASSWORD=token123

 # Best to try running a smoke test first try a small subsection
 npx cypress run \
  --spec "cypress/e2e/4-inline-comms/*.cy.js" \
  --env TESTRAIL_RUN_ID=R29785 \
  --expose DEVICE_ID=voltserv-05dd
```

### Result Aggregation

When the same `C<id>` appears in multiple tests or spec files, the `ResultsAggregator` collapses them:

- **Fail trumps all** — if any test for a case fails, the case is reported as failed (first failure's comment and screenshot are used).
- **Pass trumps skip** — if no failures, a pass wins over a skip.
- Aggregated comments are prefixed with `Summarization of {n} Cypress tests`.

### Created Run File

When running in "create run" mode (no `TESTRAIL_RUN_ID` provided, but project/milestone/suite IDs are), the reporter writes a `created_run.json` file containing the new run's metadata:

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

## Cypress 15 Migration Considerations

Cypress 15 introduced a split between **`expose`** (public config) and **`env`** (secrets), and deprecated the synchronous `Cypress.env()` API in favor of `Cypress.expose()` (public) and `cy.env()` (sensitive, async).

### What Changed in Cypress 15

| Concept | Old (Cypress ≤14) | New (Cypress 15+) |
|---|---|---|
| Public config values | `env` + `Cypress.env()` | `expose` + `Cypress.expose()` |
| Sensitive values | `env` + `Cypress.env()` | `env` + `cy.env()` (async command) |
| Browser-side sync access | `Cypress.env('KEY')` | `Cypress.expose('KEY')` (public only) |
| Disable legacy API | n/a | `allowCypressEnv: false` |
| CLI flags | `--env KEY=val` | `--expose KEY=val` (public), `--env KEY=val` (secrets) |

### Current Project Status

This project has **already partially migrated**:

- `allowCypressEnv: false` is set — the deprecated `Cypress.env()` is disabled.
- Public values (login creds, grep tags, DEVICE_ID, etc.) are under `expose:`.
- Sensitive values (MAILOSAUR_API_KEY, SSH password) remain under `env:`.
- Browser-side code uses `Cypress.expose()` (e.g., `auth.js`, `commands.js`, `e2e.js`).

### TestRailReporter: Why It Still Works (and Potential Issues)

The TestRailReporter runs **entirely in Node.js** inside `setupNodeEvents`. It reads from `config.env`, which is the Node-side config object — **not** the browser-side `Cypress.env()` API. Therefore:

1. **`config.env.testrail.*`** — Static defaults in `cypress.config.js` → Still works. The `env.testrail` object is available in `setupNodeEvents` regardless of `allowCypressEnv`.

2. **`config.env.TESTRAIL_RUN_ID`** — Passed via `--env TESTRAIL_RUN_ID=R12345` on the CLI → Still works. The `--env` CLI flag still populates `config.env` in the Node context.

3. **`process.env.CYPRESS_TESTRAIL_USERNAME` / `…_PASSWORD`** — OS environment variables → Still works. These are read via `process.env` directly and bypass Cypress config entirely.

### Potential Breakage Scenario

The integration **could break** if:

- Cypress further restricts `--env` in a future release, preventing CLI values from reaching `config.env` in `setupNodeEvents`.
- Someone moves `TESTRAIL_RUN_ID` to `--expose` instead of `--env` — it would appear in `config.expose`, not `config.env`, and the guard `if (config.env.TESTRAIL_RUN_ID)` would be falsy.

### Recommendations

#### 1. Keep TestRail credentials in `env` (no change needed)

`TESTRAIL_USERNAME` and `TESTRAIL_PASSWORD` are **sensitive** values. Cypress 15's guidance is explicit: use `env` and `cy.env()` for secrets. Since the reporter reads these via `process.env` in Node.js, this is fine and correct.

#### 2. Keep `TESTRAIL_RUN_ID` in `env` (no change needed)

Even though `TESTRAIL_RUN_ID` is not a secret, it is consumed **only in Node.js context** inside `setupNodeEvents`. The `--env` CLI flag still populates `config.env` in the Node context. There is no benefit to moving it to `expose` since it is never accessed in the browser.

#### 3. Keep `testrail` config block in `env` (no change needed)

The `env.testrail` object in `cypress.config.js` is read by `ConfigValueExtractor` at priority 3. Since the reporter is Node-only, this works correctly.

#### 4. Consider a defensive guard for future-proofing

If you want to be resilient to someone accidentally passing `--expose TESTRAIL_RUN_ID=…` instead of `--env`:

```js
// cypress.config.js — setupNodeEvents
const testrailRunId = config.env.TESTRAIL_RUN_ID || config.expose.TESTRAIL_RUN_ID;
if (testrailRunId) {
  // Ensure the run ID is in config.env where the reporter expects it
  config.env.TESTRAIL_RUN_ID = testrailRunId;
  new TestRailReporter(on, config).register();
}
```

#### 5. Document the CLI invocation

Ensure CI pipelines and developer docs use `--env` (not `--expose`) for TestRail variables:

```bash
# Correct — uses --env for Node-only/sensitive values:
npx cypress run --env TESTRAIL_RUN_ID=R24219 --expose DEVICE_ID=voltserv-896e

# Wrong — reporter won't see TESTRAIL_RUN_ID in config.env:
npx cypress run --expose TESTRAIL_RUN_ID=R24219,DEVICE_ID=voltserv-896e
```

### Summary: What Belongs Where

| Value | Scope | Location | CLI Flag |
|---|---|---|---|
| `TESTRAIL_RUN_ID` | Node-only | `env` | `--env` |
| `TESTRAIL_USERNAME` | Node-only (process.env) | OS env var | `export CYPRESS_TESTRAIL_USERNAME=…` |
| `TESTRAIL_PASSWORD` | Node-only (process.env) | OS env var | `export CYPRESS_TESTRAIL_PASSWORD=…` |
| `testrail.domain` etc. | Node-only | `env.testrail` in config | Static in `cypress.config.js` |
| `DEVICE_ID` | Browser + Node | `expose` | `--expose` |
| `login_user` / `login_password` | Browser | `expose` | `--expose` or static |
| `MAILOSAUR_API_KEY` | Browser (sensitive) | `env` | Static or `--env` |

---

## Lifecycle Summary

1. **`before:run`** — Logs integration info (Cypress version, browser, base URL, TestRail domain). If in "create run" mode, creates a new TestRail run and writes `created_run.json`.
2. **`after:spec`** — For each completed spec file:
   - Parses `C<id>` tags from test titles via `TestCaseParser`.
   - If in "create run" mode without `includeAll`, updates the run with discovered case IDs.
   - Builds result objects (status, comment, duration, screenshot paths).
   - Aggregates duplicates via `ResultsAggregator`.
   - Sends batch results to TestRail API for each configured run ID.
3. **`after:run`** — If in "create run" mode and `closeRun` is true, closes the TestRail run(s).

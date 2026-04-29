# Cypress to TestRail Quick Usage Guide

## Prerequisites

1. **Set your TestRail credentials** in `~/.zprofile` (or your CI environment):

   ```bash
   export CYPRESS_TESTRAIL_USERNAME="name@voltserver.com"
   export CYPRESS_TESTRAIL_PASSWORD="your-testrail-api-key"
   ```

   These are read via `process.env` in Node.js and never need to appear on the command line.

2. **Tag your tests** with `C<id>` before the colon in the test title:

   ```js
   it('C12345: should do the thing', { tags: ['@testRail', '%C12345'] }, () => { … });
   it('C12345 C67890: covers two cases', { tags: ['@testRail', '%C12345', '%C67890'] }, () => { … });
   ```

   Only tests with `C<id>` tags will be reported to TestRail.

---

## Running Tests with TestRail Reporting

Pass `TESTRAIL_RUN_ID` via `--env` and `DEVICE_ID` via `--expose`:

```bash
# Small smoke test first:
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

The static TestRail config (`domain`, `screenshots`, etc.) is already set in `cypress.config.js` under `env.testrail` — no need to touch it.

---

## `--env` vs `--expose` — Getting It Right

Since Cypress 15, there are **two** CLI flags for passing values, and mixing them up will silently break TestRail reporting.

| Flag | Where it lands | Use for |
|---|---|---|
| `--env KEY=val` | `config.env` (Node-side) | `TESTRAIL_RUN_ID`, other secrets/Node-only values |
| `--expose KEY=val` | `config.expose` (browser + Node) | `DEVICE_ID`, `grepTags`, other public values |

The TestRail reporter reads `config.env.TESTRAIL_RUN_ID` to decide whether to activate. If you accidentally pass it via `--expose`, it won't be found and **no results will be sent to TestRail** — without any error message.

### Correct

```bash
npx cypress run \
  --env TESTRAIL_RUN_ID=R24219 \
  --expose DEVICE_ID=voltserv-896e
```

### Wrong — reporter will NOT activate

```bash
# TESTRAIL_RUN_ID lands in config.expose, not config.env:
npx cypress run \
  --expose TESTRAIL_RUN_ID=R24219,DEVICE_ID=voltserv-896e
```

### Rule of thumb

- **TestRail values** → always `--env`
- **Device/test-filtering values** → always `--expose`

---

## Result Aggregation

When the same `C<id>` appears across multiple tests or spec files, results are automatically collapsed:

- **Fail trumps all** — first failure's comment and screenshot are reported.
- **Pass trumps skip** — if nothing failed, a pass wins over a skip.
- One result per case ID is sent to TestRail.

---

## How It Works (in brief)

The reporter is enabled conditionally in `cypress.config.js` `setupNodeEvents`:

```js
if (config.env.TESTRAIL_RUN_ID) {
  new TestRailReporter(on, config).register();
}
```

It registers three Cypress node-event hooks:

1. **`before:run`** — Logs config info; optionally creates a new TestRail run.
2. **`after:spec`** — Parses `C<id>` tags from test titles, aggregates results, POSTs to TestRail.
3. **`after:run`** — Optionally closes the run.

For full architectural details see [TESTRAIL-INTEGRATION-README.md](TESTRAIL-INTEGRATION-README.md).

---

## References

- VoltServer fork: https://github.com/VoltServer/cypress-testrail-greenwich
- Original package: https://www.npmjs.com/package/cypress-testrail

<p align="center">
   <img width="200px" src="/assets/cypress.jpg">
</p>
<h1 align="center">(Super Easy) Cypress TestRail Integration</h1>


![Build Status](https://github.com/boxblinkracer/cypress-testrail/actions/workflows/ci_pipe.yml/badge.svg) ![NPM Downloads](https://badgen.net/npm/dt/cypress-testrail) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/boxblinkracer/cypress-testrail) ![NPM License](https://img.shields.io/npm/l/cypress-testrail)

This integration helps you to automatically send test results to TestRail. And yes, super easy and simple!

Add your TestRail credentials in Cypress, decide which test results should be sent to TestRail and you're done!

This is a `TestRail-driven` workflow, so your QA team will always be in charge of the TestRail documentation and Cypress will only work as a testing client and does **not modify** anything in your test cases.

Define new test cases in TestRail, and add automation to it, when you are ready.

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
    "password": "myPwd",
    "runId": "12345"
  }
}
```

### 3. Register Plugin

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

### 4. Map Test Cases

We're almost done.
You can now map TestRail test cases to your Cypress tests.
Please use the TestRail case ID as a prefix inside the Cypress test title.
The plugin will automatically extract it, and send the results to your test run in TestRail.
The case ID needs to be at the beginning and separated with an `:` from the rest of the title.

```javascript 
it('C123: My Test for TestRail XYZ', () => {

    cy.get('#sw-field--name').type('John');
    // ...
    // ...
    
})
```

## That's it!

You can now start Cypress (restart after config changes), and all your results should be sent to TestRail as soon as your mapped tests pass or fail!

### Copying / License

This repository is distributed under the MIT License (MIT). You can find the whole license text in the [LICENSE](LICENSE) file.

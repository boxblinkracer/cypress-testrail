# UPGRADE

## vX -> ....

### See changelog

First have a look at the changes in the CHANGELOG.md

### New way to register plugin

There is a new way to register the plugin.

Before it was just this file in the `support/index.js` file

```javascript
import 'cypress-testrail';
```

The new way requires the plugin to be registered in the `plugins/index.js` file.
This is required, because we need new events to read data about browsers and specs, and that is only available in that scope.

```javascript
const TestRailReporter = require('cypress-testrail');

module.exports = (on, config) => {

    // create a new reporter with our variables
    // and just use the register() function.
    new TestRailReporter(on, config).register();

    return config
}
```

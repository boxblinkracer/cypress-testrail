# UPGRADE

## 1. CHANGELOGS

First, please always (and also) look at the CHANGELOG.md.
It will tell you more about the changes made.

## Upgrade v1.x => v2.x

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
    new TestRailReporter(on, config).register();
    return config
}
```

That's it, it should all work again!
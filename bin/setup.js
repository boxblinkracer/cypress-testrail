#!/usr/bin/env node

const packageData = require('../package.json');
const setupWizard = require('../src/components/Setup/SetupWizard');
const cliHandleUnhandled = require('cli-handle-unhandled');


(async () => {

    cliHandleUnhandled();

    console.log('');
    console.log('');
    console.log('Cypress TestRail Integration');
    console.log('*************************************************');
    console.log('Version ' + packageData.version);
    console.log('');

    console.log('This tool will build a new configuration JSON template that matches your required workflow with TestRail.');
    console.log();

    await setupWizard();

})();

#!/usr/bin/env node

const package = require('../package.json');
const configWizard = require('../src/components/Setup/ConfigWizard');
const cliHandleUnhandled = require('cli-handle-unhandled');


(async () => {

    cliHandleUnhandled();

    console.log('');
    console.log('');
    console.log('Cypress TestRail Integration');
    console.log('*************************************************');
    console.log('Version ' + package.version);
    console.log('');

    console.log('This tool will scaffold a new configuration JSON template that matches your required workflow with TestRail.');
    console.log();

    await configWizard();

})();

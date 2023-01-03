const { Input } = require('enquirer');
const path = require('path');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');
const fs = require('fs');
const chalk = require('chalk');

module.exports = async ({ message, hint, initial }) => {
    const [err, response] = await to(
        new Input({
            message,
            hint,
            initial,
            validate(value, state) {
                if (state && (state.name === 'Action name' || state.name === 'Select docker image' || state.name === 'Select Docker image tag')) {
                    if (value.trim() === '') {
                        return chalk.yellow.bold.inverse(' Error ') + ' this field cannot be empty.';
                    }
                }
                if (state && state.name === 'Action name') {
                    const actionDir = path.join(process.cwd(), '.buddy', 'actions', value);

                    if (fs.existsSync(actionDir)) {
                        return chalk.yellow.bold.inverse(' Error ') + ' this action already exists.';
                    }
                }

                return true;
            },
        })
            .on('cancel', () => {
                /* eslint-disable no-console */
                console.log(chalk.yellow.bold.inverse(' Canceled ') + ' action creation was canceled.');
                process.exit(0);
            })
            .run()
    );

    handleError('Input', err);

    return response;
};

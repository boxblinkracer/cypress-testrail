const { Toggle } = require('enquirer');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');

module.exports = async ({ message }) => {
    const [err, response] = await to(
        new Toggle({
            message,
            enabled: 'Yes',
            disabled: 'No',
        }).run()
    );

    handleError('Prompt', err);

    return response;
};

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    'rootDir': './',
    'verbose': true,
    'moduleFileExtensions': [
        'js'
    ],
    "transform": {
        ".*.js": "<rootDir>/node_modules/babel-jest"
    },
    "testMatch": [
        "<rootDir>/tests/Jest/**/*.spec.js"
    ]
};

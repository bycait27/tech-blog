module.exports = {
    testEnvironment: 'node',
    verbose: true,
    detectOpenHandles: true,
    collectCoverage: false,
    coverageDirectory: 'coverage',
    testMatch: ['**/tests/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
};
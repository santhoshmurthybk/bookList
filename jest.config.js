/* istanbul ignore file */

module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: ['<rootDir>/*.js'],
    coverageThreshold: {
        global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
        }
  }
};
module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/test'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: ['./src/**/*.ts'],
  coveragePathIgnorePatterns: ['index.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js'],
  setupFiles: ['./jest.setup.js']
};

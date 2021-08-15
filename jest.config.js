module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testEnvironment: 'node',
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js']
};

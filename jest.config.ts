export { };
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // use 'node' for backend-only projects
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // setupFiles: ['./jest.setup.ts'], // Path to your setup file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

};

import type { Config } from 'jest';

export default {
  testEnvironment: 'node',
  transform: {
    // eslint-disable-next-line no-useless-escape
    '^.+\.tsx?$': ['ts-jest', {}],
  },
  coverageDirectory: 'coverages',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
  clearMocks: true,
  cache: true,
  preset: 'ts-jest',
  passWithNoTests: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
} as Config;

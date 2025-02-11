import { readFileSync } from 'fs';

const swcJestConfig = JSON.parse(
  readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8')
);

swcJestConfig.swcrc = false;

export default {
  displayName: '@earthquake-tracker/shared-types',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'test-output/jest/coverage',
};

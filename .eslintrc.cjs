// @ts-check

const OFF = 'off';
const ERROR = 'error';
const WARN = 'warn';

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: ['import'],
  extends: [
    'plugin:node/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:import/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': WARN,
    'no-debugger': WARN,
    'max-len': [
      ERROR,
      120,
      4,
      {
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    curly: ERROR,
    'no-implicit-coercion': ERROR,
    'no-else-return': ERROR,
    'no-duplicate-imports': [ERROR, { includeExports: true }],
    'import/first': ERROR,
    'import/no-mutable-exports': ERROR,
    'import/no-self-import': ERROR,
    'import/no-named-default': ERROR,
    'import/no-relative-packages': ERROR,
    'import/no-unresolved': OFF,
    'import/order': [
      ERROR,
      {
        'newlines-between': 'always',
        pathGroups: [
          { pattern: '@nestjs/**', group: 'builtin', position: 'after' },
        ],
        groups: [
          ['builtin', 'external'],
          'internal',
          'parent',
          'sibling',
          'type',
          'index',
          'object',
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
      },
    ],
    'import/no-cycle': OFF,
    'node/no-unsupported-features/es-syntax': OFF,
    'node/no-missing-import': OFF,
    'node/no-unpublished-import': OFF,
    'node/no-extraneous-import': OFF,
    'sonarjs/no-duplicate-string': OFF,
    'unicorn/prefer-ternary': OFF,
    'unicorn/prefer-top-level-await': OFF,
    'unicorn/no-array-reduce': OFF,
    'unicorn/no-null': OFF,
    'unicorn/no-useless-undefined': [ERROR, { checkArguments: false }],
    'unicorn/prevent-abbreviations': [
      ERROR,
      {
        ignore: ['e2e'],
      },
    ],
  },
  overrides: [
    {
      files: ['*rc.js', '*.config.js'],
      rules: {
        'unicorn/prefer-module': OFF,
      },
    },
  ],
};

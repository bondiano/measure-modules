#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { measure } from '../src/measure.js';

yargs(hideBin(process.argv))
  .scriptName('measure-modules')
  .command(
    '$0 <root>',
    'Measure module dependencies',
    (y) =>
      y.options({
        requireConfig: {
          type: 'string',
          default: null,
          description: 'RequireJS config for resolving aliased modules',
        },
        webpackConfig: {
          type: 'string',
          default: null,
          description: 'Webpack config for resolving aliased modules',
        },
        tsConfig: {
          type: 'string',
          default: null,
          description:
            'TypeScript config for resolving aliased modules - Either a path to a tsconfig file or an object containing the config',
        },
        verbose: {
          type: 'boolean',
          default: false,
          description: 'Print verbose output',
        },
      }),
    (argv) => measure(argv.root, argv),
  )
  .help().argv;

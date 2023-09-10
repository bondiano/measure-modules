// @ts-check

import dependencyTree from 'dependency-tree';
import path from 'node:path';

/**
 * Takes object of objects and returns object of keys and nested keys arrays
 */
const flatten = (tree, result = {}) => {
  for (const key in tree) {
    if (result[key]) {
      continue;
    }

    result[key] = [];

    for (const nestedKey in tree[key]) {
      result[key].push(nestedKey);
      flatten(tree[key], result);
    }
  }

  return result;
};

export const measure = async (root, options) => {
  const { requireConfig, webpackConfig, tsConfig } = options;
  const filename = path.resolve(process.cwd(), root);
  const directory = path.dirname(filename);

  const tree = dependencyTree({
    filename,
    directory,
    requireConfig,
    webpackConfig,
    tsConfig,
    filter(path) {
      return !path.includes('node_module');
    },
  });

  /**
   * Score algorithm:
   * 1. Check all dependencies
   * 2. Count distance from current module
   * 3. Every level of distance is 1 point
   * 4. Sum all points
   *
   * Example:
   * `./src/foo/bar/baz.js` depends on `./src/foo/test.js` and `./src/something/also.js`
   * And it scores 3 points.
   */

  const flattenTree = flatten(tree);

  const scoreByPath = Object.keys(flattenTree).reduce((accumulator, key) => {
    const dependencies = flattenTree[key];
    const folder = path.dirname(key);

    const points = dependencies.reduce((accumulator_, dependency) => {
      const relativePath = path.relative(folder, dependency);
      const levels = relativePath.split(path.sep).length;

      return accumulator_ + levels;
    }, 0);

    accumulator[key] = points;
    return accumulator;
  }, {});

  const score = Object.values(scoreByPath).reduce((accumulator, points) => {
    return accumulator + points;
  }, 0);

  console.log('Total score:', score);
};

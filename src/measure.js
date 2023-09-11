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

const sumDependencies = (tree, scores) => {
  let sum = 0;

  for (const key in tree) {
    if (Object.values(tree[key]).length === 0) {
      return scores[key] || 0;
    }

    sum += scores[key] + sumDependencies(tree[key], scores);
  }

  return sum;
};

export const measure = async (root, options) => {
  const { requireConfig, webpackConfig, tsConfig, verbose } = options;
  const filename = path.resolve(process.cwd(), root);
  const directory = path.dirname(filename);

  const tree = dependencyTree({
    filename,
    directory,
    requireConfig,
    webpackConfig,
    tsConfig,
    filter(path) {
      return !path.includes('node_module') && path.startsWith(process.cwd());
    },
  });

  /**
   * Score algorithm:
   * 1. Check all dependencies
   * 2. Count distance from current module
   * 3. Every level of distance is 1 point
   * 4. Add points for every dependency
   * 5. Sum all points
   *
   * Example:
   * `./src/foo/bar/baz.js` depends on `./src/foo/test.js` and `./src/something/also.js`
   * And it scores 6 points.
   *
   * And it scores 6 points:
   * ../../something/also.js 4
   * ../test.js 2
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

  if (verbose) {
    console.log(
      'Score by path:',
      Object.entries(scoreByPath).sort(
        ([_, scoreA], [__, scoreB]) => scoreB - scoreA,
      ),
    );

    console.log('Sum dependencies:', sumDependencies(tree, scoreByPath));
  }

  const score = Object.values(scoreByPath).reduce((accumulator, points) => {
    return accumulator + points;
  }, 0);

  console.log('Total score:', score);
};

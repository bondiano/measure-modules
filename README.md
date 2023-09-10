# Measure modules

Simple tool to measure module cohesion size based on the imports path.

## Score algorithm

1. Check all dependencies
2. Count distance from current module
3. Every level of distance adds 1 point
4. Sum all points

## Example

```
`./src/foo/bar/baz.js` depends on `./src/foo/test.js` and `./src/something/also.js`
And it scores 6 points:
../../something/also.js 4
../test.js 2
```

## Usage

```
$ npx measure-modules ./bin/measure-modules.js
Total score: 3
```

### Options:

```
  --requireConfig  RequireJS config for resolving aliased modules
  --webpackConfig  Webpack config for resolving aliased modules
  --tsConfig       TypeScript config for resolving aliased modules - Either a path to a tsconfig file or an object containing the config
```
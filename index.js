#!/usr/bin/env node

console.log('Creating tsconfig path mappings from jspm..');

const fs = require('fs');
const path = require('path');
const Builder = require('jspm').Builder;

const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
const pathMapPath = path.join(process.cwd(), 'pathmap.json');
const tsConfig = require(tsConfigPath);

if (!fs.existsSync(pathMapPath)) {
  fs.writeFileSync(pathMapPath, JSON.stringify({
    packages: []
  }, null, '\t'));
}

const pathMap = require(pathMapPath);

const builder = new Builder();

const paths = {};
const merged = {};

try {
  mapPaths();
  mergePaths();
  writePaths();
  console.log('tsconfig.json has been updated.');
  process.exit(0);
}
catch(reason) {
  console.error(reason.message
    ? reason.message
    : reason);
  process.exit(1);
}

function mapPaths() {
  for (let map in builder.loader.map) {
    const normalized = builder.loader.normalizeSync(map);
    const relative = normalized.replace(builder.loader.baseURL, '');
    paths[map] = [relative]
    paths[`${map}/*`] = [`${relative}/*`, `${relative}/*/index`];
  }
}

function mergePaths() {
  const deleted = [];

  for (let path of pathMap.packages) {
    if (!builder.loader.map.hasOwnProperty(path)) {
      deleted.push(path);
      deleted.push(`${path}/*`);
    }
  }

  if (!tsConfig.compilerOptions) {
    tsConfig.compilerOptions = {};
  }

  if (!tsConfig.compilerOptions.paths) {
    tsConfig.compilerOptions.paths = {};
  }
  if (!tsConfig.compilerOptions.baseUrl) {
    tsConfig.compilerOptions.baseUrl = '.';
  }

  for (let path in tsConfig.compilerOptions.paths) {
    if (deleted.indexOf(path) === -1) {
      merged[path] = tsConfig.compilerOptions.paths[path];
    }
  }

  for (let path in paths) {
    merged[path] = paths[path];
  }
}

function writePaths() {
  tsConfig.compilerOptions.paths = merged;
  pathMap.packages = Object.keys(builder.loader.map).map(key => key);
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, '\t'));
  fs.writeFileSync(pathMapPath, JSON.stringify(pathMap, null, '\t'))
}

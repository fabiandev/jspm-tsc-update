#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const updateTsConfig = require('./index');
const e = updateTsConfig(argv);
process.exit(e ? 0 : 1);

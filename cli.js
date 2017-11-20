#!/usr/bin/env node
var updateTsConfig = require('./index');
var e = updateTsConfig();
process.exit(e ? 0 : 1);

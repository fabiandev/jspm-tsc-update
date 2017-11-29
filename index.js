const fs = require('fs');
const path = require('path');

module.exports = function(options) {
  const log = function log(text, method) {
    if (opts.silent) {
      return;
    }
    method = !method ? 'log' : method;
    console[method](`jspm-tsc-update: ${text}`);
  };

  const defaults = require('./defaults');
  const opts = Object.assign({}, defaults, options);

  if (!fs.existsSync(opts.packagePath)) {
    log(`Package path ${opts.packagePath} does not exist`, 'error');
    return false;
  }

  opts.packagePath = path.resolve(opts.packagePath);
  log(`Using directory ${opts.packagePath}`)

  if (!fs.existsSync(path.join(opts.packagePath, 'package.json'))) {
    log(`package.json does not exist in ${opts.packagePath}`, 'error');
    return false;
  }

  const jspm = opts.jspm;
  jspm.setPackagePath(opts.packagePath);

  const tsConfigPath = path.join(opts.packagePath, opts.tsConfigPath);
  const tsConfigOutPath = path.join(opts.packagePath, opts.tsConfigOutPath);

  const tsConfigFile = path.join(tsConfigPath, `${opts.tsConfigName}.json`);
  const tsConfigOutFile = path.join(tsConfigOutPath, `${opts.tsConfigOutName}.json`);

  if (!fs.existsSync(tsConfigFile)) {
    log(`${path.relative(opts.packagePath, tsConfigFile)} does not exist`, 'error');
    return false;
  }

  if (!opts.noBackupWarning && opts.noBackupTsConfig && fs.existsSync(tsConfigOutFile)) {
    log(`${path.relative(opts.packagePath, tsConfigOutFile)} already exists and will be replaced without a backup`, 'warn');
  }

  const tsConfig = require(tsConfigOutFile);
  const builder = new(jspm.Builder)();

  let paths = {};
  for (let map in builder.loader.map) {
    const normalized = builder.loader.normalizeSync(map);
    const relative = normalized.replace(builder.loader.baseURL, '');
    paths[map] = [relative]
    paths[`${map}/*`] = [`${relative}/*`, `${relative}/*/index`];
  }

  const pathsMap = Object.assign(tsConfig.compilerOptions.paths, paths);
  const extendsPath = path.relative(tsConfigOutPath, tsConfigPath);
  const extendsFile = (!extendsPath ? './' : extendsPath) + opts.tsConfigName;
  const config = { extends: '', compilerOptions: {} };

  if (!config.compilerOptions.baseUrl) {
    config.compilerOptions.baseUrl = opts.baseUrl;
  }

  config.extends = extendsFile;
  config.compilerOptions.paths = pathsMap;

  if (!opts.noBackupTsConfig && fs.existsSync(tsConfigOutFile)) {
    let name = path.join(tsConfigOutPath, `${opts.backupPrefix}${opts.tsConfigOutName}.json${opts.backupSuffix}`);
    
    if (opts.backupOverwrite || !fs.existsSync(name)) {
      fs.writeFileSync(name, JSON.stringify(require(tsConfigOutFile), null, '\t'));
      log(`${path.relative(opts.packagePath, name)} has been created`);
    }
  }

  fs.writeFileSync(tsConfigOutFile, JSON.stringify(config, null, '\t'));
  log(`${path.relative(opts.packagePath, tsConfigOutFile)} has been created`);

  return true;
}

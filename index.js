const fs = require('fs');
const path = require('path');

module.exports = function (options) {
  const log = function log(text, method) {
    if (opts.silent) return;
    method = !method ? 'log': method;
    console[method](`jspm-tsc-update: ${text}`);
  };

  const defaults = require('./defaults');
  const opts = Object.assign({}, defaults, options);
  
  const jspm = require('jspm');
  jspm.setPackagePath(opts.packagePath);

  const tsConfigPath = path.resolve(opts.packagePath, opts.tsConfigPath);
  const jspmConfigPath = path.resolve(opts.packagePath, opts.jspmConfigPath);

  const tsConfigFile = path.join(tsConfigPath, `${opts.tsConfigName}.json`);
  const jspmConfigFile = path.join(jspmConfigPath, `${opts.jspmConfigName}.json`);
  
  if (!fs.existsSync(tsConfigFile)) {
    log(`${opts.tsConfigName}.json does not exist.`, 'error');
    return false;
  }

  const tsConfig = require(tsConfigFile);
  const builder = new (require('jspm').Builder)();

  try {
    let paths = {};
    for (let map in builder.loader.map) {
      const normalized = builder.loader.normalizeSync(map);
      const relative = normalized.replace(builder.loader.baseURL, '');
      paths[map] = [relative]
      paths[`${map}/*`] = [`${relative}/*`, `${relative}/*/index`];
    }

    const pathsMap = Object.assign(tsConfig.compilerOptions.paths, paths);
    const extendsPath = path.relative(jspmConfigPath, tsConfigPath);
    const extendsFile = (!extendsPath ? './' : extendsPath) + opts.tsConfigName;
    const config = { extends: '', compilerOptions: {} };
    
    if (!config.compilerOptions.baseUrl) {
      config.compilerOptions.baseUrl = opts.baseUrl;
    }
    
    config.extends = extendsFile;
    config.compilerOptions.paths = pathsMap;
    
    if (opts.backupTsConfig && fs.existsSync(jspmConfigFile)) {
      let name = `${opts.backupPrefix}${opts.jspmConfigName}.json${opts.backupPostfix}`;
      fs.writeFileSync(name, JSON.stringify(require(jspmConfigFile), null, '\t'));
      log(`${name} has been created.`);
    }
    
    fs.writeFileSync(jspmConfigFile, JSON.stringify(config, null, '\t'));
    log(`${opts.jspmConfigName}.json has been created.`);

    return true;
  }
  catch (reason) {
    log(reason.message || reason, 'error');
  }

  return false;
}

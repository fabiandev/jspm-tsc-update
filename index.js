const fs = require('fs');
const path = require('path');

module.exports = function (options) {
  const jspm = require('jspm');
  jspm.setPackagePath(opts.packagePath);
  
  const log = function log(text, method) {
    if (opts.silent) return;
    method = !method ? 'log': method;
    console[method](`jspm-tsc-update: ${text}`);
  };

  const defaults = require('./defaults');
  const opts = Object.assign({}, defaults, options);

  const tsConfigPath = path.resolve(opts.packagePath, opts.tsConfigPath);
  const jspmConfigPath = path.resolve(opts.packagePath, opts.jspmConfigPath);

  const tsConfigFile = path.join(tsConfigPath, `${opts.tsConfigName}.json`);
  const jspmConfigFile = path.join(jspmConfigPath, `${opts.jspmConfigName}.json`);

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

    const pathMap = { compilerOptions: { baseUrl: '.', paths: paths } };
    fs.writeFileSync(jspmConfigFile, JSON.stringify(pathMap, null, '\t'));
    log(`${opts.jspmConfigName}.json has been created.`);

    const extendsPath = path.relative(tsConfigPath, jspmConfigPath);
    const extendsFile = (!extendsPath ? './' : extendsPath) + opts.jspmConfigName;

    if (!tsConfig.extends) {
      tsConfig.extends = extendsFile;
      fs.writeFileSync(tsConfigFile, JSON.stringify(tsConfig, null, '\t'));
      log(`${opts.tsConfigName}.json has been updated.`);
    }

    if (tsConfig.extends && tsConfig.extends !== extendsFile) {
      log(`${opts.tsConfigName}.json does not extend ${opts.jspmConfigName}.json`, 'warn');
    }

    return true;
  }
  catch (reason) {
    log(reason.message || reason, 'error');
  }

  return false;
}

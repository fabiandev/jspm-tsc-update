const fs = require('fs');
const path = require('path');

module.exports = function () {
  console.log('Creating tsconfig path mappings from jspm..');

  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  const pathMapPath = path.join(process.cwd(), 'tsconfig.jspm.json');
  const tsConfig = require(tsConfigPath);
  const builder = new (require('jspm').Builder)();

  try {
    var paths = {};
    for (let map in builder.loader.map) {
      const normalized = builder.loader.normalizeSync(map);
      const relative = normalized.replace(builder.loader.baseURL, '');
      paths[map] = [relative]
      paths[`${map}/*`] = [`${relative}/*`, `${relative}/*/index`];
    }

    var pathMap = { compilerOptions: { baseUrl: '.', paths: paths } };
    fs.writeFileSync(pathMapPath, JSON.stringify(pathMap, null, '\t'))

    if (!tsConfig.extends) {
      tsConfig.extends = "./tsconfig.jspm";
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, '\t'));
    }

    console.log('tsconfig.json has been updated.');
    return true;
  }
  catch (reason) {
    console.error(reason.message || reason);
  }
  return false;
}
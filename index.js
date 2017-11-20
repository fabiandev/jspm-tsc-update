const fs = require('fs');
const path = require('path');

module.exports = function () {
  console.log('Creating tsconfig path mappings from jspm..');

  const tsConfigName = 'tsconfig';
  const tsConfigJspmName = 'tsconfig.jspm';
  const tsConfigJspmPath = './';

  const tsConfigPath = path.join(process.cwd(), `${tsConfigName}.json`);
  const pathMapPath = path.join(process.cwd(), `${tsConfigJspmName}.json`);
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
    fs.writeFileSync(pathMapPath, JSON.stringify(pathMap, null, '\t'));
    console.log(`${tsConfigJspmName}.json has been updated.`);

    if (!tsConfig.extends) {
      tsConfig.extends = `${tsConfigJspmPath}${tsConfigJspmName}`;
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, '\t'));
      console.log(`${tsConfigName}.json has been updated.`);
    }
    
    if (tsConfig.extends !== `${tsConfigJspmPath}${tsConfigJspmName}`) {
      console.warn(`${tsConfigName}.json does not extend ${tsConfigJspmName}.json`);
    }

    return true;
  }
  catch (reason) {
    console.error(reason.message || reason);
  }
  
  return false;
}
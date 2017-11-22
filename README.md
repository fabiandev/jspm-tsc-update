# jspm-tsc-update

This package was created out of the need to have installed jspm packages 
also mapped in tsconfig.json `compilerOptions.paths`. All packages installed via `jspm install` will be mapped, as well as peer dependencies.

## Installation

```sh
$ yarn global add jspm-tsc-update
```

> Or you can use: `npm install -g jspm-tsc-update`

## Preparations

1. Rename `tsconfig.json` to `tsconfig.app.json`
2. Set tsconfig path for the SystemJS plugin `plugin-typescript`

```js
System.config({
  typescriptOptions: {
    tsconfig: 'tsconfig.app.json'
  }
});
```

## CLI Usage
Run this package from the command line:

```sh
jspm-tsc-update [options]
```

A `tsconfig.json` will be created that extends `tsconfig.app.json` with all required path mappings.

> When making changes to the `paths` option in `tsconfig.app.json`, you have to run `jspm-tsc-update` again.

## API Usage

Use this package programmatically: 

```js
const jspmTscUpdate = require('jspm-tsc-update');
jspmTscUpdate({/* options */});
```

The behavior is exactly the same as with the CLI.

## When to Run

Ensure to always run this command alongside installing or uninstalling with jspm, or when making changes to your `tsconfig.app.json` `paths`:

```
$ jspm install npm:css-animator && jspm-tsc-update
```

## Options

You can pass options to the CLI or API:

| Option           | Default           |      |
| ---------------- |:-----------------:| ---- |
| silent           | `false`           | Disable console output
| packagePath      | `process.cwd()`   | Location of `package.json`
| tsConfigName     | `"tsconfig.app"`  | Name of the base tsconfig file without `.json` extension
| tsConfigOutName  | `"tsconfig"`      | Name of the resulting tsconfig file without `.json` extension
| tsConfigPath     | `"./"`            | Relative location of the base tsconfig, based on `packagePath`
| tsConfigOutPath  | `"./"`            | Relative location of the resulting tsconfig, based on `packagePath`
| jspm             | `require("jspm")` | The `jspm` module, only supported with the API
| baseUrl          | `"."`             | Fallback tsconfig `baseUrl` compiler option
| noBackupTsConfig | `false`           | Do not backup existing tsconfig
| noBackupWarning  | `false`           | Do not warn if no backup will be created when overwriting files
| backupPrefix     | `""`              | Prefix for the backup file
| backupSuffix    | `".backup"`        | Suffix for the backup file

## Local Usage

You may also install this package locally via `yarn add jspm-tsc-update` or `npm install --save-dev jspm-tsc-update`.
To create an alias for running the executable, you can add it to your `package.json` `scripts`:

```json
{
  "scripts": {
    "update-paths": "node_modules/.bin/jspm-tsc-update"
  }
}
```

The alias can now be run via `npm`:

```
$ jspm install npm:css-animator && npm run update-paths
```

> Or `yarn update-paths` with `yarn`

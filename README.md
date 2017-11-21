# jspm-tsc-update

This package was created out of the need to have installed jspm packages 
also mapped in tsconfig.json `compilerOptions.paths`. All packages installed via `jspm install` will be mapped, as well as peer dependencies.

## Installation

```sh
$ yarn global add jspm-tsc-update
```

> Or you can use: `npm install -g jspm-tsc-update`

## Usage

**Rename `tsconfig.json` to `tsconfig.app.json`**

Make sure to be in the root of your project, where your `package.json` exists.

```sh
$ jspm-tsc-update
```

A `tsconfig.json` will be created that extends `tsconfig.app.json` with all required path mappings.

> When making changes to the `paths` option in `tsconfig.app.json`, you have to run `jspm-tsc-update` again.

## Local Usage

You may also install this package locally via `yarn add jspm-tsc-update` or `npm install --save-dev jspm-tsc-update`.
To create an alias for running the executable, add something like this to your `package.json` `scripts`:

```json
{
  "scripts": {
    "update-paths": "node_modules/.bin/jspm-tsc-update"
  }
}
```

Now you just have to make sure to run this command alongside installing or uninstalling with jspm:

```
$ jspm install npm:css-animator && yarn update-paths
```

> Or when using npm instead of yarn: `npm run update-paths`

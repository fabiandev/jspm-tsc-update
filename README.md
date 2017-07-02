# jspm-tsc-update

This package was created out of the need to have installed jspm packages 
also mapped in tsconfig.json `compilerOptions.paths`. All packages installed via `jspm install` will be mapped, as well as peer dependencies. Custom aliases have to be added manually to `tsconfig.json`, but won't be overwritten.

## Installation

```sh
$ yarn global add jspm-tsc-update
```

> Or you can use: `npm install -g jspm-tsc-update`

## Usage

Make sure to be in the root of your project, where your `package.json` exists.
Also the files `system.config.js` and `tsconfig.json` must be available this location.

```sh
$ jspm-tsc-update
```

After executing the command from above, `compilerOptions.paths` in your `tsconfig.json` will be updated.
A file named `pathmap.json` will be created to keep track of deleted jspm packages, to safely remove them from
your TypeScript path mappings on the next run.

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

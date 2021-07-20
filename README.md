# @hughx/tsconfig

## Installation

```zsh
# npm i -D
yarn add -D @hughx/tsconfig
```

## Usage

Create a `tsconfig.json` in your project root:

```json
{
  "extends": "@hughx/tsconfig"
}
```

ℹ️ Note: This sets up default `include` paths. Due to the way TypeScript configurations work, the paths are relative to the module directory, not the project extending the module. So we assume that the module is installed into `node_modules/@hughx/tsconfig/` and that your project is three directories up (`../../..`). If you install your NPM packages to a nonstandard location you will have to override the `include` entry in your project’s `tsconfig.json`.
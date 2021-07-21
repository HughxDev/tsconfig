# @hughx/tsconfig

## Installation

```zsh
# npm i -D
yarn add -D @hughx/tsconfig
```

You can also install `typedoc` to take advantage of the TypeDoc configuration.

## Usage

Create a `tsconfig.json` in your project root:

```json
{
  "extends": "@hughx/tsconfig"
}
```

<b>ℹ️ Note:</b> This sets up default `include` paths. Due to the way TypeScript configurations work, the paths are relative to the module directory, not the project extending the module. So we assume that the module is installed into `node_modules/@hughx/tsconfig/` and that your project is three directories up (`../../..`). If you install your NPM packages to a nonstandard location you will have to override the `include` entry in your project’s `tsconfig.json`.

## Environment-specific Configs

You can extend from one of the following to bring in sensible defaults for different use cases:

- `@hughx/tsconfig/react.json`
- `@hughx/tsconfig/preact.json`
- `@hughx/tsconfig/node.json`
- `@hughx/tsconfig/web-components.json`

<b>⚠️ Warning:</b> All of the provided configs set `compilerOptions.outDir` to a `dist` directory in your project root. However if your project already emits a `dist/` as the result of another process, you may use an alternate config to output to `compiled/` instead:

- `@hughx/tsconfig/tsconfig--dist-unavailable.json`
- `@hughx/tsconfig/react--dist-unavailable.json`
- `@hughx/tsconfig/preact--dist-unavailable.json`
- `@hughx/tsconfig/node--dist-unavailable.json`
- `@hughx/tsconfig/web-components--dist-unavailable.json`
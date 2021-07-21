#!/usr/bin/env node
const fs = require( 'fs' ).promises;

const endUserProjectPath = '../../..';

const base = {
  "compileOnSave": true,
  "compilerOptions": {
    "module": "ES2020",
    "outDir": "dist",
    "noImplicitAny": true,
    "noUnusedParameters": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "esModuleInterop": true,
    "target": "ES5",
    "allowJs": true,
    "inlineSourceMap": true,
  },
  "typedocOptions": {
    "excludePrivate": true,
    "excludeNotExported": true,
    "excludeExternals": true,
    "stripInternal": true,
    "disableSources": true,
    "categorizeByGroup": true,
    "out": "docs/",
    "mode": "file",
    "inputFiles": [],
  },
  "include": [
    `${endUserProjectPath}/.eslintrc.*`,
    `${endUserProjectPath}/**/*.json`,
    `${endUserProjectPath}/**/*.js`,
    `${endUserProjectPath}/**/*.ts`,
  ],
  "exclude": [
    `${endUserProjectPath}/node_modules`,
    `${endUserProjectPath}/bower_components`,
    `${endUserProjectPath}/jspm_packages`,
  ],
};

const configs = {
  "tsconfig": { ...base },

  "node": {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      ...base.compilerOptions,
      "module": "CommonJS",
      "resolveJsonModule": true,
      "declaration": true,
    },
    "include": base.include.concat(
      "../../../**/*.cjs",
      "../../../**/*.mjs",
    ).sort(),
  },

  "react": {
    "extends": "./tsconfig.json",
    "jsx": "react",
    "include": base.include.concat(
      "../../../**/*.jsx",
      "../../../**/*.tsx",
    ).sort(),
  },

  "preact": {
    "extends": "./react.json",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
  },

  "web-components": {
    "extends": "./tsconfig.json",
  },
};

const configNames = Object.keys( configs );

function getConfig( configName ) {
  if ( !Object.prototype.hasOwnProperty.call( configs, configName ) ) {
    console.error( `Unable to find a config with that name.` );
    process.exit( 1 );
  }

  return configs[configName];
}

function generateConfigs() {
  const promises = [];

  configNames.forEach( ( configName ) => {
    const config = getConfig( configName );
    const filename = `./${configName}.json`;

    promises.push(
      fs.writeFile( filename, `${JSON.stringify( config, null, 2 )}\n` )
        .then( () => console.log( `📝 Wrote ${filename}\n` ) ),
    );
  } );

  Promise.all( promises )
    .catch( ( error ) => console.error( error ) );
}

generateConfigs();

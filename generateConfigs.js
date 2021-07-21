#!/usr/bin/env node
const fs = require( 'fs' ).promises;

function has( object, property ) {
  return Object.prototype.hasOwnProperty.call( object, property );
}

const endUserProjectPath = '../../..';

const base = {
  "compileOnSave": true,
  "compilerOptions": {
    "module": "ES2020",
    "moduleResolution": "node",
    "outDir": `${endUserProjectPath}/dist`,
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
    ),
  },

  "react": {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      ...base.compilerOptions,
      "jsx": "react",
    },
    "include": base.include.concat(
      "../../../**/*.jsx",
      "../../../**/*.tsx",
    ),
  },

  "preact": {
    "extends": "./react.json",
    "compilerOptions": {
      ...base.compilerOptions,
      "jsxFactory": "h",
      "jsxFragmentFactory": "Fragment",
    },
  },

  "web-components": {
    "extends": "./tsconfig.json",
  },
};

const configNames = Object.keys( configs );

function getConfig( configName ) {
  if ( !has( configs, configName ) ) {
    console.error( `Unable to find a config with that name.` );
    process.exit( 1 );
  }

  return configs[configName];
}

function generateConfigs() {
  const promises = [];

  configNames.forEach( ( configName ) => {
    const config = getConfig( configName );
    const sortedConfig = {};
    const filename = `./${configName}.json`;
    const sortedKeys = Object.keys( config ).sort( ( a, b ) => {
      // Float "extends" property to the top
      if ( a === 'extends' ) {
        return -1;
      }
      if ( b === 'extends' ) {
        return 1;
      }

      // Standard alphanumerical sort
      if ( a < b ) {
        return -1;
      }
      if ( a > b ) {
        return 1;
      }

      return 0;
    } );

    sortedKeys.forEach( ( sortedKey ) => {
      if ( typeof config[sortedKey] === 'string' ) {
        sortedConfig[sortedKey] = config[sortedKey];
      } else if ( Array.isArray( config[sortedKey] ) ) {
        sortedConfig[sortedKey] = config[sortedKey].sort();
      } else {
        let subkeys = Object.keys( config[sortedKey] );

        if ( subkeys.length ) {
          subkeys = subkeys.sort();
          sortedConfig[sortedKey] = {};
          subkeys.forEach( ( sortedSubkey ) => {
            sortedConfig[sortedKey][sortedSubkey] = config[sortedKey][sortedSubkey];
          } );
        } else {
          sortedConfig[sortedKey] = config[sortedKey];
        }
      }
    } );

    promises.push(
      fs.writeFile( filename, `${JSON.stringify( sortedConfig, null, 2 )}\n` )
        .then( () => console.log( `📝 Wrote ${filename}\n` ) ),
    );
  } );

  Promise.all( promises )
    .catch( ( error ) => console.error( error ) );
}

generateConfigs();

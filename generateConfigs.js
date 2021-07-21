#!/usr/bin/env node
const fs = require( 'fs' ).promises;

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
    "inputFiles": []
  },
  "include": [
    "../../../.eslintrc.*",
    "../../../**/*.json",
    "../../../**/*.js",
    "../../../**/*.ts"
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
    ).sort()
  },
  
  "react": {
    "extends": "./tsconfig.json",
    "include": base.include.concat(
      "../../../**/*.jsx",
      "../../../**/*.tsx",
    ).sort()
  },

  "web-components": {
    "extends": "./tsconfig.json",
  }
};

const configNames = Object.keys( configs );

function getConfig( configName ) {
  if ( !configs.hasOwnProperty( configName ) ) {
    console.error( `Unable to find a config with that name.` );
    process.exit( 1 );
  }

  return configs[configName];
}

function generateConfigs() {
  const promises = [];

  configNames.forEach( ( configName, index ) => {
    const config = getConfig( configName );
    const filename = `./${configName}.json`;

    promises.push(
      fs.writeFile( filename, JSON.stringify( config, null, 2 ) + '\n' )
        .then( () => console.log( `📝 Wrote ${filename}\n` ) )
    )
  } );

  Promise.all( promises )
    .catch( ( error ) => console.error( error ) )
}

generateConfigs();
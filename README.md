# Nodejs Typescript Setup

Nodejs project setup with Typescript, ESLint, Prettier

## Let's start

Create the project folder

```bash
mkdir [your-project-name]
cd [your-project-name]
```

Then create .gitignore file

```bash
touch .gitignore
```

Ignore file content look like

```bash
node_modules
dist
.env
```

Init node package manager

```bash
yarn init -y
```

Install some dependencies

```bash
yarn add -D typescript ts-node nodemon @types/node eslint prettier eslint-plugin-prettier eslint-config-prettier eslint-import-resolver-typescript tsconfig-paths
```

## NVM setup

Next create node version manager to run this project spacific node version

```bash
node -v > .nvmrc
```

## TS setup

Typescript config

```bash
npx tsc --init
```

and paste this content

```bash
{
  "compilerOptions": {
    "baseUrl": ".",
    "target": "es6" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    "module": "commonjs" /* Specify what module code is generated. */,
    "outDir": "dist" /* Specify an output folder for all emitted files. */,
    "removeComments": true /* Disable emitting comments. */,
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,
    "strict": true /* Enable all strict type-checking options. */,
    "skipLibCheck": true /* Skip type checking all .d.ts files. */,
    "paths": {
      "@src/*": ["src/*"] // Now you can import file like '@src/somefile/...'
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "__tests__"]
}

```

## ESLint setup

Eslint config .eslintrc.json

```bash
npx eslint --init
```

Follow the setup process :

-   [ # ] means question
-   [ > ] means you choose

```
# How would you like to use ESLint?
> To check syntax, find problems, and enforce code style

# What type of modules does your project use?
> JavaScript modules (import/export)

# Which framework does your project use?
> None of these

# Does your project use TypeScript?
> No / Yes (its up to you)

# Where does your code run?
> Node

# How would you like to define a style for your project?
> Use a popular style guide

# Which style guide do you want to follow?
> Standard: /.../

# What format do you want your config file to be in?
> Javascript

Then other stuff you can handle it.
```

Create .eslintignore file to ignore linter thos files

```bash
node_modules
dist
```

## Prettier setup

Create .prettierrc.json config

```bash
{
  "printWidth": 120,
  "tabWidth": 2,
  "semi":true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

Again re-touch .eslintrc.json file

```bash
extends:[
  /.../
  'eslint:recommented',
  'plugin:@typescript-eslint/recommented',
  'plugin:prettier/recommented',
  'plugin:import/errors',
  'plugin:import/warnings',
  'plugin:import/typescript',
],
"plugins": ["@typescript-eslint", "prettier", "import"], // add this line
"rules": {
  'prettier/prettier': 'error',
  'import/extensions': 'off',
  'no-console': 'off',
  'import/order':[
    'error',
    {
      'newlines-between': 'never',
      groups:[
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
      ],
    },
  ],
},
"settings": {
  'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
  },
  'import/resolver': {
      typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
      }
  }
}
```

## Add nodemon

Create nodemon.json config

```bash
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["node_modules", "dist"],
  "exec": "ts-node -r tsconfig-paths/register ./src/index.ts",
  "restartable": "rs",
  "env": {
    "NODE_ENV": "development"
  }
}
```

## Add script options

add scripts options inside package.json file

```bash
"scripts": {
  "install:prod":"yarn install --prod",
  "start:dev": "nodemon",
  "start:prod": "node -r ts-node/register/transpile-only -r tsconfig-paths/register ./dist/index.js",
  "build": "tsc"
},
```

## Start the server

```bash
yarn install:prod // install only production dependencies
yarn start:dev // dev server
yarn start:prod // prod server
yarn buid // build project
```

## Authors

-   [@Rasel-Dev](https://github.com/Rasel-Dev)

# utils

[![Continuos integration](https://api.travis-ci.org/IBMResearch/utils.svg)](https://travis-ci.org/IBMResearch/utils)
[![NSP Status](https://nodesecurity.io/orgs/ibmresearch/projects/fdaeece0-ba09-4c25-a031-fa6379ec1366/badge)](https://nodesecurity.io/orgs/ibmresearch/projects/fdaeece0-ba09-4c25-a031-fa6379ec1366)

Some common utils we use in our projects: Lodash, Bluebird, [Bluemix](http://www.ibm.com/cloud-computing/bluemix) logging/error reporting, debug ...


## Install

We're not pushing it to npm because it's only for internal use.

```sh
npm i --save IBMResearch/utils
```


## API

This library includes some full external libraries and another custom methods.

### Libraries

#### Lodash
In the root we have all [Lodash](https://lodash.com) methods.

```javascript
const utils = require('utils');

console.log(utils.map([1,2], (x) => x * 2));
```

#### Bluebird
Normally we prefer to use [Node ES6/7 native stuff](https://nodejs.org/en/docs/es6/), but [Bluebird](http://bluebirdjs.com/) gives us some useful (non-standard) methods like "Promise.map". Moreover [LoopBack]([LoopBack](https://loopback.io)) uses it [as promise library](https://github.com/strongloop/loopback/blob/master/3.0-RELEASE-NOTES.md#always-use-bluebird-as-promise-library).

```javascript
const Promise = require('utils').Promise;

const readFileP = Promise.promisify(require('fs').readFile);
```

### Methods

#### `debug(projectName, filePath) -> Object`
A wrapper around the [debug](https://github.com/visionmedia/debug) module. It adds some stuff to print the tag to be consistent with LoopBack. The two options are related with it.
- `projectName` (string) - The name of the project.
- `filePath` (string) - The full path of the file.

```javascript
const utils = require('utils');
const dbg = utils.debug(require('../package.json').name, __filename);

dbg('Starting with options', { host: '127.0.0.1', port: 7777 } );
```

#### `info(message, obj) ->`
A wrapper around "console.log" to print things that are not errors but we want them always printed, things we want to know that happened (ie: bad login). Keep it to the minimal, because it's also printed in production and "console.*" are sync operations. It prints using a Bluemix friendly format.
- `message` (string) - Message to print.
- `obj` (object) - Object with extra information. Optional.

```javascript
const info = require('utils').info;

info('Starting with options', { host: '127.0.0.1', port: 7777 } );
info('End');
```

#### `error(message, errObj) ->`
A wrapper around "console.error" to print only critical errors. This way it's going to be correctly tagged in the [IBM Monitoring and analytics addon](https://new-console.ng.bluemix.net/catalog/services/monitoring-and-analytics) for Bluemix.
- `message` (string) - Message to print.
- `errObj` (object) - Error object to include. Optional.

```javascript
const error = require('utils').error;

const err = new Error('Simulating an error.')
error('User not found', err );
```

#### `getAppEnv() ->`
A method to parse the important info from Bluemix app environments.

```javascript
const appEnv = require('utils').getAppEnv();

console.log(appEnv.inBluemix);
console.log(appEnv.port);
console.log(appEnv.url);
console.log(appEnv.dbUris.mongo);
console.log(appEnv.dbUris['compose-mongo']);
console.log(appEnv.dbUris['compose-elastic']);
console.log(appEnv.dbUris['compose-cloudant']);
```


## Developer guide

- Use [GitHub pull requests](https://help.github.com/articles/using-pull-requests).
- We love ES6, so we use [ESLint](http://eslint.org/) and the [Airbnb](https://github.com/airbnb/javascript) style guide. It's the most complete, so it forces the developers to keep a consistent style.
- Please run to be sure your code fits with it and the tests keep passing:
```sh
npm test
```

### Commit messages rules:
- It should be formed by a one-line subject, followed by one line of white space. Followed by one or more descriptive paragraphs, each separated by one￼￼￼￼ line of white space. All of them finished by a dot.
- If it fixes an issue, it should include a reference to the issue ID in the first line of the commit.
- It should provide enough information for a reviewer to understand the changes and their relation to the rest of the code.

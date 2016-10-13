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

#### Lodash
In the root we have also have the [require-directory](https://github.com/troygoode/node-require-directory) method.

```javascript
const utils = require('utils');

const routes = utils.requireDir(module, './routes');
```


#### Bluebird
Normally we prefer to use [Node ES6/7 native stuff](https://nodejs.org/en/docs/es6/), but [Bluebird](http://bluebirdjs.com/) gives us some useful (non-standard) methods like "Promise.map". Moreover [LoopBack]([LoopBack](https://loopback.io)) uses it [as promise library](https://github.com/strongloop/loopback/blob/master/3.0-RELEASE-NOTES.md#always-use-bluebird-as-promise-library). We also include the ["bluebird-extra"](https://github.com/overlookmotel/bluebird-extra) library methods.

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
A method to parse the important info from Bluemix app environments. Basically the ["cfenv"](https://www.npmjs.com/package/cfenv) result with some additions.

```javascript
const appEnv = require('utils').getAppEnv();

// Provided by "cfenv".
console.log(appEnv.port);
console.log(appEnv.url);
console.log(appEnv.isLocal);

// Our additions.
console.log(appEnv.inBluemix);
console.log(appEnv.dbUris.mongo);
console.log(appEnv.dbUris.composeMongo);
console.log(appEnv.dbUris.composeElastic);
console.log(appEnv.dbUris.composeRethink);
console.log(appEnv.dbUris.cloudant]);
```


#### `loopback.getUserId(req) ->`
A method to get the user ID in LoppBack from a request object. Useful with [this middleware](https://github.com/IBMResearch/express-middleware-todb).
- `req` (object) - A Loopback "request" object.

```javascript
...
const getUserId = require('utils').loopback.getUserId;

app.use(toDb(db, { geo: true, idFunc: getUserId, dbOpts: { type: 'elastic' } }));
```


#### `loopback.createUser(app, opts) ->`
A method to get the user ID in LoppBack from a request object. Useful with [this middleware](https://github.com/IBMResearch/express-middleware-todb).
- `app` (object) - A Loopback "app" object.
- `opts` (object) - An object with:
 - `username` (string) - Username of the user to create. (default: 'admin')
 - `password` (string) - Password of the user to create. (default: 'admin')
 - `email` (string) - Email of the user to create. (default: 'admin@admin@myapp.mybluemix.net')
```javascript
...
utils.loopback.createUser(app, {
  username: 'test',
  password: 'test',
  email: 'test@api-starter.mybluemix.net',
})
.then(() => dbg('All user and roles related tasks finished.'))
.catch(err => utils.error('Creating the default user/roles', err));
```


## Developer guide

Please check [this link](https://github.com/IBMResearch/backend-development-guide) before a contribution.

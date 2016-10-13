/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';

const debug = require('debug');
const Promise = require('bluebird');
require('bluebird-extra').usePromise(Promise);
// Lodash as base.
const utils = require('lodash');

const pathToTag = require('./lib/pathToTag');


utils.debug = (projectName, fullPath) => debug(`${projectName}:${pathToTag(fullPath)}`);
const dbg = utils.debug('utils', __filename);

utils.Promise = Promise;


// From here some helpers to print in Bluemix native logs and Monitoring and
// Analytics addon in a more or less comfortable way. Both don't support colors :(.

utils.info = (msg, obj) => {
  let finalMsg = `\n${msg || '-'}`;

  if (obj) { finalMsg = `${finalMsg}: ${JSON.stringify(obj, null, 2)}`; }

  console.log(finalMsg); // eslint-disable-line no-console
};


utils.error = (msg, err) => {
  const separator = '----------';
  let finalMsg = `\nERROR: ${msg || '-'}`;

  if (err) {
    if (err.message) { finalMsg = `${finalMsg}\nmessage: ${err.message}`; }
    if (err.stack) {
      finalMsg = `${finalMsg}\nstack:\n${separator}\n${err.stack}\n${separator}`;
    }
  }

  console.error(finalMsg); // eslint-disable-line no-console
};


utils.getAppEnv = require('./lib/getAppEnv.js');


function getUserId(req) {
  const app = req.app;

  return new Promise((resolve, reject) => {
    const AccessToken = app.models.AccessToken;
    const token = req.query.access_token || req.headers.Authorization;

    // To work local (no auth). Moreover we want to store as much info as possible.
    if (!token || !AccessToken) {
      resolve('noId (no token)');

      return;
    }

    AccessToken.findById(token).then((result) => {
      if (!result) {
        resolve('noId (not found)');

        return;
      }

      resolve(result.userId);
    })
    .catch(err => reject(new Error(`Finding the User ID: ${err.message}`)));
  });
}

// User and roles to create is no one exists.
const defaultUser = {
  username: 'admin',
  password: 'admin',
  email: 'admin@myapp.mybluemix.net',
};
// "admin" not used for now, but eventually we're going to need it.
const defaultRoles = ['frontend', 'admin'];

function createUser(app, opts = {}) {
  return new utils.Promise((resolve, reject) => {
    const User = app.models.User;
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;

    // Parsing the options.
    if (opts.username) { defaultUser.username = opts.username; }
    if (opts.password) { defaultUser.password = opts.password; }
    if (opts.email) { defaultUser.email = opts.email; }

    dbg('Checking if I need to do any users/roles related tasks...');
    // We can do it in parallel with the last one.
    // Only first run in a new database, we rely in if any user exists to know it.
    User.find({})
    .then((users) => {
      dbg(`Number of users: ${users.length}`);

      if (users && users.length && users.length > 0) {
        dbg('Not in first run, so doing nothing');

        resolve();
        return;
      }

      dbg('First app run, creating default user ...');
      User.create(defaultUser)
      .then((user) => {
        dbg('User created', user);

        if (!user) {
          reject(new Error('User not created properly'));

          return;
        }

        dbg('Creating roles ...');
        utils.Promise.map(defaultRoles, roleName => Role.create({ name: roleName }))
        .then((roles) => {
          const frontRole = roles[0];

          dbg('Roles created', defaultRoles);
          dbg('Adding user to the Frontend role ...');

          frontRole.principals.create({
            principalType: RoleMapping.USER,
            principalId: user.id,
          })
          .then(resolve)
          .catch(err => reject(new Error(`Adding the user to the role: ${err.message}`)));
        })
        .catch(err => reject(new Error(`Creating roles: ${err.message}`)));
      })
      .catch(err => reject(new Error(`Creating the default user: ${err.message}`)));
    })
    .catch(err => reject(new Error(`Checking if any user exist: ${err.message}`)));
  });
}


utils.loopback = { getUserId, createUser };


module.exports = utils;

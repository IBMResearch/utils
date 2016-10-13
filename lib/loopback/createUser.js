/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';

const dbg = require('../debug')('utils', __filename);
const Promise = require('../Promise');


// User and roles to create is no one exists.
const defaultUser = {
  username: 'admin',
  password: 'admin',
  email: 'admin@myapp.mybluemix.net',
};
// "admin" not used for now, but eventually we're going to need it.
const defaultRoles = ['frontend', 'admin'];


module.exports = (app, opts = {}) =>
  new Promise((resolve, reject) => {
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
    User.find()
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
        Promise.map(defaultRoles, roleName => Role.create({ name: roleName }))
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

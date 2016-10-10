/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';

const debug = require('debug');
// Lodash as base.
const utils = require('lodash');

const pathToTag = require('./lib/pathToTag');


// Attaching more common stuff from here.

utils.debug = (projectName, fullPath) => debug(`${projectName}:${pathToTag(fullPath)}`);

utils.Promise = require('bluebird');


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


utils.getUserId = (req) => {
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
};


module.exports = utils;

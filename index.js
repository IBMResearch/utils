/*
  MIT License

  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
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

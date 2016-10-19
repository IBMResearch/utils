/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';


// Lodash as base.
const utils = require('lodash');


utils.validator = require('validator');


utils.debug = require('./lib/debug');


utils.Promise = require('./lib/Promise');


utils.requireDir = require('./lib/requireDir');


utils.getAppEnv = require('./lib/getAppEnv');


utils.trickMongoUri = (originalUri, dbName) => {
  const fixDbName = originalUri.replace('/admin?', `/${dbName}?`);

  return `${fixDbName}&authSource=admin`;
};


utils.loopback = utils.requireDir(module, './lib/loopback');


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


module.exports = utils;

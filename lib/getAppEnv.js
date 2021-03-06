/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';

// We need this file to avoid hardcoding sensitive stuff like service tokens.

const appEnv = require('cfenv').getAppEnv();

appEnv.inBluemix = false;
appEnv.dbUris = {};


module.exports = () => {
  // To confirm that we're in Bluemix.
  if (process.env.VCAP_APPLICATION) { appEnv.inBluemix = true; }

  // In Heroku the name of app URL has to be passed in an env var.
  if (process.env.APP_URL) { appEnv.url = process.env.APP_URL; }

  // DB credentials.
  if (appEnv) {
    // https://new-console.ng.bluemix.net/docs/services/MongoDB/index.htm
    if (appEnv.services) {
      if (appEnv.services.mongodb && appEnv.services.mongodb[0] &&
          !appEnv.services.mongodb[0].credentials &&
          !appEnv.services.mongodb[0].credentials.url) {
        appEnv.dbUris.mongo = appEnv.services.mongodb[0].credentials.url;
      }
      if (appEnv.services['compose-for-mongodb'] &&
          appEnv.services['compose-for-mongodb'][0] &&
          appEnv.services['compose-for-mongodb'][0].credentials &&
          appEnv.services['compose-for-mongodb'][0].credentials.uri
      ) {
        appEnv.dbUris.composeMongo = appEnv.services['compose-for-mongodb'][0].credentials.uri;
      }
      if (appEnv.services['compose-for-elasticsearch'] &&
          appEnv.services['compose-for-elasticsearch'][0] &&
          appEnv.services['compose-for-elasticsearch'][0].credentials &&
          appEnv.services['compose-for-elasticsearch'][0].credentials.uri
      ) {
        appEnv.dbUris.composeElastic =
          appEnv.services['compose-for-elasticsearch'][0].credentials.uri;
      }
      if (appEnv.services.cloudantNoSQLDB &&
          appEnv.services.cloudantNoSQLDB[0] &&
          appEnv.services.cloudantNoSQLDB[0].credentials &&
          appEnv.services.cloudantNoSQLDB[0].credentials.url
      ) {
        appEnv.dbUris.cloudant = appEnv.services.cloudantNoSQLDB[0].credentials.url;
      }
    }
  }

  return appEnv;
};


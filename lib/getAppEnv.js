'use strict';

// We need this file to avoid hardcoding sensitive stuff like service tokens.

const appEnv = require('cfenv').getAppEnv();

const result = { inBluemix: false, dbUris: {} };


module.exports = () => {
  // To confirm that we're in Bluemix.
  if (process.env.VCAP_APPLICATION || appEnv) {
    result.inBluemix = true;
  }

  if (appEnv) {
    if (appEnv.port) { result.port = appEnv.port; }
    if (appEnv.url) { result.url = appEnv.url; }

    // Getting DB credentials.
    // https://new-console.ng.bluemix.net/docs/services/MongoDB/index.htm
    if (appEnv.services) {
      if (appEnv.services.mongodb && appEnv.services.mongodb[0] &&
          !appEnv.services.mongodb[0].credentials &&
          !appEnv.services.mongodb[0].credentials.url) {
        result.dbUris.mongo = appEnv.services.mongodb[0].credentials.url;
      }
      if (appEnv.services['compose-for-mongodb'] &&
          appEnv.services['compose-for-mongodb'][0] &&
          appEnv.services['compose-for-mongodb'][0].credentials &&
          appEnv.services['compose-for-mongodb'][0].credentials.uri
      ) {
        // Needed to get it working.
        let fixedUri = appEnv.services['compose-for-mongodb'][0].credentials.uri;
        fixedUri = `${fixedUri}&authSource=admin`;

        result.dbUris.composeMongo = fixedUri;
      }
      if (appEnv.services['compose-for-elasticsearch'] &&
          appEnv.services['compose-for-elasticsearch'][0] &&
          appEnv.services['compose-for-elasticsearch'][0].credentials &&
          appEnv.services['compose-for-elasticsearch'][0].credentials.uri
      ) {
        result.dbUris.composeElastic =
          appEnv.services['compose-for-elasticsearch'][0].credentials.uri;
      }
      if (appEnv.services.cloudantNoSQLDB &&
          appEnv.services.cloudantNoSQLDB[0] &&
          appEnv.services.cloudantNoSQLDB[0].credentials &&
          appEnv.services.cloudantNoSQLDB[0].credentials.url
      ) {
        result.dbUris.composeCloudant = appEnv.services.cloudantNoSQLDB[0].credentials.url;
      }
    }
  }

  return result;
};


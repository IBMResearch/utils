/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>
                     Paco Martín <fmartinfdez@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';


module.exports = (req) => {
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

/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';

const debug = require('debug');

const pathToTag = require('./pathToTag');


module.exports = (projectName, fullPath) => debug(`${projectName}:${pathToTag(fullPath)}`);

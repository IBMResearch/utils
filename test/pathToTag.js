/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';

const test = require('tap').test; // eslint-disable-line import/no-extraneous-dependencies

const method = require('../lib/pathToTag');


test('with a valid file name', (assert) => {
  assert.plan(1);

  assert.equal('index', method('./a/b/c/index.js'));
});


test('with an invalid file name', (assert) => {
  assert.plan(1);

  assert.throw(() => method('a'), new Error('Bad path'));
});

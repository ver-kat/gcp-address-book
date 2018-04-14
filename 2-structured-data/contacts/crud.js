// Copyright 2018 Veronika Thelen

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//Copied and modified from /books/crud.js to be used with /contacts instead

'use strict';

const express = require('express');
const bodyParser = require('body-parser');

function getModel () {
  return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}

const router = express.Router();

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({ extended: false }));

// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

/**
 * GET /contacts
 *
 * Display a page of contacts (up to ten at a time).
 */
router.get('/', (req, res, next) => {
  getModel().list(10, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.render('contacts/contactList.pug', {
      contacts: entities,
      nextPageToken: cursor
    });
  });
});

/**
 * GET /contacts/add
 *
 * Display a form for creating a contact.
 */
// [START add_get]
router.get('/add', (req, res) => {
  res.render('contacts/contactForm.pug', {
    contact: {},
    action: 'Add'
  });
});
// [END add_get]

/**
 * POST /contacts/add
 *
 * Create a contact.
 */
// [START add_post]
router.post('/add', (req, res, next) => {
  const data = req.body;

  // Save the data to the database.
  getModel().create(data, (err, savedData) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  });
});
// [END add_post]

/**
 * GET /contacts/:id/edit
 *
 * Display a contact for editing.
 */
router.get('/:contact/edit', (req, res, next) => {
  getModel().read(req.params.contact, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('contacts/contactForm.pug', {
      contact: entity,
      action: 'Edit'
    });
  });
});

/**
 * POST /contacts/:id/edit
 *
 * Update a contact.
 */
router.post('/:contact/edit', (req, res, next) => {
  const data = req.body;

  getModel().update(req.params.contact, data, (err, savedData) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  });
});

/**
 * GET /contacts/:id
 *
 * Display a contact.
 */
router.get('/:contact', (req, res, next) => {
  getModel().read(req.params.contact, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('contacts/contactView.pug', {
      contact: entity
    });
  });
});

/**
 * GET /contacts/:id/delete
 *
 * Delete a contact.
 */
router.get('/:contact/delete', (req, res, next) => {
  getModel().delete(req.params.contact, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(req.baseUrl);
  });
});

/**
 * Errors on "/contacts/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
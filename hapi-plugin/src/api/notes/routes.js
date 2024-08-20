'use strict';

const routes = (h) => [
  {
    method: 'POST',
    path: '/notes',
    handler: h.postNote
  }, {
    method: 'GET',
    path: '/notes',
    handler: h.getNotes
  }, {
    method: 'GET',
    path: '/notes/{id}',
    handler: h.getNoteById
  }, {
    method: 'PUT',
    path: '/notes/{id}',
    handler: h.editNoteById
  }, {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: h.deleteNoteById
  }
];

module.exports = routes;

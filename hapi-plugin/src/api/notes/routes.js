'use strict';

const routes = (h) => [
  {
    method: 'POST',
    path: '/notes',
    handler: h.postNoteHandler,
    options: { auth: 'notes_app_jwt' }
  }, {
    method: 'GET',
    path: '/notes',
    handler: h.getNotesHandler,
    options: { auth: 'notes_app_jwt' }
  }, {
    method: 'GET',
    path: '/notes/{id}',
    handler: h.getNoteByIdHandler,
    options: { auth: 'notes_app_jwt' }
  }, {
    method: 'PUT',
    path: '/notes/{id}',
    handler: h.putNoteByIdHandler,
    options: { auth: 'notes_app_jwt' }
  }, {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: h.deleteNoteByIdHandler,
    options: { auth: 'notes_app_jwt' }
  }
];

module.exports = routes;

'use strict';

const collaborationsPath = '/collaborations';

const routes = (h) => [
  {
    method: 'POST',
    path: collaborationsPath,
    handler: h.postCollaborationHandler,
    options: {
      auth: 'notes_app_jwt'
    }
  }, {
    method: 'DELETE',
    path: collaborationsPath,
    handler: h.deleteCollaborationHandler,
    options: {
      auth: 'notes_app_jwt'
    }
  }
];

module.exports = routes;

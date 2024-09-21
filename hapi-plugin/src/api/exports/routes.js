'use strict';

const exportNotesPath = '/export/notes';

const routes = (handler) => [
  {
    method: 'POST',
    path: exportNotesPath,
    handler: handler.postExportNotesHandler,
    options: { auth: 'notes_app_jwt' }
  }
];

module.exports = routes;

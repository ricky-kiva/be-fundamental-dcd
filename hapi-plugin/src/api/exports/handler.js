'use strict';

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(req, h) {
    this._validator.validateExportNotesPayload(req.payload);

    const message = {
      userId: req.auth.credentials.id,
      targetEmail: req.payload.targetEmail
    };

    const queue = 'export:notes';

    await this._service.sendMessage(queue, JSON.stringify(message));

    const res = h.response({
      status: 'success',
      message: 'Your request is on queue'
    });

    res.code(201);

    return res;
  }
}

module.exports = ExportsHandler;

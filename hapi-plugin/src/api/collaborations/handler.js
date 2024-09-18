'use strict';

class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(req, h) {
    this._validator.validateCollaborationPayload(req.payload);

    const { id: credentialId } = req.auth.credentials;
    const { noteId, userId } = req.payload;

    await this._notesService.verifyNoteOwner(noteId, credentialId);

    const collaborationId = await this._collaborationsService
      .addCollaboration(noteId, userId);

    const res = h.response({
      status: 'success',
      message: 'Collaboration successfully added',
      data: { collaborationId }
    });

    res.code(201);

    return res;
  }

  async deleteCollaborationHandler(req) {
    this._validator.validateCollaborationPayload(req.payload);

    const { id: credentialId } = req.auth.credentials;
    const { noteId, userId } = req.payload;

    await this._notesService.verifyNoteOwner(noteId, credentialId);
    await this._collaborationsService.deleteCollaboration(noteId, userId);

    return {
      status: 'success',
      message: 'Collaboration successfully deleted'
    };
  }
}

module.exports = CollaborationsHandler;

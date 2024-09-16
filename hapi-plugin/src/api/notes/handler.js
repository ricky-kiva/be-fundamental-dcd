'use strict';

const ClientError = require('../../exceptions/ClientError');

class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(req, h) {
    try {
      this._validator.validateNotePayload(req.payload);

      const { title = 'untitled', body, tags } = req.payload;
      const { id: credentialId } = req.auth.credentials;

      const noteId = await this._service.addNote({
        title,
        body,
        tags,
        owner: credentialId
      });

      const res = h.response({
        status: 'success',
        message: 'Note successfully added!',
        data: { noteId }
      });

      res.code(201);

      return res;
    } catch (e) {
      if (e instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: e.message
        });

        res.code(e.statusCode);
        return res;
      }

      const res = h.response({
        status: 'error',
        message: "There's an error in our server"
      });

      res.code(500);

      // eslint-disable-next-line no-console
      console.error(e);

      return res;
    }
  }

  async getNotesHandler(req) {
    const { id: credentialId } = req.auth.credentials;

    const notes = await this._service.getNotes(credentialId);

    return {
      status: 'success',
      data: { notes }
    };
  }

  async getNoteByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyNoteOwner(id, credentialId);

      const note = await this._service.getNoteById(id);

      return h.response({
        status: 'success',
        data: { note }
      });
    } catch (e) {
      if (e instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: e.message
        });

        res.code(e.statusCode);

        return res;
      }

      const res = h.response({
        status: 'error',
        message: "There's an error in our server"
      });

      res.code(500);

      // eslint-disable-next-line no-console
      console.error(e);

      return res;
    }
  }

  async putNoteByIdHandler(req, h) {
    try {
      this._validator.validateNotePayload(req.payload);

      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyNoteOwner(id, credentialId);
      await this._service.editNoteById(id, req.payload);

      return {
        status: 'success',
        message: 'Note successfully updated'
      };
    } catch (e) {
      if (e instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: e.message
        });

        res.code(e.statusCode);

        return res;
      }

      const res = h.response({
        status: 'error',
        message: "There's an error in our server"
      });

      res.code(500);

      // eslint-disable-next-line no-console
      console.error(e);

      return res;
    }
  }

  async deleteNoteByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyNoteOwner(id, credentialId);
      await this._service.deleteNoteById(id);

      return {
        status: 'success',
        message: 'Note successfully deleted'
      };
    } catch (e) {
      if (e instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: e.message
        });

        res.code(e.statusCode);

        return res;
      }

      const res = h.response({
        status: 'error',
        message: "There's an error in our server"
      });

      res.code(500);

      // eslint-disable-next-line no-console
      console.error(e);

      return res;
    }
  }
}

module.exports = NotesHandler;

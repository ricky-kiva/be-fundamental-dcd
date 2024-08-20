'use strict';

class NotesHandler {
  constructor(service) {
    this._service = service;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  postNoteHandler(req, h) {
    try {
      const { title = 'untitled', body, tags } = req.payload;

      const noteId = this._service.addNote({ title, body, tags });

      const res = h.response({
        status: 'success',
        message: 'Note successfully added!',
        data: { noteId }
      });

      res.code(201);

      return res;
    } catch (err) {
      const res = h.response({
        status: 'fail',
        message: err.message
      });

      res.code(400);

      return res;
    }
  }

  getNotesHandler() {
    const notes = this._service.getNotes();

    return {
      status: 'success',
      data: { notes }
    };
  }

  getNoteByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const note = this._service.getNoteById(id);

      return h.response({
        status: 'success',
        data: { note }
      });
    } catch (err) {
      const res = h.response({
        status: 'fail',
        message: err.message
      });

      res.code(404);

      return res;
    }
  }

  putNoteByIdHandler(req, h) {
    try {
      const { id } = req.params;
      this._service.editNoteById(id, req.payload);

      return {
        status: 'success',
        message: 'Note successfully updated'
      };
    } catch (err) {
      const res = h.response({
        status: 'fail',
        message: err.message
      });

      res.code(404);

      return res;
    }
  }

  deleteNoteByIdHandler(req, h) {
    try {
      const { id } = req.params;

      this._service.deleteNoteById(id);

      return {
        status: 'success',
        message: 'Note successfully deleted'
      };
    } catch (err) {
      const res = h.response({
        status: 'fail',
        message: err.message
      });

      res.code(404);

      return res;
    }
  }
}

module.exports = NotesHandler;

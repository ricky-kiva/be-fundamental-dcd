'use strict';

const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (req, h) => {
  const { title = 'untitled', tags, body } = req.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt
  };

  notes.push(newNote);

  const isSuccess = notes
    .filter((note) => note.id === id)
    .length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Note successfully added!',
      data: { noteId: id }
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan'
  });

  response.code(500);

  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: { notes }
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: { note }
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Note not found'
  });

  response.code(404);

  return response;
};

const editNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const { title, tags, body } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((n) => n.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt
    };

    const response = h.response({
      status: 'success',
      message: 'Note successfully updated'
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Failed to update the note. Note id is not found'
  });

  response.code(404);

  return response;
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = notes.find((n) => n.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Note successfully deleted'
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Failed to delete note. Note id is not found'
  });

  response.code(404);

  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler
};

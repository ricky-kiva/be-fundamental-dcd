'use strict';

const { NotePayloadSchema } = require('./schema');
const InvariantEroror = require('../../exceptions/InvariantError');

const NotesValidator = {
  validateNotePayload: (payload) => {
    const validationResult = NotePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantEroror(validationResult.error.message);
    }
  }
};

module.exports = NotesValidator;

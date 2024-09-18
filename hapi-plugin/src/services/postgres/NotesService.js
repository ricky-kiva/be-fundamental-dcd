'use strict';

const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBNotesToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class NotesService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addNote({
    title, body, tags, owner
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt, owner]
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add note');
    }

    return result.rows[0].id;
  }

  async getNotes(owner) {
    const q = {
      text: `
        SELECT notes.* FROM notes
        LEFT JOIN notes_collabs ON notes_collabs.note_id = notes.id
        WHERE notes.owner = $1 OR notes_collabs.user_id = $1
        GROUP BY notes.id
      `,
      values: [owner]
    };

    const result = await this._pool.query(q);

    return result.rows
      .map(mapDBNotesToModel);
  }

  async getNoteById(id) {
    const query = {
      text: `
        SELECT notes.*, notes_users.username
        FROM notes
        LEFT JOIN notes_users ON notes_users.id = notes.owner
        WHERE notes.id = $1 
      `,
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Note not found');
    }

    return result.rows
      .map(mapDBNotesToModel)[0];
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update the note. Note id is not found');
    }
  }

  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete note. Note id is not found');
    }
  }

  async verifyNoteOwner(id, owner) {
    const q = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Note not found');
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError("You don't have the right to access this resource");
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (e) {
      if (e instanceof NotFoundError) throw e;

      try {
        await this._collaborationService.verifyCollaborator(noteId, userId);
      } catch (e2) {
        throw e;
      }
    }
  }
}

module.exports = NotesService;

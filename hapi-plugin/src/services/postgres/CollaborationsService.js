'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaboration(noteId, userId) {
    const id = `collab-${nanoid(16)}`;

    const q = {
      text: 'INSERT INTO notes_collabs VALUES($1, $2, $3) RETURNING id',
      values: [id, noteId, userId]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add collaboration');
    }

    await this._cacheService.delete(`notes:${userId}`);

    return result.rows[0].id;
  }

  async deleteCollaboration(noteId, userId) {
    const q = {
      text: 'DELETE FROM notes_collabs WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values: [noteId, userId]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Failed to delete collaboration');
    }

    await this._cacheService.delete(`notes:${userId}`);
  }

  async verifyCollaborator(noteId, userId) {
    const q = {
      text: 'SELECT * FROM notes_collabs WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Failed to verify collaboration');
    }
  }
}

module.exports = CollaborationsService;

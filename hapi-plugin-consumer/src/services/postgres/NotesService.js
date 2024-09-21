'use strict';

const { Pool } = require('pg');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  async getNotes(userId) {
    const q = {
      text: `
        SELECT notes.* FROM notes
        LEFT JOIN notes_collabs ON notes_collabs.note_id = notes.id
        WHERE notes.owner = $1 OR notes_collabs.user_id = $1
        GROUP BY notes.id
      `,
      values: [userId]
    }

    const result = await this._pool.query(q);

    return result.rows;
  }
}

module.exports = NotesService;

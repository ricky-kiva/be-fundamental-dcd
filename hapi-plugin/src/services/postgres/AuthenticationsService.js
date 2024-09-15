'use strict';

const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const q = {
      text: 'INSERT INTO notes_authentications VALUES($1)',
      values: [token]
    };

    await this._pool.query(q);
  }

  async verifyRefreshToken(token) {
    const q = {
      text: 'SELECT token FROM notes_authentications WHERE token = $1',
      values: [token]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Refresh Token is not valid');
    }
  }

  async deleteRefreshToken(token) {
    const q = {
      text: 'DELETE FROM notes_authentications WHERE token = $1',
      values: [token]
    };

    await this._pool.query(q);
  }
}

module.exports = AuthenticationsService;

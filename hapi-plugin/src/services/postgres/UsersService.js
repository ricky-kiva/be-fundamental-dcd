'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const q = {
      text: 'INSERT INTO notes_users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add user');
    }

    return result.rows[0].id;
  }

  async getUserById(userId) {
    const q = {
      text: 'SELECT id, username, fullname FROM notes_users WHERE id = $1',
      values: [userId]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0];
  }

  async getUsersByUsername(username) {
    const q = {
      text: 'SELECT id, username, fullname FROM notes_users WHERE username LIKE $1',
      values: [`%${username}%`]
    };

    const result = await this._pool.query(q);

    return result.rows;
  }

  async verifyUsername(username) {
    const q = {
      text: 'SELECT username FROM notes_users WHERE username = $1',
      values: [username]
    };

    const result = await this._pool.query(q);

    if (result.rows.length > 0) {
      throw new InvariantError('Failed to add user. Username is used');
    }
  }

  async verifyUserCredential(username, password) {
    const q = {
      text: 'SELECT id, password FROM notes_users WHERE username = $1',
      values: [username]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new AuthenticationError('Invalid credentials');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Invalid credentials');
    }

    return id;
  }
}

module.exports = UsersService;

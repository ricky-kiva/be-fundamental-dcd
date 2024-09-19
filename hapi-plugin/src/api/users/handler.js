'use strict';

const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  async postUserHandler(req, h) {
    this._validator.validateUserPayload(req.payload);

    const { username, password, fullname } = req.payload;

    const userId = await this._service.addUser({ username, password, fullname });

    const res = h.response({
      status: 'success',
      message: 'User successfully added',
      data: { userId }
    });

    res.code(201);

    return res;
  }

  async getUserByIdHandler(req) {
    const { id } = req.params;

    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: { user }
    };
  }

  async getUsersByUsernameHandler(req, h) {
    try {
      const { username = '' } = req.query;
      const users = await this._service.getUsersByUsername(username);

      return {
        status: 'success',
        data: { users }
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

module.exports = UsersHandler;

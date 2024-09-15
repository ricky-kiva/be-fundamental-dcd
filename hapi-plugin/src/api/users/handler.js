'use strict';

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
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
}

module.exports = UsersHandler;

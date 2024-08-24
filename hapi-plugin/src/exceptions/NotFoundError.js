'use strict';

const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404); // 404 is the statusCode of ClientError

    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;

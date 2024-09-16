'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      });

      newResponse.code(response.statusCode);

      return newResponse;
    }

    return h.continue;
  });

  await server.register([
    {
      plugin: Jwt
    }
  ]);

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator
      }
    }, {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    }, {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    }
  ]);

  await server.start();

  // eslint-disable-next-line no-console
  console.log(`Server is running on ${server.info.uri}`);
};

init();

'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');
const CacheService = require('./services/redis/CacheService');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const uploadImagePath = path.resolve(__dirname, 'api/uploads/file/images');

  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService(cacheService);
  const notesService = new NotesService(collaborationsService, cacheService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(uploadImagePath);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    },
    debug: {
      request: ['error']
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
    { plugin: Jwt },
    { plugin: Inert }
  ]);

  server.auth.strategy('notes_app_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: { // basic token verification
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({ // add custom logic for validation
      isValid: true,
      credentials: { // to pass data on the route handler
        id: artifacts.decoded.payload.id
      }
    })
  });

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
    }, {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator
      }
    }, {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator
      }
    }, {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator
      }
    }
  ]);

  await server.start();

  // eslint-disable-next-line no-console
  console.log(`Server is running on ${server.info.uri}`);
};

init();

'use strict';

const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const path = require('path');

const init = async () => {
  const server = Hapi.Server({
    host: 'localhost',
    port: 3000
  });

  await server.register(Vision);

  server.views({
    engines: {
      hbs: Handlebars
    },
    path: path.join(__dirname, 'views')
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return h.view('index', {
        title: 'Hapi.js with Handlebars',
        message: 'This is template rendering engine using Handlebars & Vision plugin'
      });
    }
  });

  await server.start();

  // eslint-disable-next-line no-console
  console.log(`Server is running on ${server.info.uri}`);
};

init();

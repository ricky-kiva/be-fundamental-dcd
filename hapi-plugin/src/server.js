'use strict';

const notesPlugin = require('./notesPlugin');
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server();

  await server.register({ // can register another plugin here
    plugin: notesPlugin,
    options: { notes: [] } // assign option
  });

  await server.start();
};

init();

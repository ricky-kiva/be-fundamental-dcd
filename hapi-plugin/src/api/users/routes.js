'use strict';

const routes = (h) => [
  {
    method: 'POST',
    path: '/users',
    handler: h.postUserHandler
  }, {
    method: 'GET',
    path: '/users/{id}',
    handler: h.getUserByIdHandler
  }
];

module.exports = routes;

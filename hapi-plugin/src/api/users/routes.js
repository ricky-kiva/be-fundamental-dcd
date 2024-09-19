'use strict';

const usersPath = '/users';

const routes = (h) => [
  {
    method: 'POST',
    path: usersPath,
    handler: h.postUserHandler
  }, {
    method: 'GET',
    path: `${usersPath}/{id}`,
    handler: h.getUserByIdHandler
  },
  {
    method: 'GET',
    path: usersPath,
    handler: h.getUsersByUsernameHandler
  }
];

module.exports = routes;

'use strict';

const routes = (h) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: h.postAuthenticationHandler
  }, {
    method: 'PUT',
    path: '/authentications',
    handler: h.putAuthenticationHandler
  }, {
    method: 'DELETE',
    path: '/authentications',
    handler: h.deleteAuthenticationHandler
  }
];

module.exports = routes;

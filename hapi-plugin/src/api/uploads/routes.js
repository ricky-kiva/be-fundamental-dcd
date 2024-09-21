'use strict';

const path = require('path');

const uploadPath = '/upload';

const routes = (h) => [
  {
    method: 'POST',
    path: `${uploadPath}/images`,
    handler: h.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream'
      }
    }
  }, {
    method: 'GET',
    path: `${uploadPath}/{param*}`,
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file')
      }
    }
  }
];

module.exports = routes;

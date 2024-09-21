'use strict';

const uploadImagesPath = '/upload/images';

const routes = (h) => [
  {
    method: 'POST',
    path: uploadImagesPath,
    handler: h.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream'
      }
    }
  }
];

module.exports = routes;

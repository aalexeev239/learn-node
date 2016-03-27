'use strict';

const fs = require('fs');
const config = require('config');
const path = require('path');


function deleteFile (pathname, res) {
  pathname = path.join(config.filesDir, pathname);

  fs.unlink(pathname, (err) => {
    if (err) {

      if (err.code == 'ENOENT') {
        res.statusCode = 404;
        res.end('File not exists');
        return;
      }

      console.log(err);
      res.statusCode = 500;
      res.end('Server error');
      return;
    }

    fs.readdir(config.filesDir, (err, files) => {
      if (err) {
        res.statusCode = 200;
        res.end('OK')
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({files: files}));       
    });

    return;
  })
}

module.exports = deleteFile;

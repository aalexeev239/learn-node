'use strict';

const fs = require('fs');
const config = require('config');
const path = require('path');

function uploadFile (pathname, req, res) {
  pathname = path.join(config.filesDir, pathname);

  if (req.headers['content-length'] >= config.maxFileSize) {
    res.statusCode = 413;
    res.end("Too big file");
    return;
  }

  let file = new fs.WriteStream(pathname, { flags: 'wx'});

  file.on('error', (err)=>{
    if (err.code == 'EEXIST') {
      res.statusCode = 409;
      res.end('File already exists');
      return;
    }
    console.log(err);
    res.statusCode = 500;
    res.end('Server error')
    return;
  });

  res.on('close', ()=>{
    file.destroy();
  });

  req.pipe(file).on('finish', ()=>{
    fs.readdir(config.filesDir, (err, files) => {
      if (err) {
        res.statusCode = 200;
        res.end('OK');
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({files: files}));
      return;
    });
  });
}

module.exports = uploadFile;

/**
 ЗАДАЧА
 Написать HTTP-сервер для загрузки и получения файлов
 - Все файлы находятся в директории files
 - Структура файлов НЕ вложенная, поддиректорий нет

 - Виды запросов к серверу
   GET /file.ext
   - выдаёт файл file.ext из директории files,
   - ошибку 404 если файла нет

   POST /file.ext
   - пишет всё тело запроса в файл files/file.ext и выдаёт ОК
   - если файл уже есть, то выдаёт ошибку 409

   DELETE /file
   - удаляет файл
   - выводит 200 OK
   - если файла нет, то ошибка 404

 Вместо file может быть любое имя файла

 Поддержка вложенных директорий в этой задаче не нужна,
 т.е. при наличии / или .. внутри пути сервер должен выдавать ошибку 400
 */

'use strict';

const url = require('url');
const fs = require('fs');
const path = require('path');
const config = require('config');
const getFile = require('./modules/getFile');
const uploadFile = require('./modules/uploadFile');
const deleteFile = require('./modules/deleteFile');

require('http').createServer(function(req, res) {

  let pathname = decodeURI(url.parse(req.url).pathname);

  switch(req.method) {
    case 'GET':
      if (pathname == '/') {
        // rewrite with streams and error handling (!)
        getFile('/public/index.html', __dirname, res);
        return;
      } else {
        let basename = pathname.split('/');
        basename = basename[basename.length - 1];
        getFile(basename, config.filesDir, res);
        return;
      }
      break;

    case 'POST':
      if (pathname == '/') {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }
      uploadFile(pathname, req, res);
      break;

    case 'DELETE':
      if (pathname == '/') {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }

      deleteFile(pathname, res);

      break;


    default:
      res.statusCode = 502;
      res.end('Not implemented');
      return;
    }

}).listen(config.port);

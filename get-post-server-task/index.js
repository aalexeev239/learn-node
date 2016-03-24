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

let url = require('url');
let fs = require('fs');
const path = require('path');
const handleFile = require('./modules/handleFile');
const config = require('config');



require('http').createServer(function(req, res) {

  let pathname = decodeURI(url.parse(req.url).pathname);
  
  switch(req.method) {
    case 'GET':
      if (pathname == '/') {
        // rewrite with streams and error handling (!)
        handleFile('/public/index.html', __dirname, res);
        return;
      } else {
        let basename = pathname.split('/');
        basename = basename[basename.length - 1];
        handleFile(basename, path.join(__dirname, 'files'), res);
      }
      break;


    default:
      res.statusCode = 502;
      res.end("Not implemented");
    }

}).listen(3000);

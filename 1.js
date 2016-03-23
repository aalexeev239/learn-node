'use strict';

const http = require('http');
const handler = require('handler');

var server = new http.Server();

server.on('request', handler);

server.listen(8000);
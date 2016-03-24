"use strict";

const fs = require('fs');
const path = require('path');

let handleFile = (filename, root, res) => {

    // check name
    try {
        filename = decodeURIComponent(filename);
    } catch (e) {
        res.statusCode = 400;
        res.end("bad request");
        return;
    }

    // check zero byte
    if (~filename.indexOf('\0')) {
        res.statusCode = 400;
        res.end("bad request");
        return;
    }

    let filePath = path.normalize(path.join(root, filename));

    // check relativeness
    if (filePath.indexOf(root) != 0 ) {
        res.statusCode = 404;
        res.end(`file "${filename}" not found`);
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end(`file "${filename}" not found`);
            return;
        }
        const mime = require('mime').lookup(filePath);
        res.setHeader('Content-Type', `${mime}; charset=utf-8`);

        let file = new fs.ReadStream(filePath);
        sendFileStream(file, res);
    })

}

let sendFileStream = (file, res) => {
   file.on('readable', write);

    function write() {
        const contents = file.read();

        if (contents && !res.write(contents)) {
            file.removeListener('readable', write);

            res.once('drain', ()=>{
                file.on('readable', write);
                write();
            })
        }
    }

    file.on('end', ()=>{
        res.end();
    })

    res.on('close', ()=> {
        file.destroy();
    })
}

module.exports = handleFile;
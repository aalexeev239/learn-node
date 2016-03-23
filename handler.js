'use strict';

const handler = (req, res) => {
    // если не сделать res.end, то запрос "подвиснет", нода сама отвечать не будет
    res.end("Hello");
};

module.exports = handler;
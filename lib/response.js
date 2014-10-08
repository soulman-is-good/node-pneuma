"use strict";

/**
 * Common application logic
 */

var http = require('http');

module.exports = function () {
  return function (req, res, next) {
    res.status = function (code) {
      this.statusCode = code;
      return this;
    };

    res.json = function (obj) {
      // allow status / body
      if (2 === arguments.length) {
        // res.json(body, status) backwards compat
        if ('number' === typeof arguments[1]) {
          this.statusCode = arguments[1];
        } else {
          this.statusCode = obj;
          obj = arguments[1];
        }
      }

      // settings
      var body = JSON.stringify(obj, true);

      // content-type
      this.charset = this.charset || 'utf-8';
      this.getHeader('Content-Type') || this.setHeader('Content-Type', 'application/json');

      return this.send(body);
    };
    res.send = function (body) {
      var head = 'HEAD' == req.method;
      var len;

      // allow status / body
      if (2 == arguments.length) {
        // res.send(body, status) backwards compat
        if ('number' != typeof body && 'number' == typeof arguments[1]) {
          this.statusCode = arguments[1];
        } else {
          this.statusCode = body;
          body = arguments[1];
        }
      }

      switch (typeof body) {
        // response status
        case 'number':
          //this.getHeader('Content-Type') || this.type('txt');
          this.statusCode = body;
          body = http.STATUS_CODES[body];
          break;
          // string defaulting to html
        case 'string':
          if (!this.getHeader('Content-Type')) {
            this.charset = this.charset || 'utf-8';
            this.type('html');
          }
          break;
        case 'boolean':
        case 'object':
          if (null == body) {
            body = '';
          } else if (Buffer.isBuffer(body)) {
            this.getHeader('Content-Type') || this.type('bin');
          } else {
            return this.json(body);
          }
          break;
      }

      // populate Content-Length
      if (undefined !== body && !this.getHeader('Content-Length')) {
        this.setHeader('Content-Length', len = Buffer.isBuffer(body)
          ? body.length
          : Buffer.byteLength(body));
      }

      // TODO: ETag support and W/ support

      // freshness
//      if (req.fresh) {
//        this.statusCode = 304;
//      }
      // strip irrelevant headers
      if (204 == this.statusCode || 304 == this.statusCode) {
        this.removeHeader('Content-Type');
        this.removeHeader('Content-Length');
        this.removeHeader('Transfer-Encoding');
        body = '';
      }

      // respond
      this.end(head ? null : body);
      return this;
    };
    next();
  };
};
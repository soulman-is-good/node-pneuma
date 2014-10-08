"use strict";

var connect = require('connect'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  response = require('./lib/response'),
  timeout = require('./lib/timeout'),
  errorHandler = require('./lib/errors'),
  lo = require('lodash'),
  http = require('http'),
  app = connect();

module.exports = function pneuma (options) {
  var ops = lo.extend({
    timeout: '1s'
  },options);
  app.use(response());
  app.use(errorHandler());
  app.use(timeout(ops.timeout));
  setTimeout(function(){
    app.use(haltOnTimeout);
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(compression());
  }, 1500);
  http.createServer(app).listen(3000);
};

var haltOnTimeout = function(req, res, next){
  if(!req.timedout) {
    next();
  }
};
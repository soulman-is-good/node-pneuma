"use strict";

/**
 * Request timeout workaround
 */

var timeout = require('connect-timeout');

module.exports = function(time){
  return function(req, res, next){
    timeout(time)(req, res, function(err){
      req.errorHandler(err);
    });
  };
};
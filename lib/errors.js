"use strict";

/**
 * Error handling
 */

module.exports = function errorHandling () {
  return function (req, res, next) {
    req.errorHandler = function (err) {
      console.error(arguments);
      res.status(err && err.status || 500);
      res.json({
        error: err && err.message || "Error"
      });
    };
    next();
  };
};

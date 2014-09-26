#!/usr/bin/env nodejs

var args = process.argv.slice(2)
  , fs = require('fs')
  , path = require('path')
  , command = args.shift();

switch (command) {
  case "init":
    var appName = (args.shift() || "").replace(/[\s]/g, '');
    var cwd = process.cwd();
    if(appName === "") {
      console.log("App name must be specified");
    } else {
      console.log("============= Creating '" + appName + "' app =============");
    }
    break;
  case "--version":
  case "-v":
    var version = "-";
    try {
      var json = JSON.parse(fs.readFileSync(path.resolve('./package.json')));
      version = json.version;
    } catch (e) {
      throw e;
    }
    console.log(version);
    break;
  default:
    printHelp();
    break;
}
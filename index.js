"use strict";

var grunt = require('grunt')
  , crypto = require('crypto');

function md5(files) {
  var hash = crypto.createHash('md5');
  files.forEach(function(file) {
    hash.update(grunt.file.read(file), 'utf-8');
  });
  return hash.digest('hex');
}

function toArray(pattern) {
  var arr = Array.isArray(pattern) ? pattern : [pattern];
  return grunt.file.expand({
    filter: 'isFile',
    matchBase: true
  }, arr);
}

function stripWebroot(files, webroot) {
  var regex = (webroot instanceof RegExp) ? webroot : new RegExp('^' + webroot);
  return files.map(function(file) {
    return file.replace(regex, '');
  });
}

module.exports = exports = function(options) {

  options = options || {};

  var assets = options.assets || {};
  var webroot = options.webroot;
  var debug = options.debug || false;

  var result = {};

  Object.keys(assets).forEach(function(groupName) {
    var group = assets[groupName];
    result[groupName] = {};
    Object.keys(group).forEach(function(fileType) {
      result[groupName][fileType] = [];
      var filesHash = group[fileType];
      if ('src' in filesHash || 'dest' in filesHash) {
        result[groupName][fileType] = debug ? toArray(filesHash.src) : filesHash.dest;
      } else {
        Object.keys(filesHash).forEach(function(targetFile) {
          var sourceFiles = toArray(filesHash[targetFile]);
          if (options.debug) {
            [].push.apply(result[groupName][fileType], toArray(sourceFiles));
          } else {
            var fingerprint = '?' + md5(sourceFiles).substring(0, 8);
            result[groupName][fileType].push(targetFile + fingerprint);
          }
        });
      }
      if (webroot) {
        result[groupName][fileType] = stripWebroot(result[groupName][fileType], webroot);
      }
    });
  });

  return result;

};

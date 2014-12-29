"use strict";

var assetboss = require('../index')
  , assert = require('assert')
  , grunt = require('grunt');

grunt.file.setBase(__dirname);

describe("in debug environment", function() {

  var assets = assetboss({
    assets: require('./assets.json'),
    debug: true,
    webroot: 'public'
  });

  it("should spit source files", function() {
    assert.equal(assets.main.css.length, 1);
    assert.equal(assets.main.css[0], '/css/main.css');
    assert.equal(assets.main.js.length, 5);
    assert.equal(assets.main.js[3], '/js/a.js');
    assert.equal(assets.main.js[4], '/js/b.js');
  });

});

describe("in production environment", function() {

  var assets = assetboss({
    assets: require('./assets.json'),
    debug: false,
    webroot: 'public'
  });

  it("should spit destination files", function() {
    assert.equal(assets.main.css.length, 1);
    assert.equal(assets.main.css[0], '/build/main.css?4ac23b27');
    assert.equal(assets.main.js.length, 1);
    assert.equal(assets.main.js[0], '/build/main.js?b7b43017');
  });

});


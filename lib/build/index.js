/**
 * Module dependencies.
 */

var Builder = require('component-builder')
  , styles = require('component-stylus-plugin')
  , templates = require('./templates')
  , fs = require('fs')
  , write = fs.writeFileSync

/**
 * Expose component
 * builder creation
 */

module.exports.createBuilder = createBuilder;

/**
 * Expose component
 * build middleware.
 */

module.exports.middleware = middleware;

/**
 * Creates a `Builder` instance
 * ready for build
 */

function createBuilder () {
  var builder = new Builder('.');
  builder.copyFiles();
  builder.addLookup('lib');
  builder.copyAssetsTo('public');
  builder.use(styles);
  builder.use(templates);

  return builder;
}

/**
 * Express build middleware
 */

function middleware (req, res, next) {
  if (!~["/app.js", "/app.css"].indexOf(req.path)){
    return next();
  }
  var builder = createBuilder();
  builder.build(function(err, res){
    if (err) return next(err);
    write('public/app.js', res.require + res.js);
    write('public/app.css', res.css);
    next();
  });
};
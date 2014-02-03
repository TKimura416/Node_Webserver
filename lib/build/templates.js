
/**
 * Module dependencies.
 */

var str2js = require('string-to-js');
var jade = require('jade');
var path = require('path');
var fs = require('fs');
var read = fs.readFileSync;

/**
 * HTML template plugin used to convert
 * .html files to require()-able javascript
 * on the fly.
 *
 * @param {Builder} builder
 * @api public
 */

module.exports = function(builder) {
  builder.hook('before scripts', function(pkg) {
    // check if we have .templates in component.json
    var tmpls = pkg.config.templates;
    if (!tmpls) return;

    // translate templates
    tmpls.forEach(function(file) {
      // check extension
      var ext = path.extname(file);
      // read the file
      var str = read(pkg.path(file), 'utf8');
      // init some vars
      var js = '';
      var newFile = '';

      // convert files to js
      if ('.jade' === ext) {
        newFile = path.basename(file, '.jade') + '.js';
        js += 'var jade = require("jade");\n'
        js += 'module.exports = ' + jade.compile(str, { client: true, compileDebug: false });
      } else {
        newFile = path.basename(file, '.html') + '.js';
        js = str2js(str, 'utf8');
      }

      // add the fabricated script
      pkg.addFile('scripts', newFile, js);
    });
  });
};
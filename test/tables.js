var highland = require('highland');
var templates = require('./templates');

//test(require('./interrupts'));
//test(require('./swym'));
test(require('./load'));

function test(module) {
  highland.keys(module)
    .each(function(key) {
      describe.only(key, function() {
        templates.diff(module[key]);
      });
    });
}

var highland = require('highland');
var templates = require('./templates');

test(require('./immediate'));

/*
test(require('./arithmetic'));
test(require('./bytewise'));
test(require('./branch'));
test(require('./interrupts'));
test(require('./load'));
test(require('./store'));
test(require('./swym'));
*/

function test(module) {
  highland.keys(module)
    .each(function(key) {
      describe(key, function() {
        templates.differ(module[key]);
      });
    });
}

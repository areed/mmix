var highland = require('highland');
var templates = require('./templates');

test(require('./arithmetic'));
test(require('./bitwise'));
test(require('./bytewise'));
test(require('./branch'));
test(require('./compare'));
test(require('./conditionals'));
test(require('./immediate'));
test(require('./interrupts'));
test(require('./load'));
test(require('./store'));
test(require('./swym'));

function test(module) {
  highland.keys(module)
    .each(function(key) {
      describe(key, function() {
        templates.differ(module[key]);
      });
    });
}

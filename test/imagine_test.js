var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.imagine = {
  pngmin: function (test) {
    var task = 'pngmin';
    grunt.util.spawn({
      grunt: true,
      args: ['--no-color', task]
    }, function (error, result) {
      test.expect(1);
      test.ok(task === result.stdout.match(/running "(.+)" task/i)[1], result.stdout);
      test.done();
    });
  },
  gifmin: function (test) {
    var task = 'gifmin';
    grunt.util.spawn({
      grunt: true,
      args: ['--no-color', task]
    }, function (error, result) {
      test.expect(1);
      test.ok(task === result.stdout.match(/running "(.+)" task/i)[1], result.stdout);
      test.done();
    });
  },
  jpgmin: function (test) {
    var task = 'jpgmin';
    grunt.util.spawn({
      grunt: true,
      args: ['--no-color', task]
    }, function (error, result) {
      test.expect(1);
      test.ok(task === result.stdout.match(/running "(.+)" task/i)[1], result.stdout);
      test.done();
    });
  },
  pngnq: function (test) {
    var task = 'pngnq';
    grunt.util.spawn({
      grunt: true,
      args: ['--no-color', task]
    }, function (error, result) {
      test.expect(1);
      test.ok(task === result.stdout.match(/running "(.+)" task/i)[1], result.stdout);
      test.done();
    });
  },
  inlineImg: function (test) {
    var task = 'inlineImg';
    grunt.util.spawn({
      grunt: true,
      args: ['--no-color', task]
    }, function (error, result) {
      test.expect(1);
      test.ok(task === result.stdout.match(/running "(.+)" task/i)[1], result.stdout);
      test.done();
    });
  },
  sprites: function (test) {
    var task = 'sprites';
    grunt.util.spawn({
      grunt: true,
      args: ['--no-color', task]
    }, function (error, result) {
      test.expect(1);
      test.ok(task === result.stdout.match(/running ".+?" \((.+?)\) task/i)[1], result.stdout);
      test.done();
    });
  }
};
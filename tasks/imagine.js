/*
 * grunt-imagine
 * http://asciidisco.github.com/grunt-imagine/
 *
 * Copyright (c) 2012 asciidisco
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('imagine', 'Your task description goes here.', function() {
    grunt.log.write(grunt.helper('imagine'));
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('imagine', function() {
    return 'imagine!!!';
  });

};

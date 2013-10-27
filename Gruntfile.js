'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      all: ['test/**/*.js']
    },
    jshint: {
      files: ['Gruntfile.js', 'tasks/**/*.js', 'lib/**/*.js', '<%= nodeunit.all %>'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['test'],
      options: {
        interrupt: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Load local tasks.
//  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['jshint', 'nodeunit']);

  grunt.registerTask('default', ['test']);

};

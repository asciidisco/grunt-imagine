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
    },
    pngmin: {
      src: ['test/**/*.png'],
      dest: 'test/out'
    },
    gifmin: {
      src: ['test/**/*.gif'],
      dest: 'test/out'
    },
    jpgmin: {
      src: ['test/**/*.{jpg,jpeg,jpe}'],
      dest: 'test/out',
      quality: 80 // use lossy JPEG compression at 80% quality
    },
    pngnq: {
      src: ['test/**/icons*.png'],
      dest: 'test/out'
    },
    inlineImg: {
      src: ['test/**/*.css', 'test/**/*.html'],
      ie8: false,
      base: 'test',
      dest: 'test/out'
    },
    sprites: {
      icons36: {
        src: ['test/out/img/icons36/*.png'],
        css: 'test/out/css/icons36.css',
        map: 'test/out/img/icons36.png',
        dimensions: true
      },
      icons36_scss: {
        src: ['test/out/img/icons36/*.png'],
        css: 'test/out/scss/icons36.scss',
        map: 'test/out/img/icons36_scss.png',
        output: 'scss',
        dimensions: false
      },
      icons36_sass: {
        src: ['test/out/img/icons36/*.png'],
        css: 'test/out/sass/icons36.sass',
        map: 'test/out/img/icons36_sass.png',
        output: 'sass'
      },
      icons36_less: {
        src: ['test/out/img/icons36/*.png'],
        css: 'test/out/less/icons36.less',
        map: 'test/out/img/icons36_less.png',
        output: 'less'
      },
      icon36_stylus: {
        src: ['test/out/img/icons36/*.png'],
        css: 'test/out/stylus/icons36.styl',
        map: 'test/out/img/icons36_stylus.png',
        output: 'stylus'
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Load local tasks.
  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['jshint', 'nodeunit']);

  grunt.registerTask('default', ['test']);

};

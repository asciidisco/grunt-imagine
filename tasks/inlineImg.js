var fs      = require('fs'),
    path    = require('path');

module.exports = function(grunt) {
    var _ = grunt.utils._;

    grunt.registerTask('inlineImg', 'Inlines images as base64 strings in html and css files', function () {
        var config = grunt.config('inlineImg'),
        dest = config.dest,
        files = grunt.file.expandFiles(config.src);

        files.forEach(function (file) {
            var extname = path.extname(file),
            fileWriter = function (file, fileContents) {
                fs.writeFileSync(file, fileContents, 'utf-8');
            };

            // inline images in css files
            if (extname === '.css') {
                grunt.helper('inline_images_css', file, config, fileWriter);
            }

            // inline images in html files
            if (extname === '.htm' || extname === '.html') {
                grunt.helper('inline_images_html', file, config, fileWriter);
            }
        });
    });

};
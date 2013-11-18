var fs      = require('fs'),
    path    = require('path'),
    mime    = require('mime'),
    _       = require('lodash'),
    cheerio = require('cheerio');

module.exports = function(grunt) {

    // inline images as base64 in css files
    var inline_images_css = function(cssFile, config, cb) {
        var imgRegex = /url\s?\(['"]?(.*?)(?=['"]?\))/gi,
            css = null,
            img = null,
            inlineImgPath = null,
            imgPath = null,
            base = _.isUndefined(config.base) ? '' : config.base,
            processedImages = 0,
            match = [],
            mimetype = null;

        // read css file contents
        css = fs.readFileSync(cssFile, 'utf-8');

        // find all occurences of images in the css file
        while (match = imgRegex.exec(css)) {
            imgPath = path.join(path.dirname(cssFile), match[1]);
            inlineImgPath = imgPath;

            // remove any query params from path (for cache busting etc.)
            if (imgPath.lastIndexOf('?') !== -1) {
                inlineImgPath = imgPath.substr(0, imgPath.lastIndexOf('?'));
            }
            // make sure that were only importing images
            if (path.extname(inlineImgPath) !== '.css') {
                try {
                    // try to load the file without a given base path,
                    // if that doesn´t work, try with
                    try {
                        img = fs.readFileSync(inlineImgPath, 'base64');
                    } catch (err) {
                        img = fs.readFileSync(base + '/' + path.basename(inlineImgPath), 'base64');
                    }

                    // replace file with bas64 data

                    mimetype = mime.lookup(inlineImgPath);

                    // check file size and ie8 compat mode
                    if (img.length > 32768 && config.ie8 === true) {
                        // i hate to write this, but can´t wrap my head around
                        // how to do this better: DO NOTHING
                    } else {
                        css = css.replace(match[1], 'data:' + mimetype + ';base64,' + img);
                        processedImages++;
                    }
                } catch (err) {
                    // Catch image file not found error
                    grunt.verbose.error('Image file not found: ' + match[1]);
                }
            }
        }

        // check if a callback is given
        if (_.isFunction(cb)) {
            grunt.log.ok('Inlined: ' + processedImages + ' Images in file: ' + cssFile);
            cb(cssFile, css);
        }
    };

    // inline images as base64 in html files
    var inline_images_html = function(htmlFile, config, cb) {
        var html = fs.readFileSync(htmlFile, 'utf-8'),
            processedImages = 0,
            $ = cheerio.load(html);

        // grab all <img/> elements from the document
        $('img').each(function (idx, elm) {
            var src = $(elm).attr('src'),
                imgPath = null,
                img = null,
                mimetype = null,
                inlineImgPath = null;

            // check if the image src is already a data attribute
            if (src.substr(0, 5) !== 'data:') {
                // figure out the image path and load it
                inlineImgPath = imgPath = path.join(path.dirname(htmlFile), src);
                img = fs.readFileSync(imgPath, 'base64');

                mimetype = mime.lookup(inlineImgPath);

                // check file size and ie8 compat mode
                if (img.length > 32768 && config.ie8 === true) {
                    // i hate to write this, but can´t wrap my head around
                    // how to do this better: DO NOTHING
                } else {
                    $(elm).attr('src', 'data:' + mimetype + ';base64,' + img);
                    processedImages++;
                }
            }

        });
        html = $.html();

        // check if a callback is given
        if (_.isFunction(cb)) {
            grunt.log.ok('Inlined: ' + processedImages + ' Images in file: ' + htmlFile);
            cb(htmlFile, html);
        }
    };

    grunt.registerTask('inlineImg', 'Inlines images as base64 strings in html and css files', function () {
        var config = grunt.config('inlineImg'),
        files = grunt.file.expand({filter: 'isFile'}, config.src);

        files.forEach(function (file) {
            var extname = path.extname(file),
            fileWriter = function (file, fileContents) {
                fs.writeFileSync(file, fileContents, 'utf-8');
            };

            // inline images in css files
            if (extname === '.css') {
                inline_images_css(file, config, fileWriter);
            }

            // inline images in html files
            if (extname === '.htm' || extname === '.html') {
                inline_images_html(file, config, fileWriter);
            }
        });
    });

};

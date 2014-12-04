var fs      = require('fs'),
    path    = require('path'),
    spawn   = require('child_process').spawn,
    phantomjs = require('phantomjs'),
    binPath = phantomjs.path,
    async   = require('async'),
    _       = require('lodash');

module.exports = function(grunt) {

    // generates png sprite maps and corresponding css files
    grunt.registerMultiTask('sprites', 'Generate sprite maps and css files from png images', function () {
        var done = this.async(),
            images = _.filter(grunt.file.expand(this.data.src), function (file) {
                return path.extname(file) === ".png";
            }),
            processedImageFiles = [],
            cssFile = this.data.css,
            spriteMap = this.data.map,
            staticImagePath = this.data.staticImagePath,
            margin = !_.isUndefined(this.data.margin) ? parseInt(this.data.margin, 10) : 0,
            externalData = '',
            classPrefix = _.isUndefined(this.data.classPrefix) ? '' : this.data.classPrefix,
            output = !_.isUndefined(this.data.output) ? this.data.output.toLowerCase() : "css",
            addSize = !!this.data.dimensions;

        // check if the margin setting is a number
        if (_.isNaN(margin)) {
            margin = 0;
        }

        // load all files that should be sprited
        async.map(images, function (image, done) {
            // read image file contents
            fs.readFile(image, function (err, data) {
                if (err) {
                    return done(err);
                }
                processedImageFiles.push(image);
                done(null, {file: image, data: data.toString('base64')});
            });
        }, function (err, images) {
            if (err) {
                throw new Error(err);
            }
            runSpriteGenerator(images);
        });

        function generateBackgroundImagePath () {
            var imagePath = path.relative(path.dirname(cssFile), spriteMap);

            // check if the user registered a static path for images in the config
            if (!!staticImagePath) {
                imagePath = staticImagePath + path.sep + spriteMap;
            }

            if (path.sep === "\\"){
                imagePath = imagePath.replace(/\\/g, "/");
            }

            return imagePath;
        }

        function generateCSSFile (imageData, images) {
            var imageClasses = '',
                fileContents = '';

            images.forEach(function (image, idx) {
                if (idx > 0) {
                    imageClasses += ', ';
                }
                imageClasses += '.' + (classPrefix === '' ? '' : classPrefix + '-') + path.basename(image.file, '.png');
            });

            fileContents += imageClasses + ' {' + '\n' + '    background: url("' + generateBackgroundImagePath() + '") no-repeat;\n' + '}\n\n';
            imageData.images.forEach(function (meta, idx) {
                fileContents += '.' + (classPrefix === '' ? '' : classPrefix + '-') + path.basename(images[idx].file, '.png') +
                    ' {\n' +
                    (addSize && '    width: ' + intToPixel(meta.width) + ';\n' || '') +
                    (addSize && '    height: ' + intToPixel(meta.height) + ';\n' || '') +
                    '    background-position: 0 ' + intToPixel(-meta.offsetY) + ';\n' +
                    '}\n\n';
            });

            return fileContents;
        }

        function generateSASSFile (imageData, images, placeholder, scssSyntax) {
            var fileContents = '',
                colon = (scssSyntax ? ';' : '') + '\n';

            fileContents += "%" + placeholder + (scssSyntax ? ' {' : '') + '\n' + '    background: url("' + generateBackgroundImagePath() + '") no-repeat' + (scssSyntax ? ';\n }' : '') + '\n\n';
            imageData.images.forEach(function (meta, idx) {
                fileContents += '%' + (classPrefix === '' ? '' : classPrefix + '-') + path.basename(images[idx].file, '.png') +
                    (scssSyntax ? ' {' : '') + '\n' +
                        '    @extend ' + '%' + placeholder + colon +
                        (addSize && '    width: ' + intToPixel(meta.width) + colon || '') +
                        (addSize && '    height: ' + intToPixel(meta.height) + colon || '') +
                        '    background-position: 0 ' + intToPixel(-meta.offsetY) + colon +
                    (scssSyntax ? '}' : '') + '\n\n';
            });

            return fileContents;
        }

        //TODO: Convert to mixins when extending mixins is supported (https://github.com/less/less.js/issues/1177)
        function generateLESSFile (imageData, images, placeholder) {
            var fileContents = '';

            fileContents += "." + placeholder + ' {\n' + '    background: url("' + generateBackgroundImagePath() + '") no-repeat;\n }'  + '\n\n';
            imageData.images.forEach(function (meta, idx) {
                fileContents += '.' + (classPrefix === '' ? '' : classPrefix + '-') + path.basename(images[idx].file, '.png') +
                    ':extend(.' + placeholder + ') {\n' +
                    (addSize && '    width: ' + intToPixel(meta.width) + ';\n' || '') +
                    (addSize && '    height: ' + intToPixel(meta.height) + ';\n' || '') +
                    '    background-position: 0 ' + intToPixel(-meta.offsetY) + ';\n' +
                    '}\n\n';
            });

            return fileContents;
        }

        function generateStylusFile (imageData, images, placeholder) {
            var fileContents = '';

            fileContents += '$' + placeholder + '\n  background: url("' + generateBackgroundImagePath() + '") no-repeat\n\n';
            imageData.images.forEach(function (meta, idx) {
                fileContents += '$' + (classPrefix === '' ? '' : classPrefix + '-') + path.basename(images[idx].file, '.png') +
                    '\n  @extend $' + placeholder +
                    (addSize && '\n  width: ' + intToPixel(meta.width) || '') +
                    (addSize && '\n  height: ' + intToPixel(meta.height) || '') +
                    '\n  background-position: 0 ' + intToPixel(-meta.offsetY) + '\n\n';
            });

            return fileContents;
        }

        function intToPixel (int) {
            return int !== 0 ? int + 'px' : 0;
        }

        function runSpriteGenerator (images) {
            // spawn a phantom js process
            var ps = spawn(binPath, ['--web-security=no', path.resolve(__dirname, '../lib/phantomspriter.js')]);
            ps.stdin.setEncoding('utf8');
            ps.stdin.write(JSON.stringify({'images': images, 'spacing': margin}));
            ps.stdin.end();

            // listen to the processes data stream & copy it
            // kill the process if the '<<<<ENDIMAGE' stop sequence is transmitted
            ps.stdout.on('data', function (data) {
                externalData += data;
                if (externalData.search('<<<<ENDIMAGE') !== -1) {
                    ps.kill();
                }
            });

            // parse the base64 data coming from the phantom process
            // and generate the sprite image & css file
            ps.on('exit', function (code) {
                var incomingData = JSON.parse(externalData.replace('<<<<ENDIMAGE', '')),
                    dataBuffer = new Buffer(incomingData.image.replace(/^data:image\/png;base64,/, ''), 'base64'),
                    placeHolder = path.basename(cssFile).replace(".", "_"),
                    stylesData;

                // check if phantom could be called
                if (code === 127) {
                    grunt.log.errorlns(
                      'In order for this task to work properly, PhantomJS must be ' +
                      'installed and in the system PATH (if you can run "phantomjs" at' +
                      ' the command line, this task should work). Unfortunately, ' +
                      'PhantomJS cannot be installed automatically via npm or grunt. ' +
                      'See the grunt FAQ for PhantomJS installation instructions: ' +
                      'https://github.com/cowboy/grunt/blob/master/docs/faq.md'
                    );
                    grunt.warn('PhantomJS not found.', code);
                } else {
                    if (!fs.existsSync(path.dirname(spriteMap))){
                        fs.mkdirSync(path.dirname(spriteMap));
                    }

                    if (!fs.existsSync(path.dirname(cssFile))){
                        fs.mkdirSync(path.dirname(cssFile));
                    }

                    switch (output){
                        case "scss":
                            stylesData = generateSASSFile(incomingData.meta, images, placeHolder, true);
                            break;
                        case "sass":
                            stylesData = generateSASSFile(incomingData.meta, images, placeHolder);
                            break;
                        case "less":
                            stylesData = generateLESSFile(incomingData.meta, images, placeHolder);
                            break;
                        case "stylus":
                            stylesData = generateStylusFile(incomingData.meta, images, placeHolder);
                            break;
                        default:
                            stylesData = generateCSSFile(incomingData.meta, images);
                            break;
                    }

                    // write image file
                    fs.writeFile(spriteMap, dataBuffer);

                    // write css file
                    fs.writeFile(cssFile, stylesData, done);

                    // output user notification
                    grunt.log.ok('Generated image: ' + spriteMap + ' & CSS file: ' + cssFile);
                }
            });
        }

    });

};

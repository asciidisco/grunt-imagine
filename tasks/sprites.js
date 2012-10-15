var fs      = require('fs'),
    path    = require('path'),
    which   = require('which'),
    util    = require('util'),
    spawn   = require('child_process').spawn,
    async   = require('async');

module.exports = function(grunt) {
    var _ = grunt.utils._;

    // generates png sprite maps and corresponding css files
    grunt.registerMultiTask('sprites', 'Generate sprite maps and css files from png images', function () {
        var done = this.async(),
            images = _.filter(grunt.file.expand(this.data.src), function (file) {
                return path.extname(file) === ".png";
            }),
            processedImageFiles = [],
            cssFile =  this.data.css,
            spriteMap = this.data.map,
            margin = !_.isUndefined(this.data.margin) ? parseInt(this.data.margin, 10) : 0,
            base = _.isUndefined(this.data.base) ? '' : this.data.base,
            externalData = '',
            classPrefix = _.isUndefined(this.data.classPrefix) ? '' : this.data.classPrefix,
            relativeAssets = _.isUndefined(this.data.relativeAssets) ? true : !!(this.data.relativeAssets),
            pathSeparator = process.platform === 'win32' ? '\\' : '/';

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
                done(null, data.toString('base64'));
            });
        }, function (err, images) {
            if (err) {
                throw new Error(err);
            }

            runSpriteGenerator(images);
        });

        function generateCSSFile (imageData, images) {
            var imageClasses = '',
                fileContents = '',
                pathParts = [],
                spritePathsParts = [],
                cssPathParts = [];

            images.forEach(function (image, idx) {
                if (idx > 0) {
                    imageClasses += ', ';
                }
                imageClasses += '.' + (classPrefix === '' ? '' : classPrefix + '-') + path.basename(image, '.png');
            });

            spritePathsParts = spriteMap.split(pathSeparator);
            cssPathParts = cssFile.split(pathSeparator);

            spritePathsParts.forEach(function (pathPart, idx) {
                if (pathPart !== cssPathParts[idx]) {
                    pathParts.push(pathPart);
                }
            });

            fileContents += imageClasses + ' {' + '\n' + '    background: url("../' + pathParts.join('/') + '") no-repeat;\n' + '}\n\n';
            imageData.heights.forEach(function (height, idx) {
                fileContents += '.' + (classPrefix === '' ? '' : classPrefix + '-') + path.basename(images[idx], '.png') + ' {\n' + '    background-position: 0 ' +  (height - imageData.maxheight) + 'px;\n' + '}\n\n';
            });

            return fileContents;
        }

        function runSpriteGenerator (images) {
            // spawn a phantom js process
            var ps = spawn('phantomjs', ['--web-security=no', fs.realpathSync(__dirname + '/../lib/phantomspriter.js'), JSON.stringify({'images': images, 'spacing': margin})]);

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
                    dataBuffer = new Buffer(incomingData.image.replace(/^data:image\/png;base64,/, ''), 'base64');

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
                    // write image file
                    fs.writeFile(spriteMap, dataBuffer, done);

                    // write css file
                    fs.writeFile(cssFile, generateCSSFile(incomingData, processedImageFiles), done);

                    // output user notification
                    grunt.log.ok('Generated image: ' + spriteMap + ' & CSS file: ' + cssFile);
                }
            });
        }

    });

};

var fs      = require('fs'),
    path    = require('path'),
    mkdirp  = require('mkdirp'),
    jQuery  = require('jQuery'),
    mime    = require('mime');

// Helpers for image tasks

module.exports = function(grunt) {
    var _ = grunt.utils._;

    // inline images as base64 in css files
    grunt.registerHelper('inline_images_css', function(cssFile, config, cb) {
        var imgRegex = /url\s?\(['"]?(.*?)(?=['"]?\))/gi,
            css = null,
            img = null,
            ext = null,
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
    });

    // inline images as base64 in html files
    grunt.registerHelper('inline_images_html', function(htmlFile, config, cb) {
        var html = fs.readFileSync(htmlFile, 'utf-8'),
            processedImages = 0;

        // grab all <img/> elements from the document
        jQuery(html).find('img').each(function (idx, elm) {
            var src = jQuery(elm).attr('src'),
                imgPath = null,
                img = null,
                ext = null,
                mimetype = null,
                inlineImgPath = null;

            // check if the image src is already a data attribute
            if (src.substr(0, 5) !== 'data:') {
                // figure out the image path and load it
                imgPath = path.join(path.dirname(htmlFile), src);
                img = fs.readFileSync(imgPath, 'base64');

                mimetype = mime.lookup(inlineImgPath);

                // check file size and ie8 compat mode
                if (img.length > 32768 && config.ie8 === true) {
                    // i hate to write this, but can´t wrap my head around
                    // how to do this better: DO NOTHING
                } else {
                    html = html.replace(src, 'data:' + mimetype + ';base64,' + img);
                    processedImages++;
                }
            }

        });

        // check if a callback is given
        if (_.isFunction(cb)) {
            grunt.log.ok('Inlined: ' + processedImages + ' Images in file: ' + htmlFile);
            cb(htmlFile, html);
        }
    });

    // helper that outputs if executables are missing
    grunt.registerHelper('no tool installed', function(tools, task, cb) {
        grunt.verbose.or.writeln();
        grunt.log.write('Running ' + _.pluck(tools, 'executable').join(', ') + '...').error();

        grunt.log.errorlns([
            'In order for this task to work properly, one of these tools ":tools" must be',
            'installed and in the system PATH (if you can run one of these commands ":tools" at',
            'the command line, this task should work)'
            ].join(' ').replace(/:tools/g, _.pluck(tools, 'executable').join(', ')));

        grunt.log.subhead(('Skiping {{task}} task').replace('{{task}}', task));

        // execute callback if given
        if(_.isFunction(cb)) {
            cb();
        }
    });

    // helper for batch processing a couple of files with a list of available tools
    grunt.registerHelper('process_image_files', function(tools, files, dest, task, done) {
        var toolsToProcessInf = _.compact(_.map(tools, function (tool) {
                    if (tool.isAvailable === true) {
                        return tool;
                    }
                })),
            toolsToProcess = _.pluck(toolsToProcessInf, 'executable'),
            numberOfTools = toolsToProcess.length,
            numberOfFiles = files.length,
            processableFiles = [],
            processableTools = [],
            uncompressedFileSizes = {},
            compressedFileSizes = {},
            processFinished = null,
            processNextFile = null,
            processNextTool = null,
            checkMakeDir = null,
            currentFilesInProcess = {},
            pathSeparator = process.platform === 'win32' ? '\\' : '/';


        // check if there are usable tools
        if (numberOfTools === 0) {
            grunt.helper('no tool installed', tools, task, done);
        }

        processFinished = function () {
            var overallSizeCompressed = 0,
                overallSizeUncompressed = 0;

            _.each(uncompressedFileSizes, function (uncompressedSize, file) {
                overallSizeCompressed += compressedFileSizes[file];
                overallSizeUncompressed += uncompressedSize;
            });

            currentFilesInProcess = {};
            grunt.log.ok('Compressed ' + files.length + ' files');
            grunt.log.ok('Uncompressed size: ' + (Math.round((overallSizeUncompressed / 1024) * 100) / 100) + 'kb, Compressed size: ' + (Math.round((overallSizeCompressed / 1024) * 100) / 100) + 'kb, Savings: ' + (Math.round((100 - (overallSizeCompressed / overallSizeUncompressed * 100)) * 100) / 100)  + '%');
            done();
        };

        processNextFile = function (idx, file, fileOutput) {
            if (compressedFileSizes[file] > uncompressedFileSizes[file]) {
                compressedFileSizes[file] = uncompressedFileSizes[file];
                fs.writeFileSync(fileOutput, currentFilesInProcess[file]);
            }


            if (!_.isUndefined(processableFiles[idx + 1])) {
                processableFiles[idx + 1]();
            } else {
                processFinished();
            }
        };

        processNextTool = function (idx, toolId, file, fileOutput) {
            if (!_.isUndefined(processableTools[toolId + 1])) {
                processableTools[toolId + 1](idx, file, fileOutput);
            } else {
                setTimeout(function() {
                    compressedFileSizes[file] = String(fs.readFileSync(fileOutput)).length;
                    processNextFile(idx, file, fileOutput);
                }, 20);
            }
        };

        // check if folder exists else create
        checkMakeDir = function (dir) {
            try {
                var stats = fs.lstatSync(dir);
                if (!stats.isDirectory()) {
                    mkdirp(dir);
                }
            } catch (e) {
                mkdirp(dir);
            }
        };

        // generate list of files to process
        files.forEach(function (file, idx) {
            var normalizedFile = path.normalize(file),

            fileOutput = path.normalize(dest + normalizedFile.substr(normalizedFile.indexOf(pathSeparator))),
            dir = path.dirname(fileOutput);

            currentFilesInProcess[file] = fs.readFileSync(file);
            uncompressedFileSizes[file] = String(currentFilesInProcess[file]).length;

            checkMakeDir(dir);
            processableFiles.push(function () {
                processNextTool(idx, -1, file, fileOutput);
            });
        });

        // build processable tool stack
        toolsToProcess.forEach(function (tool, toolId) {

            processableTools.push(function (idx, file, fileOutput) {
                var flags = _.map(toolsToProcessInf[toolId].flags, function (flag) {
                    var remappedFlags = '';

                    switch (flag) {
                        case '<inputFile>':
                            remappedFlags = (toolId !== 0 ? fileOutput : file);
                            break;
                        case '<outputFile>':
                            remappedFlags = fileOutput;
                            break;
                        case '<outputFolder>':
                            remappedFlags = path.dirname(fileOutput);
                            break;
                        default:
                            remappedFlags = flag;
                            break;
                    }
                return remappedFlags;
            });

            var ls = grunt.utils.spawn({
                    cmd: tool,
                    args: flags
                }, function (error, result, code) {
                    var targetFileExists = null;
                    if (error !== null) {
                        try {
                            targetFileExists = fs.readFileSync(fileOutput) ? true : false;
                        } catch (e) {
                            targetFileExists = false;
                        }
                    }
                    if (error && !targetFileExists) {
                        grunt.file.copy(file, fileOutput);
                        processNextTool(idx, toolId, file, fileOutput);
                    } else {
                        if (tool === 'pngnq') {
                            grunt.file.copy(file.replace('.png', '') + '-nq8.png', fileOutput);
                            fs.unlinkSync(file.replace('.png', '') + '-nq8.png');
                            processNextTool(idx, toolId, file, fileOutput);
                        } else {
                            processNextTool(idx, toolId, file, fileOutput);
                        }
                    }
                });

            });
        });

        // kick off file processing
        if (files.length === 0) {
            grunt.log.ok('No matching files found!');
            done();
        } else {
            processNextFile(-1, files[-1]);
        }

  });

};

var fs      = require('fs'),
    path    = require('path'),
    _       = require('lodash');

// Helpers for image tasks

module.exports = function(grunt) {
    var exports = {};

    // helper that outputs if executables are missing
    exports.noToolInstalled = function(tools, task, cb) {
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
    };

    // helper for batch processing a couple of files with a list of available tools
    exports.processImageFiles = function(tools, files, dest, quality, task, done) {
        var toolsToProcessInf = _.compact(_.map(tools, function (tool) {
                    if (tool.isAvailable === true) {
                        return tool;
                    }
                })),
            toolsToProcess = _.pluck(toolsToProcessInf, 'executable'),
            numberOfTools = toolsToProcess.length,
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
            exports.noToolInstalled(tools, task, done);
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
            grunt.verbose.writeln("Compressing: " + file + " -> " + fileOutput);
            grunt.verbose.writeln("Original size: " + uncompressedFileSizes[file] + ", Compressessed size:" +  compressedFileSizes[file]);
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
                    grunt.file.mkdir(dir);
                }
            } catch (e) {
                grunt.file.mkdir(dir);
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
                        case '<quality>':
                            remappedFlags = quality ? '-m'+quality : '';
                            break;
                        default:
                            remappedFlags = flag;
                            break;
                    }
                return remappedFlags;
            });

            grunt.util.spawn({
                    cmd: tool,
                    args: flags
                }, function (error /*, result, code */) {
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
    };
    return exports;
};

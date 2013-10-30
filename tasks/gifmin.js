var path    = require('path'),
    which   = require('which'),
    _       = require('lodash'),
    helpers = require('../lib/helpers');

module.exports = function(grunt) {
    var processImageFiles = helpers(grunt).processImageFiles;

    // list of all executable gif optimizers 
    var gifTools = [{
            executable: 'gifsicle',
            isAvailable: false,
            flags: ['-O2', '<inputFile>', '-o', '<outputFile>']
        }];

    var gif = ['.gif'];

    // rev task - reving is done in the `output/` directory
    grunt.registerTask('gifmin', 'Optimizes .gif images', function () {
        var config = grunt.config('gifmin'),
            dest = config.dest,
            done = this.async(),
            gifToolsLookedUp = 0,
            gifToolsToCheck = gifTools.length,
            files = grunt.file.expand({filter: 'isFile'}, config.src),
            gifFiles = files.filter(function(file) {
              return !!~gif.indexOf(path.extname(file).toLowerCase());
            });

        // collect informations about which gif optimizers
        // are available on the system
        gifTools.forEach(function (tool, idx) {
            which(tool.executable, function (err, info) {
                if (!_.isUndefined(info)) {
                    gifTools[idx].isAvailable = true;
                }

                gifToolsLookedUp++;

                if (gifToolsLookedUp === gifToolsToCheck) {
                    processImageFiles(gifTools, gifFiles, dest, '', 'gifmin', done);
                }
            });
        });
    });
};

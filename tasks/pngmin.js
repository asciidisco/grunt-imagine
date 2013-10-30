var path    = require('path'),
    which   = require('which'),
    _       = require('lodash'),
    helpers = require('../lib/helpers');

// This task takes care of img optimizations by running a set of
// `.png` optimizers.


module.exports = function(grunt) {
    var processImageFiles = helpers(grunt).processImageFiles;

    // list of all executable png optimization tools 
    var pngTools = [{
            executable: 'pngcrush',
            isAvailable: false,
            flags: ['-reduce', '-brute', '-l', '9', '<inputFile>', '<outputFile>']          
        },{
            executable: 'pngout',
            isAvailable: false,
            flags: ['<inputFile>', '<outputFile>', '-force', '-s0', '-ks', '-kp', '-f6', '-r', '-y']
        },{
            executable: 'optipng',
            isAvailable: false,
            flags: ['<inputFile>', '-out', '<outputFile>']
        },{
            executable: 'cryopng',
            isAvailable: false,
            flags: ['-o7', '<inputFile>', '<outputFile>']
        },{
            executable: 'advpng',
            isAvailable: false,
            flags: ['-4', '-z', '<inputFile>', '<outputFile>']          
        },{
            executable: 'huffmix',
            isAvailable: false,
            flags: ['<inputFile>', '<outputFile>']          
        }];
        
    // list of file types, each optimizer can process
    var png = ['.png', '.bmp', '.pnm', '.tiff'];

    grunt.registerTask('pngmin', 'Optimizes .png images', function () {
        var config = grunt.config('pngmin'),
            dest = config.dest,
            done = this.async(),
            pngToolsLookedUp = 0,
            pngToolsToCheck = pngTools.length,
            files = grunt.file.expand({filter: 'isFile'}, config.src),
            pngfiles = files.filter(function(file) {
                return !!~png.indexOf(path.extname(file).toLowerCase());
            });

        // collect informations about which png optimizers
        // are available on the system
        pngTools.forEach(function (tool, idx) {
            which(tool.executable, function (err, info) {
                if (!_.isUndefined(info)) {
                    pngTools[idx].isAvailable = true;
                }

                pngToolsLookedUp++;

                if (pngToolsLookedUp === pngToolsToCheck) {
                    processImageFiles(pngTools, pngfiles, dest, '', 'pngmin', done);
                }
            });
        });

    });

};

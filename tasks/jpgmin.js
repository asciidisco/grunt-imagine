var fs      = require('fs'),
    path    = require('path'),
    which   = require('which');

module.exports = function(grunt) {
    var _ = grunt.utils._;

    // list of all executable jpeg optimizers
    var jpgTools = [{
            executable: 'jpegoptim',
            isAvailable: false,
            flags: ['-f', '--strip-all', '<inputFile>', '<outputFolder>']
        }, {
            executable: 'jpegtran',
            isAvailable: false,
            flags: ['-copy', 'none', '-optimize', '-progressive', '-outfile', '<outputFile>', '<inputFile>']
        }, {
            executable: 'jpegrescan',
            isAvailable: false,
            flags: ['<inputFile>', '<outputFile>']
        }];


    var jpg = ['.jpg', '.jpeg'];

	// rev task - reving is done in the `output/` directory
	grunt.registerTask('jpgmin', 'Optimizes .jpg images', function () {
		var config = grunt.config('jpgmin'),
			dest = config.dest,
			done = this.async(),
			jpgToolsLookedUp = 0,
			jpgToolsToCheck = jpgTools.length,
			files = grunt.file.expandFiles(config.src),
			jpgfiles = files.filter(function(file) {
				return !!~jpg.indexOf(path.extname(file).toLowerCase());
			});

		// collect informations about which png optimizers
		// are available on the system
		jpgTools.forEach(function (tool, idx) {
			which(tool.executable, function (err, info) {
				if (!_.isUndefined(info)) {
					jpgTools[idx].isAvailable = true;
				}

				jpgToolsLookedUp++;

				if (jpgToolsLookedUp === jpgToolsToCheck) {
					grunt.helper('process_image_files', jpgTools, jpgfiles, dest, 'jpgmin', done);
				}
			});
		});
	});

};
var fs      = require('fs'),
    path    = require('path'),
    which   = require('which');    

module.exports = function(grunt) {
    var _ = grunt.utils._;

    // list of all executable gif optimizers 
    var gifTools = [{
            executable: 'gifsicle',
            isAvailable: false,
            flags: ['-O2', '<inputFile>', '-outfile', '<outputFile>']
        }];

    var gif = ['.gif'];

	// rev task - reving is done in the `output/` directory
	grunt.registerTask('gifmin', 'Optimizes .gif images', function () {
		var config = grunt.config('gifmin'),
			dest = config.dest,
			done = this.async(),
			gifToolsLookedUp = 0,
			gifToolsToCheck = gifTools.length,
			files = grunt.file.expandFiles(config.src),
			giffiles = files.filter(function(file) {
				return !!~gif.indexOf(path.extname(file).toLowerCase());
			});

		// collect informations about which png optimizers
		// are available on the system
		gifTools.forEach(function (tool, idx) {
			which(tool.executable, function (err, info) {
				if (!_.isUndefined(info)) {
					gifTools[idx].isAvailable = true;
				}

				gifToolsLookedUp++;

				if (gifToolsLookedUp === gifToolsToCheck) {
					grunt.helper('process_image_files', gifTools, giffiles, dest, 'gifmin', done);
				}
			});
		});

	});

};
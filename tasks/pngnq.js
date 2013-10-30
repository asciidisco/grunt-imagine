var path    = require('path'),
    which   = require('which'),
    _       = require('lodash'),
    helpers = require('../lib/helpers');

module.exports = function(grunt) {
    var processImageFiles = helpers(grunt).processImageFiles;

    // list of all executable tools for png quantifying
    var pngQuant = [{
            executable: 'pngnq',
            isAvailable: false,
            flags: ['<inputFile>']
        }];

    // list of file types, each optimizer can process
    var png = ['.png', '.bmp', '.pnm', '.tiff'];

	// rev task - reving is done in the `output/` directory
	grunt.registerTask('pngnq', 'Converts .png images', function() {
		var config = grunt.config('pngnq'),
			dest = config.dest,
			done = this.async(),
			pngToolsLookedUp = 0,
			pngToolsToCheck = pngQuant.length,
			quantToolFound = false,
			files = grunt.file.expand({filter: 'isFile'}, config.src),
			pngFiles = files.filter(function(file) {
				return !!~png.indexOf(path.extname(file).toLowerCase());
			});

		// collect informations about which png optimizers
		// are available on the system
		pngQuant.forEach(function (tool, idx) {
			which(tool.executable, function (err, info) {
				if (!_.isUndefined(info)) {
					pngQuant[idx].isAvailable = true;
					quantToolFound = true;
				}

				pngToolsLookedUp++;

				if (pngToolsLookedUp === pngToolsToCheck) {
					processImageFiles(pngQuant, pngFiles, dest, '', 'pngnq', done);
				}
			});
		});
	});

};

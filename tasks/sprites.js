var util  = require('util'),
	fs = require('fs'),
	path = require('path'),
    spawn = require('child_process').spawn,
    filesRead = 0,
    allImages = [],
    spacing = 5,
    externalData = '',
    cssFile = 'out.css',
    spriteFile = 'out.png',
    imageFolder = 'img/icons36',
    processedImageFiles = [];

fs.readdir(imageFolder, function (err, files) {
	var fileslength = files.length;
	files.forEach(function (file) {
		if (path.extname(file) === '.png') {
			fs.readFile(imageFolder + '/' + file, function (err, data) {
				filesRead++;
				allImages.push(data.toString('base64'));
				processedImageFiles.push(imageFolder + '/' + file);
				if (filesRead === (fileslength -1)) {
					runSpriteGenerator(allImages);
				}
			});
		} else {
			fileslength--;
		}
	});
});

function generateCSSFile (imageData, images) {
	var imageClasses = '';
	var fileContents = '';
	images.forEach(function (image, idx) {
		if (idx > 0) {
			imageClasses += ', ';
		}
		imageClasses += '.' + image.replace('.png', '').replace(/\//g, '_');
	});

	fileContents += imageClasses + ' {' + '\n' + '    background: url("' + spriteFile + '") no-repeat;\n' + '}\n\n'; 
	imageData.heights.forEach(function (height, idx) {
		fileContents += '.' + images[idx].replace('.png', '').replace(/\//g, '_') + ' {\n' + '    background-position: 0 ' +  (height - imageData.maxheight) + 'px;\n' + '}\n\n'; 
	});

	return fileContents;
}

function runSpriteGenerator (images) {
	var ls = spawn('phantomjs', ['--web-security=no', 'sprite.js', JSON.stringify({images: images, spacing: spacing})]);

	ls.stdout.on('data', function (data) {
		externalData += data;
		if (externalData.search('<<<<ENDIMAGE') !== -1) {
			ls.kill();
		}
	});

	ls.on('exit', function (code) {
		var incomingData = JSON.parse(externalData.replace('<<<<ENDIMAGE', ''));
		var dataBuffer = new Buffer(incomingData.image.replace(/^data:image\/png;base64,/, ''), 'base64');
		fs.writeFile(spriteFile, dataBuffer, function(err) {});
		fs.writeFile(cssFile, generateCSSFile(incomingData, processedImageFiles), function () {});
	});
}
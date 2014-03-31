/* global document */
var page = require('webpage').create();
var system = require('system');

var images = '';
//var outputJSON = {};
var inputJSON = JSON.parse(system.stdin.readLine());

inputJSON.images.forEach(function (image) {
    images += '<img src="data:image/png;base64,' + image.data + '"/>\n';
});

page.content = '<canvas id="test" rel="' + parseInt(inputJSON.spacing, 10) + '"></canvas>' + images;
page.onConsoleMessage = function (msg) {
    console.log(msg);
};

page.evaluate(function () {
    var testdraw = function () {
        var images = document.images,
            canvas = document.getElementById('test'),
            ctx = canvas.getContext('2d'),
            spriteCache = document.createElement('canvas'),
            cacheCtx = spriteCache.getContext('2d'),
            imgHeight = 0,
            imgWidth = 0,
            imgTotalHeight = 0,
            spriteHeight = 0,
            spriteWidth = 0,
            spacing = parseInt(canvas.getAttribute('rel'), 10) || 0,
            meta = { images: [] };

        // loop all images
        for (var i = 0, l = images.length; i < l; i += 1) {
            imgHeight = images[i].height;
            imgWidth = images[i].width;
            imgTotalHeight = imgHeight + (i === l - 1 ? 0 : spacing);

            spriteHeight += imgTotalHeight;
            spriteWidth = spriteWidth < imgWidth ? imgWidth : spriteWidth;

            // paint to cache
            spriteCache.setAttribute('height', spriteHeight);
            spriteCache.setAttribute('width', spriteWidth);
            cacheCtx.drawImage(canvas, 0, 0);

            // draw the real canvas
            canvas.setAttribute('height', spriteHeight);
            canvas.setAttribute('width', spriteWidth);
            ctx.drawImage(spriteCache, 0, 0);
            ctx.drawImage(images[i], 0, spriteHeight - imgTotalHeight);

            meta.images.push({
                height: imgHeight,
                width: imgWidth,
                totalHeight: imgTotalHeight,
                offsetY: spriteHeight - imgTotalHeight
            });
        }

        meta.maxHeight = spriteHeight;
        meta.maxWidth = spriteWidth;

        return JSON.stringify({image: canvas.toDataURL(), meta: meta}) + '<<<<ENDIMAGE';
    };
    setTimeout(function () {
        console.log(testdraw());
    }, 20);
});
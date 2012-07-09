var page = require('webpage').create();
var system = require('system');

var images = '';
var outputJSON = {};
var inputJSON = JSON.parse(system.args[1]);

inputJSON.images.forEach(function (image) {
    images += '<img src="data:image/png;base64,' + image + '"/>\n';
});

page.content = '<canvas id="test" rel="' + parseInt(inputJSON.spacing, 10) + '"></canvas>' + images;
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.evaluate(function() {
    var testdraw = function () {
      var maxwidth = 0;
      var maxheight = 0;
      var allHeight = 0;
      var heights = [];

      for (var i=0;i<document.images.length;i++){
          maxheight += document.images[i].height;
          if (maxwidth < document.images[i].width) {
              maxwidth = document.images[i].width;
          }
      }
        maxheight = maxheight + (document.images.length * parseInt(document.getElementById('test').getAttribute('rel'), 10));
      // Create canvas element
      canvas = document.getElementById('test');
      canvas.setAttribute('width', maxwidth);
      canvas.setAttribute('height', maxheight);
      // Loop through all images
      for (var j=0;j<document.images.length;j++){
          // Insert before the image
          var ctx = canvas.getContext('2d');
      
          // Draw image to canvas
          var beforeHeight = (j-1 === -1) ? 0 : document.images[j-1].height;
          allHeight += (beforeHeight + parseInt(canvas.getAttribute('rel'), 10));
          heights.push(allHeight);
          ctx.drawImage(document.images[j], 0, allHeight);
      }
      return JSON.stringify({image: canvas.toDataURL(), heights: heights, maxheight: maxheight}) + '<<<<ENDIMAGE';
    };
    setTimeout(function () {
        console.log(testdraw());
    }, 20);
});
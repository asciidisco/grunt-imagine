# grunt-imagine

Use [@cowboys](https://github.com/cowboy) js based optimizer [grunt](https://github.com/gruntjs/grunt) to optimize (and or inline) your projects image resources.

[![Build Status](https://secure.travis-ci.org/asciidisco/grunt-imagine.png?branch=master)](http://travis-ci.org/asciidisco/grunt-imagine)

## Getting Started

### Plugin installation
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-imagine`

Then add this line to your project's `grunt.js` gruntfile.

```javascript
grunt.loadNpmTasks('grunt-imagine');
```

### Installation of third party tools
If you want to use the pngmin, jpgmin, gifmin or pngnq tasks,
you need to have some third party tools installed & in your global PATH:

It is enough if you have one tool per task installed,
but if you provide more of them, grunt-imagine will recognize that
and will try to use them, if they´ll help to shrink the filesize.

Note: I will add more tools to the chain in the future,
if you would like to see a tool in image, ping me.

### PNG tools:
+ [pngcrush](http://pmt.sourceforge.net/pngcrush/)
+ [pngout Windows](http://advsys.net/ken/utils.htm)
+ [pngout *nix](http://www.jonof.id.au/kenutils)
+ [optipng](http://optipng.sourceforge.net/)
+ [cryopng](http://encode.ru/threads/1260-CryoPNG-short-introduction)
+ [advpng](http://advancemame.sourceforge.net/comp-download.html)
+ [huffmix](http://frdx.free.fr/huffmix/)

### GIF tools:
+ [gifsicle](http://www.lcdf.org/gifsicle/)

### JPEG tools:
+ [jpegoptim](https://github.com/glennr/jpegoptim)
+ [jpegtran](http://jpegclub.org/jpegtran/)
+ [jpegrescan](https://github.com/kud/jpegrescan)

### PNGQUANT tools:
+ [pngnq](http://pngnq.sourceforge.net/)

### Resources
+ [grunt](https://github.com/gruntjs/grunt)
+ [Getting started](https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md)

## Documentation

### pngmin task
If you would like to shrink the size (lossless) of your *.png files,
set up a src description, where to find your original *.png files
and a directory where you would like to store your optimized files.

The task will take the original directory setup from your src directories,
and will copy them over (even for subdirs).

Warning!
If the dest property is set equally to your src directory, imagine will override your files!

```javascript
pngmin: {
  src: [
    'src/*.png',
    'src/img/*.png'
  ],
  dest: 'build'
}
```

### gifmin task
If you would like to shrink the size (lossless) of your *.gif files,
set up a src description, where to find your original *.gif files
and a directory where you would like to store your optimized files.

The task will take the original directory setup from your src directories,
and will copy them over (even for subdirs).

Warning!
If the dest property is set equally to your src directory, imagine will override your files!

```javascript
gifmin: {
  src: ['src/**/*.gif'],
  dest: 'build'
}
```

### jpgmin task
If you would like to shrink the size (lossless) of your *.jpg files,
set up a src description, where to find your original *.jpg files
and a directory where you would like to store your optimized files.

The task will take the original directory setup from your src directories,
and will copy them over (even for subdirs).

Warning!
If the dest property is set equally to your src directory, imagine will override your files!

```javascript
jpgmin: {
  src: ['src/**/*.jpg'],
  dest: 'build'
}
```

If you would like to use lossy compression via `jpegoptim`'s `-m` flag, you can
add a `quality` configuration option:

```javascript
jpgmin: {
  src: ['src/**/*.jpg'],
  dest: 'build',
  quality: 80 // use lossy JPEG compression at 80% quality
}
```

### pngnq task
If you would like to quantizize your PNG images in RGBA format,
set up a src description, where to find your original *.png files
and a directory where you would like to store your optimized files.

The task will take the original directory setup from your src directories,
and will copy them over (even for subdirs).

Warning!
If the dest property is set equally to your src directory, imagine will override your files!

```javascript
pngnq: {
  src: ['src/**/icons*.png'],
  dest: 'build'
}
```

### inlineImg task
If you would like to inline your images (data:uri/base64) in your *.css or *.png files,
you can use the inlineImg task, just add a src, where imagine can
find your *.css and/or *.html files.

If you use absolute paths, use the base property to tell imagine, where
it can find your images.

If you set the ie8 flag to true, only images smaller than 32kb will be inlined.

```javascript
inlineImg: {
  src: ['src/**/*.css', 'src/**/*.html'],
  ie8: true,
  base: 'build/img',
  dest: 'build'
}
```

### sprites (multi)task
Imagine provides the ability to generate sprite maps and the
corresponding css, scss, sass, less or stylus files. At the moment, only *.png files can be processed.


```javascript
  sprites: {
      icons36: {
          src: ['src/img/icons36/*.png'],
          css: 'src/css/icons36.css',
          map: 'src/img/icons36.png'
      }
  }
```

This configuration will generate an image named icons36.png in the
'src/img' folder, which contains all of the *.png images found in the
'src/img/icons36/' folder.

Given that two matching images were found in the'src/img/icons36/' folder,
named 'MyImage1.png' and 'MyImage2.png',
the generated css file would look like this:

```css
.MyImage1, .MyImage2 {
    background: url("../img/icon36.png") no-repeat;
}

.MyImage1 {
    background-position: 0 -432px;
}

.MyImage2 {
    background-position: 0 -396px;
}
```

This task doesn´t depend on any external libraries, except for
PhantomJS, which the most of you should have installed if you´re using grunt.

#### options

##### margin

The images are be sprited vertically, so you might need to set
up some margin to give´em some space:

```javascript
  sprites: {
      icons36: {
          src: ['src/img/icons36/*.png'],
          css: 'src/css/icons36.css',
          map: 'src/img/icons36.png',
          margin: 15
      }
  }
```

Now you´re images will be places with 15 px of space between them.

##### classPrefix

You can add a prefix to every class by specifying this option

```javascript
  sprites: {
      icons36: {
          src: ['src/img/icons36/*.png'],
          css: 'src/css/icons36.css',
          map: 'src/img/icons36.png',
          classPrefix: 'Icon'
      }
  }
```

which would generate something like this:

```css
.Icon-MyImage1, .Icon-MyImage2 {
    background: url("../img/icon36.png") no-repeat;
}

.Icon-MyImage1 {
    background-position: 0 -432px;
}

.Icon-MyImage2 {
    background-position: 0 -396px;
}

```

##### output

The task has the ability to output the CSS portion in multiple format. The default format is straight CSS. However you can choose to output to SASS, SCSS, LESS or Stylus placeholders to include to your stylesheets. The possible values for this options are `css`, `scss`, `sass`, `less`, `stylus`.

For example, the following configuration:

```javascript
  sprites: {
      icons36: {
          src: ['src/img/icons36/*.png'],
          css: 'src/css/icons36.css',
          map: 'src/img/icons36.png',
          output: 'scss'
      }
  }
```

would generate something like this:

```css
%icons36 {
    background: url("../img/icon36.png") no-repeat;
}

%Icon-MyImage1 {
    @extend %icons36;
    background-position: 0 -432px;
}

%Icon-MyImage2 {
    @extend %icons36;
    background-position: 0 -396px;
}

```

##### dimensions

This will add the CSS "width" and "height" properties to the tasks' output. This setting is **false** by default.

For example, the following configuration:

```javascript
  sprites: {
      icons36: {
          src: ['test/out/img/icons36/*.png'],
          css: 'test/out/scss/icons36.scss',
          map: 'test/out/img/icons36.png',
          output: 'scss',
          dimensions: true
      }
  }
```

would generate something like this:

```css
%icons36 {
    background: url("../img/icons36.png") no-repeat;
 }

%sprite_01 {
    @extend %icons36;
    width: 32px;
    height: 32px;
    background-position: 0 0;
}

%sprite_02 {
    @extend %icons36;
    width: 48px;
    height: 48px;
    background-position: 0 -32px;
}
```

##### staticImagePath

If you want to set a specific (static) CSS output path (maybe because you´re fiddling around with your `<base href>`),
you can do so by extending the config with a `staticImagePath` like so:

```javascript
  sprites: {
      icons36: {
          src: ['src/img/icons36/*.png'],
          css: 'src/css/icons36.css',
          map: 'src/img/icons36.png',
          staticImagePath: 'public/img/'
      }
  }
```

The output would look like the following:

```css
.MyImage1, .Icon-MyImage2 {
    background: url("public/img/icon36.png") no-repeat;
}

.MyImage1 {
    background-position: 0 -432px;
}

.MyImage2 {
    background-position: 0 -396px;
}

```

## Future (TODO)
* Better documentation (Near future!)
* JS only PNG optimizing
* More JPG, PNG, GIF tools (ping me, if you knew good ones)
* Using remote services alternativly (smush.it, tinypng.org)
* GIF to PNG conversion (if smaller)

## Release History

### 0.3.51 && 0.3.52 && 0.3.53
+ Small bugfix (with big impact) for `staticImagePath` property

### 0.3.5
+ added `staticImagePath` described in [#60](https://github.com/asciidisco/grunt-imagine/issues/60)

### 0.3.42
+ bump dependencies [@alpadev] (https://github.com/alpadev)

### 0.3.41
+ bump dependencies [@alpadev] (https://github.com/alpadev)

### 0.3.4
+ Added width and height properties to the spriter output [@alpadev] (https://github.com/alpadev)
 - 85a04f58 Updates the generator functions to adopt the changes introduced to the spriter script. See #52 [@alpadev]
 - 6416c26d Rewrote most of it.. to accomplish #52 (also the old code been a lil dirty imo :)) [@alpadev]

### 0.3.3
+ Added Stylus ouput option to sprites task [Thx to @alpadev] (https://github.com/alpadev)
 - f25cb4e1 updates: README.md [@alpadev]
 - 894a7022 adds: stylus generator [@alpadev]
 - c4554cbf adds: stylus test case [@alpadev]
 - 84d20850 Don't output CSS unit for value 0 [@LaurentGoderre]

### 0.3.2
+ Replaced the jQuery dependency with Cheerio [Thx to @LaurentGoderre] (https://github.com/LaurentGoderre)
 - 3fae23c0 Added verbose logging to min tasks as per #47 [@LaurentGoderre]
 - daa8e8b7 Replaced the jQuery dependency with Cheerio to solve #28 [@LaurentGoderre]
 - b65645c6 Fixed an async problem with the spriting [@LaurentGoderre]
 - f33f2f96 Added the SCSS support documentation [@LaurentGoderre]
 - 6c8af22e Fixed the sprites background offset being output in reverse [@LaurentGoderre]

### 0.3.1
+ Added SCSS, SASS, LESS output option to sprites task [Thx to @LaurentGoderre] (https://github.com/LaurentGoderre)
  - e1699cc2 Converted the image input from command line argument to stdin input [@LaurentGoderre]
  - 6802570c Fix #34 by making the image path relative to the css path [@LaurentGoderre]
  - 526fe343 Added the sass and less example tasks [@LaurentGoderre]
  - 0cf20e7e Added the LESS output functionality [@LaurentGoderre]
  - 9ea3e851 Added SASS support [@LaurentGoderre]
  - a6afbe47 Fixed bug that prevents running multiple sprite targets [@LaurentGoderre]
  - f9d6924e Added the SCSS output option [@LaurentGoderre]
  - 61655844 Create output directories if they don't exist (required for Windows) [@LaurentGoderre]
  - d1c8fbc7 Added npm phantomjs for easier redistribution [@LaurentGoderre]

### 0.3.0
+ Now works with grunt 0.4.x thanks to the amazing work of [@alpadev](https://github.com/alpadev)
+ Fixes Issue #26, #29, #18, #11 & #19

### 0.2.2
+ Fixes Issue #5 (Thx to @dominicbarnes)

### 0.2.1
+ Fixing the travis build
+ Additions from commit #12 (@dethtron5000)
  - the mime type wasn't always properly injected into the data URI
  - the processed file counts weren't updated properly during the same task

### 0.2.0
+ Added basic spriting feature (for pngs)

### 0.1.3
+ Added jpegrescan
+ Fixed bug related to issue #6 (output file is bigger than input)

### 0.1.2
+ Added jpegoptim
+ Fixed gifsicle cmd argument failure

### 0.1.1
+ Fixed pngnq cmd argument failure

### 0.1.0
+ Initial Release (jpgmin, gifmin, pngmin, inlineImg, pngnq)

## License
Copyright (c) 2012 asciidisco
Licensed under the MIT license.

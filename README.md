# grunt-imagine

Use [@cowboys](https://github.com/cowboy) js based optimizer [grunt](https://github.com/cowboy/grunt) to optimize (and or inline) your projects image resources.

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
+ [grunt](https://github.com/cowboy/grunt)
+ [Getting started](https://github.com/cowboy/grunt/blob/master/docs/getting_started.md)

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
corresponding css files. At the moment, only *.png files can be processed.


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

Additionally you can add a css class prefix:

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

which would generate smth. like this:

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

The images will be sprited vertically, so you might need to set
up some margin to give´em some space:

```javascript
  sprites: {
      icons36: {
          src: ['src/img/icons36/*.png'],
          css: 'src/css/icons36.css',
          map: 'src/img/icons36.png',
          classPrefix: 'Icon',
          margin: 15
      }
  }
```

Now you´re images will be places with 15 px of space between them.

This task doesn´t depend on any external libraries, except for
PhantomJS, which the most of you should have installed if you´re using grunt.

## Future (TODO)
* Better documentation (Near future!)
* JS only PNG optimizing
* More JPG, PNG, GIF tools (ping me, if you knew good ones)
* Using remote services alternativly (smush.it, tinypng.org)
* GIF to PNG conversion (if smaller)

## Release History

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
# grunt-imagine

Use [@cowboys](https://github.com/cowboy) js based optimizer [grunt](https://github.com/cowboy/grunt) to optimize (and or inline) your projects image resources.

[![Build Status](https://secure.travis-ci.org/asciidisco/grunt-imagine.png?branch=master)](http://travis-ci.org/asciidisco/grunt-imagine)

## Getting Started

### IPlugin installation
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

PNG tools:
+ [pngcrush](https://github.com/cowboy/grunt)
+ [pngout](https://github.com/cowboy/grunt)
+ [optipng](https://github.com/cowboy/grunt)
+ [cryopng](https://github.com/cowboy/grunt)
+ [advpng](https://github.com/cowboy/grunt)
+ [huffmix](https://github.com/cowboy/grunt)

GIF tools:
+ [gifsicle](https://github.com/cowboy/grunt)

JPEG tools:
+ [jpegtran](https://github.com/cowboy/grunt)

PNGQUANT tools:
+ [pngnq](https://github.com/cowboy/grunt)

### Resources
+ [grunt](https://github.com/cowboy/grunt)
+ [Getting started](https://github.com/cowboy/grunt/blob/master/docs/getting_started.md)

## Documentation

### pngmin task
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
```javascript
gifmin: {
  src: ['src/**/*.gif'],
  dest: 'build'
}
```

### jpgmin task
```javascript
jpgmin: {
  src: ['src/**/*.jpg'],
  dest: 'build'
}
```

### pngnq task
```javascript
pngnq: {
  src: ['src/**/icons*.png'],
  dest: 'build'
}
```

### inlineImg task
```javascript
inlineImg: {
  src: ['src/**/*.css', 'src/**/*.html'],
  ie8: true,
  base: 'build/img',
  dest: 'build'
}
```

## Release History

### 0.1.0
+ Initial Release (jpgmin, gifmin, pngmin, inlineImg, pngnq)

## License
Copyright (c) 2012 asciidisco  
Licensed under the MIT license.
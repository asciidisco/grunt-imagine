# grunt-imagine

Use [@cowboys](https://github.com/cowboy) js based optimizer [grunt](https://github.com/cowboy/grunt) to optimize (and or inline) your projects image resources.

[![Build Status](https://secure.travis-ci.org/asciidisco/grunt-imagine.png?branch=master)](http://travis-ci.org/asciidisco/grunt-imagine)

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-imagine`

Then add this line to your project's `grunt.js` gruntfile.

```javascript
grunt.loadNpmTasks('grunt-imagine');
```

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
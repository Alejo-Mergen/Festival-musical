const { src , dest, watch, parallel } = require('gulp');

const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');


//imagenes
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp');
const avif = require('gulp-avif')

const terser = require('gulp-terser-js')

function css( done ) {
    //Indenticar el archivo SASS
    //Compilarlo
    //Almacenar en el disco duro

    src('src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe( plumber())
      .pipe(sass() )
      .pipe( postcss([autoprefixer(), cssnano() ]) )
      .pipe(sourcemaps.write('.'))
      .pipe( dest('build/css') );

    done(); //Callback que avisa a gulp cuando llegamos al final
}

function imagenes(done) {
  const opciones = {
    optimizationLevel: 3
  }
  src('scr/img/**/*.{png,jpg}')
    .pipe( cache( imagemin(opciones)) )
    .pipe( dest('build/img') )
  done();
}

function versionWebp( done ){

  const opciones = {
    quality: 50
  };

  src('scr/img/**/*.{png,jpg}')
    .pipe( webp(opciones) )
    .pipe(dest('build/img'))

  done();
}


function versionAvif( done ){
  const opciones = {
    quality: 50
  };

  src('scr/img/**/*.{png,jpg}')
    .pipe(sourcemaps.init())
    .pipe( avif(opciones) )
    .pipe(sourcemaps.write('.'))
    .pipe( dest('build/img') )
  done();

}

function javascript( done ) {
  src('src/js/**/*.js')
  .pipe( terser() )
  .pipe(dest('build/js'))

    done();
}

function dev( done ){
  watch('src/scss/**/*.scss', css);
  watch('src/js/**/*.js', javascript);
  done();
}

exports.css = css;
exports.js = javascript;
exports.imagemin = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev);


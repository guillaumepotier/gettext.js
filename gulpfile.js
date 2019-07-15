const {dest, parallel, series, src} = require('gulp');
const del      = require('del');
const rename   = require('gulp-rename');
const rollup   = require('gulp-better-rollup');
const uglify   = require('gulp-uglify-es').default;

const BUILD_DIR = 'dist';

const cleanUp = () => del([BUILD_DIR]);


const pack = format => () => src(`lib/gettext.js`)
	.pipe(rollup({format, name:'i18n', amd: {id: null}}))
	.pipe(rename({suffix: `.${format}`}))
	.pipe(dest(BUILD_DIR));

const minify = name => () => src(`./${BUILD_DIR}/gettext.${name}.js`)
	.pipe(rename({suffix: '.min'}))
   .pipe(uglify({output: { comments: 'some' }}))
	.pipe(dest(BUILD_DIR));

const formats = ['amd', 'cjs', 'esm', 'iife'/*, 'system', 'umd'*/];

const build = series(
	parallel(formats.map(pack)),
	parallel(formats.map(minify))
);

exports.default  = series(cleanUp, build);

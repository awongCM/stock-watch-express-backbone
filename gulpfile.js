'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');

gulp.task('default', ['scripts', 'sass', 'browser-sync'], () => {
	gulp.watch(['./scripts/**/*.js'], ['scripts', 'browser-sync']);
	gulp.watch(['./sass/main.sass'], ['sass', 'browser-sync']);
});

gulp.task('scripts', () => 
	gulp.src('./scripts/**/*.js')
		.pipe(gulp.dest('./public/scripts'))
);

gulp.task('sass', () => 
	gulp.src('./sass/main.sass')
		.pipe(sass({
			sourceMapEmbed: true,
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(gulp.dest('./public/stylesheets'))
);

gulp.task('browser-sync', ['nodaemon'], () => {
    browserSync.init(null, {
        proxy: "http://localhost:8080",
        files: ["public/**/*.*"],
        port: 7070
    });
});

gulp.task('nodaemon', () => {
    let started = false;
	
	return nodemon({
		script: 'scripts/app.js'
	}).on('start', () => {
		if (!started) {
			cb();
			started = true; 
		} 
	});
});
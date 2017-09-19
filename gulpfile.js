'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');

gulp.task('default', ['sass'], function () {
	gulp.watch(['./sass/main.sass'], ['sass']);
});

gulp.task('sass', ['browser-sync'], function () {
	return gulp.src('./sass/main.sass')
		.pipe(sass({
			sourceMapEmbed: true,
      		outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(gulp.dest('./public/stylesheets'))
})

gulp.task('browser-sync', ['nodaemon'], function () {
    browserSync.init(null, {
        proxy: "http://localhost:8080",
        files: ["public/**/*.*"],
        port: 7070
    });
});

gulp.task('nodaemon', function () {
    var started = false;
	
	return nodemon({
		script: 'scripts/app.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true; 
		} 
	});
});
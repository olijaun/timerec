/* jshint node:true, jquery:false */
'use strict';

var gulp = require('gulp');
var $$ = require('gulp-load-plugins')({lazy: true});
var del = require('del');
var path = require('path');
var streamqueue = require('streamqueue');


gulp.task('clean', function (cb) {
    del(['dist/*'], cb);
});

gulp.task('analyze', function (cb) {
    var basePath = path.resolve('./src/app/');
    $$.util.log('Analyzing sources in ' + basePath);

    gulp.src([basePath + '/**/*.js', '!./bower_components/**/*'])
        .pipe($$.jshint())
        .pipe($$.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($$.jshint.reporter('fail'))
        .on('end', cb); // returning the stream does not fail the build, therefore we must use the callback style
});

gulp.task('release', ['clean'], function () {
    var processedJsFile = 'timerec-app.js'; // Convention: This name has to match the name in the build comment of the index.html

    var assets = $$.useref.assets();
    var appAndTemplateFilter = $$.filter(['**/*app.js', '**/*templates.js']); // Convention: filter out the *.app.js and the *template.js file
    var jsFilter = $$.filter('**/*.js');
    var cssFilter = $$.filter('**/*.css');
    var htmlFilter = $$.filter('**/*.html');
    var basePath = path.resolve('./src');

    var templateStream = gulp.src('./src/app/**/*.html')
        .pipe($$.debug({title: 'Template Files:'}))
        .pipe($$.angularTemplatecache('timerec-templates.js', {
            module: 'timerecApp',
            base: basePath
        }));

    gulp.src('./src/bower_components/bootstrap/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));

    var assetStream = gulp.src(['./src/**/*.html', '!./src/bower_components/**/*'])
        .pipe(assets);               // Concatenate asset-groups with gulp-useref

    return streamqueue({objectMode: true}, assetStream, templateStream) // streamqueue should keep the order -> templates are concatenated at the end
        .pipe(appAndTemplateFilter)
        .pipe($$.debug({title: 'Asset Files:'}))
        .pipe($$.concat(processedJsFile))// Concat the *template.js file to the *app.js file
        .pipe($$.debug({title: 'Asset Files:'}))
        .pipe($$.ngAnnotate())         // Process app javascript sources to add dependency injection annotations
        .pipe(appAndTemplateFilter.restore())
        .pipe(jsFilter)
        .pipe($$.uglify())             // Minify all javascript sources
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($$.minifyCss())          // Minify CSS sources
        .pipe(cssFilter.restore())
        .pipe($$.rev())                // Rename the concatenated files with a hash-prefix
        .pipe(assets.restore())
        .pipe($$.useref())             // Replace the original references in the html with the concatenated and processed resources by usemin
        .pipe($$.revReplace())         // Replace the usemin generated resources with the reved resources
        .pipe(htmlFilter)
        .pipe($$.htmlmin({removeComments: true}))  // Remove comments from html
        .pipe(htmlFilter.restore())
        .pipe($$.debug({title: 'Processed output File: '}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['analyze', 'release']);

gulp.task('watch', function () {
    gulp.watch(['./app/index.html', './app/scripts/**/*.js'], ['default']);
});

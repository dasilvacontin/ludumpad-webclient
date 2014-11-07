
gulp = require('gulp')
gutil = require('gulp-util')
webserver = require('gulp-webserver')
browserify = require('browserify')
source = require('vinyl-source-stream')
buffer = require('vinyl-buffer')
uglify = require('gulp-uglify')

gulp.task 'browserify', ->
    browserify
        entries: './src/js/lp-client.coffee',
        transforms: ['.coffee', 'brfs']
    .bundle()
    .on 'error', gutil.log
    .pipe source 'bundle.js'
    #.pipe buffer()
    #.pipe uglify()
    .pipe gulp.dest './app/js/'

gulp.task 'watch', ->
    gulp.watch 'src/js/**', ['browserify']

gulp.task 'server', ->
    gulp.src './app/'
        .pipe webserver
            livereload: true,
            open: true

gulp.task 'default', ['browserify', 'watch', 'server']

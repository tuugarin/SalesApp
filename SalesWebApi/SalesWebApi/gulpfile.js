/// <binding BeforeBuild='concat-minify-js, concat-css, copy-fonts, concat-minify-js-modules' />
var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename"),
    minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    debug = require('gulp-debug');

var paths = {
    webroot: "www/"
};

paths.project_js =
    [
        "!" + paths.webroot + "js/**/*",
        "!" + paths.webroot + "/**/*min.js",
        paths.webroot + "/**/*.js",
        "!" + paths.webroot + "bower_components/**/*"
    ];

paths.modules_js =
    [
        "../node_modules/jquery/dist/jquery.js",
        "../node_modules/angular/angular.js",
        "../node_modules/angular-bootstrap/ui-bootstrap-tpls.js",
        "../node_modules/angular-smart-table/dist/smart-table.js",
        "../node_modules/bootstrap/dist/js/bootstrap.js",
        "../node_modules/angular-ui-router/release/angular-ui-router.js",
        "../node_modules/angular-messages/angular-messages.js",
        "../node_modules/ng-file-upload/ng-file-upload.js"
    ];

paths.project_css =
    [
        'www/bower_components/bootstrap/dist/css/bootstrap.css',
        'www/spinner.css',
    ];

gulp.task('concat-minify-js', function () {
    return gulp.src(paths.project_js)
            .pipe(debug())
            .pipe(concat('salesApp.js'))
            .pipe(minify({
                ext: {
                     min: '.min.js'
                 }
            }))
            .pipe(gulp.dest(paths.webroot + "js"));
});

gulp.task('copy-fonts', function () {
    return gulp.src('../node_modules/bootstrap/fonts/**')
            .pipe(debug())
            .pipe(gulp.dest(paths.webroot + 'fonts'));
});

gulp.task('concat-minify-js-modules', function () {
    return gulp.src(paths.modules_js)
            .pipe(debug())
            .pipe(concat('modules.js'))
            .pipe(minify({
                 ext: {
                     min: '.min.js'
                 }
            }))
            .pipe(gulp.dest(paths.webroot + "js"));
});
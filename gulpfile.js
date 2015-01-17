var gulp = require('gulp');
var glob = require('glob');
var plato = require('plato');
var plugins = require('gulp-load-plugins')();
var checkstyleFileReporter = require('jshint-checkstyle-file-reporter');
var log = plugins.util.log;



var sourceDirectories = ["./src/**/*.js", "./tests/**/*.js"];
var testDirectories = ["./tests/**/*.js"];


gulp.task('help', plugins.taskListing);


gulp.task('default', ['help']);


gulp.task('test', function () {
    log('Running unit tests');

    return gulp.src(sourceDirectories, {read:false})
        .pipe(plugins.mocha({reporter: 'spec'}));
});


gulp.task('jshint', function() {
    log('Linting with jshint -> creating xml output file.');

    process.env.JSHINT_CHECKSTYLE_FILE = "./jshint.xml"; // default: checkstyle.xml

    return gulp.src(sourceDirectories)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(checkstyleFileReporter))
        .pipe(plugins.jshint.reporter('default'));
});


gulp.task('plato', function () {
    log('Running plato analysis and generating report.');

    runPlato();
});


function runPlato() {
    log('Running Plato');

    var files = [];
    for(var i = 0; i < sourceDirectories.length; i++) {
        Array.prototype.push.apply(files, glob.sync(sourceDirectories[i]));
    }

    // excludeFiles = /\/tests\.js/,
    options = {
        title: 'Plato Inspections Report',
        // exclude: excludeFiles
    },

    plato.inspect(files, "./plato", options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        log(overview.reports[0].jshint);
    }
}

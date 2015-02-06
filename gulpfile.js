# This file is intended as a starting place, nothing more.


var gulp = require('gulp');
var glob = require('glob');
var plato = require('plato');
var plugins = require('gulp-load-plugins')();
var checkstyleFileReporter = require('jshint-checkstyle-file-reporter');
var log = plugins.util.log;
var shell = require('gulp-shell');



var jsSource = ["./src/**/*.js", "./tests/**/*.js"];
var pySource = ["./src/**/*.py", "./tests/**/*.py"];

gulp.task('help', plugins.taskListing);


gulp.task('default', ['help']);


gulp.task('js-test', function () {
    log('Running JavaScript unit tests');

    return gulp.src(jsSource, {read:false})
        .pipe(plugins.mocha({reporter: 'spec'}));
});



gulp.task('jshint', function() {
    log('Linting with jshint -> creating report file.');

    process.env.JSHINT_CHECKSTYLE_FILE = "./jshint.xml"; // default: checkstyle.xml

    return gulp.src(jsSource)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(checkstyleFileReporter))
        .pipe(plugins.jshint.reporter('default'));
});


gulp.task("pylint", function() {
    log('Linting with pylint -> creating report file.');

    var files = [];

    gulp.src(pySource, {read: true})
        .on('data', function(file) {
            files.push(file.path);
        })
        .on('data', function() {
            shell.task(['pylint ' + files.join(' ') + ' -f parseable > pylint_report.txt'], {quiet: true, ignoreErrors: true})();
        });
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

const gulp = require("gulp");
const babel = require("gulp-babel");
const istanbul = require("gulp-istanbul");
const mocha = require("gulp-mocha");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");

gulp.task("compile", function()
{
	return gulp.src("src/music_note_utils.es6")
		.pipe(babel())
		.pipe(gulp.dest("dist"));
});
gulp.task("pre-test", ["compile"], function()
{
	return gulp.src(["dist/music_note_utils.js"])
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});
gulp.task("test", ["pre-test"], function()
{
	return gulp.src(["test/*.test.js"])
		.pipe(mocha())
		.pipe(istanbul.writeReports
		({
			reporters: [ 'lcov', 'json', 'text', 'text-summary', 'cobertura']
		}));
});
gulp.task("build", ["test"], function()
{
	return gulp.src("dist/music_note_utils.js")
		.pipe(uglify())
		.pipe(rename("music_note_utils.min.js"))
		.pipe(gulp.dest("dist/"));
});

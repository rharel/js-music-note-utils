const gulp = require("gulp");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");

gulp.task("compile", function ()
{
	return gulp.src("src/music_note_utils.es6")
		.pipe(babel())
		.pipe(gulp.dest("dist"));
});
gulp.task("build", ["compile"], function()
{
	return gulp.src("dist/music_note_utils.js")
		.pipe(uglify())
		.pipe(rename("music_note_utils.min.js"))
		.pipe(gulp.dest("dist/"));
});

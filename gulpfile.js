const gulp = require("gulp");
const mocha = require("gulp-mocha");

const SECONDS = 1000;

// Run tests
gulp.task("test", function () {
    gulp.src("./test/**/*.js")
        .pipe(mocha({
            reporter: "list",
            timeout: 10 * SECONDS
        }));
});
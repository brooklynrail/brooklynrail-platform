/*
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
========================================
========================================
========================================
----------------------------------------
USWDS SASS GULPFILE
----------------------------------------
*/


const gulp = require("gulp");
// const uswds = require("./node_modules/uswds-gulp/config/uswds");

/*
----------------------------------------
PATHS
----------------------------------------
- All paths are relative to the
  project root
- Don't use a trailing `/` for path
  names
----------------------------------------
*/

// USWDS source directory
const USWDS_SRC  = "./assets/scss/uswds";

// Project JS source directory
const USWDS_JS = "./assets/js";

// Images destination
const USWDS_IMG_DEST = "./themes/brooklynrail/static/material/img/uswds";

// Fonts destination
const FONTS_DEST = "./themes/brooklynrail/static/material/fonts";

// Fontawesome
const FONTAWESOME_DEST = "./assets/vendor/fontawesome";
const FONTAWESOME_FONTS = "./themes/brooklynrail/static/material/fonts/fontawesome";

/*
----------------------------------------
TASKS
----------------------------------------
*/

gulp.task("copy-uswds-setup", () => {
  return gulp
    .src(`${uswds}/scss/theme/**/**`)
    .pipe(gulp.dest(`${USWDS_SRC}`));
});

gulp.task("copy-uswds-js", () => {
  return gulp.src(`${uswds}/js/**/**`).pipe(gulp.dest(`${USWDS_JS}`));
});

gulp.task("copy-uswds-fonts", () => {
  return gulp.src(`${uswds}/fonts/**/**`).pipe(gulp.dest(`${FONTS_DEST}`));
});

gulp.task("copy-uswds-images", () => {
  return gulp.src(`${uswds}/img/**/**`).pipe(gulp.dest(`${USWDS_IMG_DEST}`));
});

gulp.task("copy-fontawesome-scss", () => {
  return gulp.src(`./node_modules/@fortawesome/fontawesome-free/scss/**/**`).pipe(gulp.dest(`${FONTAWESOME_DEST}`));
});

gulp.task("copy-fontawesome-fonts", () => {
  return gulp.src(`./node_modules/@fortawesome/fontawesome-free/webfonts/**/**`).pipe(gulp.dest(`${FONTAWESOME_FONTS}`));
});

gulp.task(
  "init",
  gulp.series(
    "copy-uswds-setup",
    "copy-uswds-fonts",
    "copy-uswds-js",
    "copy-uswds-images"
  )
);

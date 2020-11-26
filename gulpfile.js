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

const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const gulp = require("gulp");
const pkg = require("./node_modules/uswds/package.json");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uswds = require("./node_modules/uswds-gulp/config/uswds");

sass.compiler = require("sass");

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
const USWDS_SRC  = "./themes/brooklynrail/assets/scss/uswds";

// Project Sass source directory
const PROJECT_SASS_SRC = "./themes/brooklynrail/assets/scss";

// Project JS source directory
const PROJECT_JS_SRC = "./themes/brooklynrail/assets/js";

// Vendor CSS source directory
const VENDOR_CSS_SRC = "./themes/brooklynrail/assets/vendor";

// Images destination
const USWDS_IMG_DEST = "./themes/brooklynrail/static/material/img/uswds";

// Fonts destination
const FONTS_DEST = "./themes/brooklynrail/static/material/fonts";

// Javascript destination
const JS_DEST = "./themes/brooklynrail/static/material/dist";

// Compiled destination directory (not committed in GitHub)
const DIST = "./themes/brooklynrail/static/material/dist";

// Site CSS destination
// Like the _site/assets/css directory in Jekyll, if necessary.
// If using, uncomment line 106
// const SITE_CSS_DEST = "./path/to/site/css/destination";

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

gulp.task("copy-uswds-fonts", () => {
  return gulp.src(`${uswds}/fonts/**/**`).pipe(gulp.dest(`${FONTS_DEST}`));
});

gulp.task("copy-uswds-images", () => {
  return gulp.src(`${uswds}/img/**/**`).pipe(gulp.dest(`${USWDS_IMG_DEST}`));
});

gulp.task("copy-uswds-js", () => {
  return gulp.src(`${uswds}/js/**/**`).pipe(gulp.dest(`${JS_DEST}`));
});

gulp.task("copy-vendor-css", () => {
  return gulp.src(`${VENDOR_CSS_SRC}/**/*.css`).pipe(gulp.dest(`${DIST}`));
});

gulp.task("copy-js", () => {
  return gulp.src(`${PROJECT_JS_SRC}/**/*.js`).pipe(gulp.dest(`${DIST}`));
});

gulp.task("copy-fontawesome_css", () => {
  return gulp.src('./node_modules/@fortawesome/fontawesome-free/css/**/**').pipe(gulp.dest('./themes/brooklynrail/static/material/dist/fontawesome/css'));
});

gulp.task("copy-fontawesome_scss", () => {
  return gulp.src('./node_modules/@fortawesome/fontawesome-free/scss/**/**').pipe(gulp.dest('./assets/vendor/fontawesome'));
});

gulp.task("copy-fontawesome_webfonts", () => {
  return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/**/**').pipe(gulp.dest('./themes/brooklynrail/static/material/dist/fontawesome/webfonts'));
});


gulp.task("build-sass", function(done) {
  var plugins = [
    // Autoprefix
    autoprefixer({
      cascade: false,
      grid: true
    }),
    // Minify
    csso({ forceMediaMerge: false }),
  ];
  return (
    gulp
      .src([`${PROJECT_SASS_SRC}/**/*.scss`])
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass.sync({
          includePaths: [
            `${PROJECT_SASS_SRC}`,
            `${uswds}/scss`,
            `${uswds}/scss/packages`
          ]
        })
      )
      .pipe(replace(/\buswds @version\b/g, "based on uswds v" + pkg.version))
      .pipe(postcss(plugins))
      .pipe(sourcemaps.write("."))
      // uncomment the next line if necessary for Jekyll to build properly
      //.pipe(gulp.dest(`${SITE_CSS_DEST}`))
      .pipe(gulp.dest(`${DIST}`))
  );
});

gulp.task(
  "init",
  gulp.series(
    "copy-uswds-setup",
    "copy-uswds-fonts",
    "copy-uswds-images",
    "copy-uswds-js",
    "build-sass"
  )
);

gulp.task("watch-sass", function() {
  gulp.watch(`${PROJECT_SASS_SRC}/**/*.scss`, gulp.series("build-sass"));
  gulp.watch(`${PROJECT_JS_SRC}/**/*.js`, gulp.series("copy-js", "build-sass"));
});

gulp.task("copy-assets", gulp.series("copy-js", "copy-fontawesome_webfonts", "copy-fontawesome_css", "copy-uswds-js", "copy-vendor-css"));

gulp.task("watch", gulp.series("build-sass", "copy-js", "watch-sass"));

gulp.task("build", gulp.series("build-sass", "copy-assets"));

gulp.task("default", gulp.series("watch"));

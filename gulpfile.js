const {src, dest, series, watch} = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    imageWebp = require('gulp-webp'),
    htmlmin = require('gulp-htmlmin'),
    spriteSvg = require('gulp-svg-sprite'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    bs = require('browser-sync').create();

function html() {
    return src('src/**.html')
        .pipe(htmlmin({collapseWhitespace : false}))
        .pipe(dest('build/'))
}

function scss() {
    return src('src/scss/**.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(concat('style.css'))
        .pipe(dest('build/css/'))
}

function imgBuild() {
    return src('src/images/**.{jpg,png}')
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
        ]))
        .pipe(dest('build/images/'))
}

function imgDev() {
    return src('src/images/**.**')
        .pipe(dest('build/images/'))
}

function svg() {
    return src('src/images/svg/**.svg')
        .pipe(spriteSvg({
            mode: {
                stack: {
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(dest('build/'))
}

function webp() {
    return src('src/images/**.{png,jpg}')
        .pipe(imageWebp())
        .pipe(dest('build/images/webp/'))
}

function clear() {
    return del('build')
}

function scripts() {
    return src('src/js/**.js')
        .pipe(dest('build/js/'))
}

function serve() {
    bs.init({
        server: './build',
        host: '192.168.1.137'
    })

    watch('src/**.html', series(html)).on('change', bs.reload)
    watch('src/scss/**.scss', series(scss)).on('change', bs.reload)
    watch('src/js/**.js', series(scripts)).on('change', bs.reload)
}


exports.svg = svg;
exports.build = series(clear, scss, webp, imgBuild, svg, scripts, html);
exports.serve = series(clear, scss, webp, imgDev, svg, scripts,  html, serve);
exports.clear = clear;

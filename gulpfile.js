/* global exports process console __dirname Buffer */
/* eslint-disable no-console */
/* eslint camelcase: ["error", {allow: ["indent_size", "indent_char", "content_unformatted"]}]*/
/* eslint-disable no-shadow */

const {series, parallel, src, dest, watch, lastRun} = require(`gulp`);
const fs = require(`fs`); // операции над файловой системой
const plumber = require(`gulp-plumber`); // предупреждает об ошибках
const del = require(`del`);
const pug = require(`gulp-pug`);
const through2 = require(`through2`); // ?
const rename = require(`gulp-rename`);
const getClassesFromHtml = require(`get-classes-from-html`);
const browserSync = require(`browser-sync`).create();
const debug = require(`gulp-debug`); // показывает какие файлы прошли через pipe stream
const sass = require(`gulp-sass`);
const buffer = require(`vinyl-buffer`); // ?
const postcss = require(`gulp-postcss`); // прогоняет css через несколько плагинов, парсит одни раз
const autoprefixer = require(`autoprefixer`);
const mqpacker = require(`css-mqpacker`); // Pack same CSS media query rules into one using PostCSS
const atImport = require(`postcss-import`); // ?
const csso = require(`gulp-csso`); // Minify CSS with CSSO
const inlineSVG = require(`postcss-inline-svg`); // PostCSS plugin to reference an SVG file and control its attributes with CSS syntax
const objectFitImages = require(`postcss-object-fit-images`); // PostCSS plugin that updates the standard object-fit tag to work with the object-fit-images polyfill for browsers that do not natively support object-fit..
const cpy = require(`cpy`); // Copy files
const svgstore = require(`gulp-svgstore`); // Combine svg files into one with <symbol> elements. Read more about this in CSS Tricks article.
const svgmin = require(`gulp-svgmin`);
const spritesmith = require(`gulp.spritesmith`); // Convert a set of images into a spritesheet and CSS variables via gulp
const merge = require(`merge-stream`); // ???? Merge (interleave) a bunch of streams.
const imagemin = require(`gulp-imagemin`);
const prettyHtml = require(`gulp-pretty-html`);
const replace = require(`gulp-replace`); // A string replace plugin for gulp 3
const ghpages = require(`gh-pages`); // Publish files to a gh-pages branch on GitHub (or any other branch anywhere else).
const path = require(`path`); // provides utilities for working with file and directory paths
// const browserify = require(`browserify`);
// const source = require(`vinyl-source-stream`);
const sourcemaps = require(`gulp-sourcemaps`);
const babel = require(`gulp-babel`);
const concat = require(`gulp-concat`);
const insert = require(`gulp-insert`);

// Глобальные настройки этого запуска
const nth = {};
nth.config = require(`./config.js`); // передаем объект из файла
nth.blocksFromHtml = [];

// блоки из конфига сразу добавим в список блоков
nth.config.alwaysAddBlocks.forEach((item, i) => {
  nth.blocksFromHtml[i] = item.block;
});
nth.scssImportsList = []; // список импортов стилей
const dir = nth.config.dir; // список папок из конфига

// Сообщение для компилируемых файлов
let doNotEditMsg = `\n ВНИМАНИЕ! Этот файл генерируется автоматически.\n Любые изменения этого файла будут потеряны при следующей компиляции.\n Любое изменение проекта без возможности компиляции ДОЛЬШЕ И ДОРОЖЕ в 2-5 раз.\n\n`;

// Настройки pug-компилятора
let pugOption = {
  data: {repoUrl: `https://github.com/Alisa1711/gulp-sass-pug.git`}, // зачем ??? передаем pug-у адрес репозитория проекта
  filters: {'show-code': filterShowCode}, // фильтр для кода
};

// Настройки бьютификатора
let prettyOption = {
  indent_size: 2,
  indent_char: ` `,
  unformatted: [`code`, `em`, `strong`, `span`, `i`, `b`, `br`, `script`],
  content_unformatted: [],
};

// Список и настройки плагинов postCSS
let postCssPlugins = [
  autoprefixer({grid: true}),
  mqpacker({
    sort: true
  }),
  atImport(),
  inlineSVG(),
  objectFitImages(),
];

// компиляция файла src/pug/mixins.pug
function writePugMixinsFile(cb) {
  let pugMixins = `// Data and Mixins\n\n`;

  fs.readdirSync(`${dir.data}`)
    .filter((file) => path.extname(`${file}`) === `.pug`)
    .forEach(function (file) {
      pugMixins += `include ${dir.data.replace(dir.src, `../`)}${file}\n`;
    });

  let allBlocksWithPugFiles = getDirectories(`pug`);
  allBlocksWithPugFiles.forEach(function (block) {
    pugMixins += `include ${block.group.replace(dir.src, `../`)}${block.block}/${block.block}.pug\n`;
  });
  fs.writeFileSync(`${dir.src}pug/mixins.pug`, pugMixins);
  cb();
}
exports.writePugMixinsFile = writePugMixinsFile;

function compilePug() {
  return src(`${dir.src}pages/**/*.pug`)
    .pipe(plumber({
      errorHandler(err) {
        console.log(err.message);
        this.emit(`end`);
      }
    }))
    .pipe(debug({title: `Compiles `}))
    .pipe(pug(pugOption))
    .pipe(prettyHtml(prettyOption))
    .pipe(replace(/^(\s*)(<button.+?>)(.*)(<\/button>)/gm, `$1$2\n$1  $3\n$1$4`))
    .pipe(replace(/^( *)(<.+?>)(<script>)([\s\S]*)(<\/script>)/gm, `$1$2\n$1$3\n$4\n$1$5\n`))
    .pipe(replace(/^( *)(<.+?>)(<script\s+src.+>)(?:[\s\S]*)(<\/script>)/gm, `$1$2\n$1$3$4`))
    .pipe(through2.obj(getClassesToBlocksList))
    .pipe(dest(dir.build));
}
exports.compilePugFast = compilePug;


function compilePugFast() {
  return src(`${dir.src}pages/**/*.pug`, {since: lastRun(compilePugFast)})
    .pipe(plumber({
      errorHandler(err) {
        console.log(err.message);
        this.emit(`end`);
      }
    }))
    .pipe(debug({title: `Compiles `}))
    .pipe(pug(pugOption))
    .pipe(prettyHtml(prettyOption))
    .pipe(replace(/^(\s*)(<button.+?>)(.*)(<\/button>)/gm, `$1$2\n$1  $3\n$1$4`))
    .pipe(replace(/^( *)(<.+?>)(<script>)([\s\S]*)(<\/script>)/gm, `$1$2\n$1$3\n$4\n$1$5\n`))
    .pipe(replace(/^( *)(<.+?>)(<script\s+src.+>)(?:[\s\S]*)(<\/script>)/gm, `$1$2\n$1$3$4`))
    .pipe(through2.obj(getClassesToBlocksList))
    .pipe(dest(dir.build));
}
exports.compilePugFast = compilePugFast;


function copyAssets(cb) { // копирование файлов из конфига
  for (let item in nth.config.addAssets) {
    let dest = `${dir.build}${nth.config.addAssets[item]}`;
    cpy(item, dest);
  }
  cb();
}
exports.copyAssets = copyAssets;


function copyImg(cb) { // копирует все изображения из папок img
  let copiedImages = [`src/**/img/**/*.*`];
  (async () => {
    await cpy(copiedImages, `${dir.build}img`);
    cb();
  })();
}
exports.copyImg = copyImg;


function generateSvgSprite(cb) {
  let spriteSvgPath = `${dir.blocks}/common/sprite-svg/svg/`;
  let alwaysAddSvg = false;
  nth.config.alwaysAddBlocks.forEach((block) => {
    if (block.block === `sprite-svg`) {
      alwaysAddSvg = true;
    }
  });
  if (alwaysAddSvg && fileExist(spriteSvgPath)) {
    return src(spriteSvgPath + `*.svg`)
      .pipe(svgmin(function () {
        return {plugins: [{cleanupIDs: {minify: true}}]};
      }))
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename(`sprite.svg`))
      .pipe(dest(`${dir.blocks}sprite-svg/img/`));
  } else {
    return cb();
  }
}
exports.generateSvgSprite = generateSvgSprite;


function generatePngSprite(cb) { // разобраться, как фурычит png спрайт
  let spritePngPath = `${dir.blocks}sprite-png/png/`;
  if (nth.config.alwaysAddBlocks.indexOf(`sprite-png`) > -1 && fileExist(spritePngPath)) {
    del(`${dir.blocks}sprite-png/img/*.png`);
    let fileName = `sprite-` + Math.random().toString().replace(/[^0-9]/g, ``) + `.png`; // ???
    let spriteData = src(spritePngPath + `*.png`)
      .pipe(spritesmith({
        imgName: fileName,
        cssName: `sprite-png.scss`,
        padding: 4,
        imgPath: `../img/` + fileName
      }));
    let imgStream = spriteData.img
      .pipe(buffer())
      .pipe(imagemin([imagemin.optipng({optimizationLevel: 5})]))
      .pipe(dest(`${dir.blocks}sprite-png/img/`));
    let cssStream = spriteData.css
      .pipe(dest(`${dir.blocks}sprite-png/`));
    return merge(imgStream, cssStream);
  } else {
    return cb();
  }
}
exports.generatePngSprite = generatePngSprite;

function writeGeneralMixins() {
  return src(`${dir.src}/scss/mixins/*.scss`)
    .pipe(concat(`mixins.scss`))
    .pipe(dest(`${dir.src}/scss`));
}


function writeSassImportsFile(cb) {
  const newScssImportsList = [];
  nth.config.addStyleBefore.forEach(function (src) {
    newScssImportsList.push(src);
  });
  nth.config.alwaysAddBlocks.forEach(function (block) {
    newScssImportsList.push(`${dir.blocks}${block.group}${block.block}/${block.block}.scss`);
  });
  let allBlocksWithScssFiles = getDirectories(`scss`);
  allBlocksWithScssFiles.forEach(function (blockWithScssFile) { // проходим по всем директориям блоков, содержащих scss файлы и добавляем те, которые еще нет в newScssImportsList
    let url = `${blockWithScssFile.group}${blockWithScssFile.block}/${blockWithScssFile.block}.scss`;
    if (nth.blocksFromHtml.indexOf(blockWithScssFile.block) === -1) {
      return;
    }
    if (newScssImportsList.indexOf(url) > -1) {
      return;
    }
    newScssImportsList.push(url);
  });
  nth.config.addStyleAfter.forEach(function (src) {
    newScssImportsList.push(src);
  });
  let diff = getArraysDiff(newScssImportsList, nth.scssImportsList);
  if (diff.length) {
    let msg = `\n/*!*${doNotEditMsg.replace(/\n /gm, `\n * `).replace(/\n\n$/, `\n */\n\n`)}`;
    let styleImports = msg;
    newScssImportsList.forEach(function (src) {
      styleImports += `@import "${src}";\n`;
    });
    styleImports += msg;
    fs.writeFileSync(`${dir.src}scss/style.scss`, styleImports);
    console.log(`---------- Write new style.scss`);
    nth.scssImportsList = newScssImportsList;
  }
  cb();
}
exports.writeSassImportsFile = writeSassImportsFile;


function compileSass() {
  const fileList = [
    `${dir.src}scss/style.scss`,
  ];
  return src(fileList, {sourcemaps: true})
    .pipe(plumber({
      errorHandler(err) {
        console.log(err.message);
        this.emit(`end`);
      }
    }))
    .pipe(debug({title: `Compiles:`}))
    .pipe(sass({includePaths: [__dirname + `/`, `node_modules`]})) // разрешаем заглядывать за import`ом в node_modules
    .pipe(postcss(postCssPlugins))
    .pipe(csso({
      restructure: false,
    }))
    .pipe(dest(`${dir.build}/css`, {sourcemaps: `.`}))
    .pipe(browserSync.stream());
}
exports.compileSass = compileSass;

function buildJs() {
  return src([
    `${dir.src}js/**/*.js`,
    `${dir.src}blocks/**/*.js`,
    `${nth.config.notJs}`
  ])
        .pipe(sourcemaps.init())
        .pipe(concat(`script.js`))
        .pipe(insert.wrap(`$(function() {\n\n`, `\n\n});`))
        .pipe(babel({
          presets: [`@babel/env`]
        }))
        .pipe(sourcemaps.write(`.`))
        .pipe(dest(`${dir.build}js`))
        .pipe(browserSync.stream());
}
exports.buildJs = buildJs;


function clearBuildDir() {
  return del([
    `${dir.build}**/*`,
    `!${dir.build}readme.md`,
  ]);
}
exports.clearBuildDir = clearBuildDir;


function reload(done) {
  browserSync.reload();
  done();
}

function deploy(cb) {
  ghpages.publish(path.join(process.cwd(), dir.build), cb);
}
exports.deploy = deploy;


function serve() {

  browserSync.init({
    server: dir.build,
    port: 8080,
    startPath: `index.html`,
    open: false,
    notify: false,
  });

  // Страницы: изменение, добавление +
  watch([`${dir.src}pages/**/*.pug`], {events: [`change`, `add`], delay: 100}, series(
      compilePugFast,
      writeGeneralMixins,
      writeSassImportsFile,
      parallel(compileSass, buildJs),
      reload
  ));

  // Страницы: удаление (?????)
  watch([`${dir.src}pages/**/*.pug`], {delay: 100}).on(`unlink`, function (path) {
    let filePathInBuildDir = path.replace(`.pug`, `.html`).replace(`${dir.src}pages/`, dir.build);
    fs.unlink(filePathInBuildDir, (err) => {
      if (err) {
        throw err;
      }
      console.log(`---------- Delete:  ${filePathInBuildDir}`);
    });
  });

  // Разметка Блоков: изменение +
  watch([`${dir.blocks}**/**/*.pug`], {events: [`change`], delay: 100}, series(
      compilePug,
      reload
  ));

  // Разметка Блоков: добавление
  watch([`${dir.blocks}**/**/*.pug`], {events: [`add`], delay: 100}, series(
      writePugMixinsFile,
      compilePug,
      reload
  ));

  // Разметка Блоков: удаление
  watch([`${dir.blocks}**/**/*.pug`], {events: [`unlink`], delay: 100}, writePugMixinsFile);

  // Шаблоны pug: все события
  watch([`${dir.src}data/**/*.pug`, `${dir.src}pug/**/*.pug`, `!${dir.src}pug/mixins.pug`], {delay: 100}, series(
      writePugMixinsFile,
      compilePug,
      writeSassImportsFile,
      parallel(compileSass, buildJs)
  ));

  // Стили Блоков: изменение
  watch([`${dir.blocks}**/**/*.scss`], {events: [`change`], delay: 100}, series(
      compileSass
  ));

  // Стили Блоков: добавление
  watch([`${dir.blocks}**/**/*.scss`], {events: [`add`], delay: 100}, series(
      writeSassImportsFile,
      compileSass
  ));

  // Общие миксины: все события
  watch([`${dir.src}scss/mixins/*.scss`], {delay: 100}, series(
      writeGeneralMixins,
      compileSass
  ));

  // Стилевые глобальные файлы: все события
  watch([`${dir.src}scss/**/*.scss`, `!${dir.src}scss/style.scss`], {events: [`all`], delay: 100}, series(
      compileSass
  ));

  // Скриптовые глобальные файлы: все события
  watch([`${dir.src}js/**/*.js`, `!${dir.src}js/entry.js`, `${dir.blocks}**/*.js`], {events: [`all`], delay: 100}, series(
      buildJs,
      reload
  ));

  // Картинки: все события
  watch([`${dir.blocks}**/img/*.{jpg,jpeg,png,gif,svg,webp}`, `${dir.src}**/img/**/*.{jpg,jpeg,png,gif,svg,webp}`], {events: [`all`]}, series(
      copyImg,
      reload
  ));

  // Спрайт SVG
  watch([`${dir.blocks}sprite-svg/svg/*.svg`], {events: [`all`]}, series(
      generateSvgSprite,
      copyImg,
      reload
  ));

  // Спрайт PNG
  watch([`${dir.blocks}sprite-png/png/*.png`], {events: [`all`], delay: 100}, series(
      generatePngSprite,
      copyImg,
      compileSass,
      reload
  ));
}


exports.build = series(
    parallel(clearBuildDir, writePugMixinsFile),
    parallel(compilePugFast, copyAssets, generateSvgSprite, generatePngSprite, writeGeneralMixins),
    parallel(copyImg, writeSassImportsFile),
    parallel(compileSass, buildJs)
);


exports.default = series(
    parallel(clearBuildDir, writePugMixinsFile),
    parallel(compilePugFast, copyAssets, generateSvgSprite, generatePngSprite, writeGeneralMixins),
    parallel(copyImg, writeSassImportsFile),
    parallel(compileSass, buildJs),
    serve
);


// Функции, не являющиеся задачами Gulp ----------------------------------------

/**
 * Получение списка классов из HTML и запись его в глоб. переменную nth.blocksFromHtml.
 * @param  {object}   file Обрабатываемый файл
 * @param  {string}   enc  Кодировка
 * @param  {Function} cb   Коллбэк
 */
function getClassesToBlocksList(file, enc, cb) {
  // Передана херь — выходим
  if (file.isNull()) {
    cb(null, file);
    return;
  }
  // Проверяем, не является ли обрабатываемый файл исключением
  let processThisFile = true;
  nth.config.notGetBlocks.forEach(function (item) {
    if (file.relative.trim() === item.trim()) {
      processThisFile = false;
    }
  });
  // Файл не исключён из обработки, погнали
  if (processThisFile) {
    const fileContent = file.contents.toString();
    let classesInFile = getClassesFromHtml(fileContent);
    // nth.blocksFromHtml = [];
    // Обойдём найденные классы
    for (let item of classesInFile) {
      // Не Блок или этот Блок уже присутствует?
      if ((item.indexOf(`__`) > -1) || (item.indexOf(`--`) > -1) || (nth.blocksFromHtml.indexOf(item) + 1)) {
        continue;
      }
      // Класс совпадает с классом-исключением из настроек?
      if (nth.config.ignoredBlocks.indexOf(item) + 1) {
        continue;
      }
      // У этого блока отсутствует папка?
      // if (!fileExist(dir.blocks + item)) continue;
      // Добавляем класс в список
      nth.blocksFromHtml.push(item);
    }
    console.log(`---------- Used HTML blocks: ` + nth.blocksFromHtml.join(`, `));
    file.contents = new Buffer.from(fileContent);
  }
  this.push(file);
  cb();
}

// Pug-фильтр, выводящий содержимое pug-файла в виде форматированного текста

function filterShowCode(text, options) {
  let lines = text.split(`\n`);
  let result = `<pre class="code">\n`;
  if (typeof (options[`first-line`]) !== `undefined`) {
    result = result + `<code>` + options[`first-line`] + `</code>\n`;
  }
  for (let i = 0; i < (lines.length - 1); i++) { // (lines.length - 1) для срезания последней строки (пустая)
    result = result + `<code>` + lines[i].replace(/</gm, `&lt;`) + `</code>\n`;
  }
  result = result + `</pre>\n`;
  result = result.replace(/<code><\/code>/g, `<code>&nbsp;</code>`);
  return result;
}

/**
 * Проверка существования файла или папки
 * @param  {string} filepath Путь до файла или папки
 * @return {boolean}
 */
function fileExist(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

/**
 * Получение всех названий поддиректорий, содержащих файл указанного расширения, совпадающий по имени с поддиректорией
 * @param  {string} ext    Расширение файлов, которое проверяется
 * @return {array}         Массив из имён блоков c группой
 */
function getDirectories(ext) {
  // берем группы с блоками
  let sources = fs.readdirSync(dir.blocks).
    filter((group) => fs.lstatSync(dir.blocks + group).isDirectory());

  console.log(sources);

  let res = [];

  // для каждой группы получаем список имен блоков
  sources.forEach((group) => {
    group = dir.blocks + group + `/`;
    let blocks = fs.readdirSync(group)
      .filter((item) => fs.lstatSync(group + item).isDirectory())
      .filter((item) => fileExist(group + item + `/` + item + `.` + ext));
    blocks.forEach(function (item, i, arr) {
      arr[i] = {group, block: item};
    });
    res = res.concat(blocks);
  });


  return res;
}

/**
 * Получение разницы между двумя массивами.
 * @param  {array} a1 Первый массив
 * @param  {array} a2 Второй массив
 * @return {array}    Элементы, которые отличаются
 */
function getArraysDiff(a1, a2) {
  return a1.filter((i)=>!a2.includes(i)).
  concat(a2.filter((i)=>!a1.includes(i)));
}

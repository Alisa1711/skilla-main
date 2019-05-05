/* global module */

let config = {
  'notGetBlocks': [],
  'ignoredBlocks': [
    `no-js`,
  ],
  'alwaysAddBlocks': [
    `sprite-svg`
    // 'sprite-png',
    // 'object-fit-polyfill',
  ],
  'addStyleBefore': [
    `src/scss/variables.scss`,
    `src/scss/mixins.scss`, // создается автоматически
    `src/scss/normalize.scss`,
  ],
  'addStyleAfter': [
    // 'src/scss/print.scss',
  ],
  'addJsBefore': [
    // 'somePackage/dist/somePackage.js', // для 'node_modules/somePackage/dist/somePackage.js',
  ],
  'addJsAfter': [
    `./script.js`,
  ],
  'addAssets': {
    'src/fonts/demo-empty-open-sans.woff2': `fonts/`,
    'src/img/demo-*.{png,svg,jpg,jpeg}': `img/`,
    'src/js/jquery-3.4.0.min.js': `js/`
  },
  'dir': {
    'src': `src/`,
    'build': `build/`,
    'blocks': `src/blocks/`,
    'data': `src/data/`
  },
  'createBlock': {
    'f': [`scss`, `js`, `pug`, `img`, `bg-img`, `md`],
    'default': [`scss`, `img`, `bg-img`]
  }
};

module.exports = config;

/* global module */

let config = {
  'notGetBlocks': [],
  'ignoredBlocks': [
    `no-js`,
  ],
  'alwaysAddBlocks': [
    {group: `common/`, block: `text`},
    {group: `common/`, block: `sprite-svg`},
    {group: `common/`, block: `link`},
    {group: `common/`, block: `post-stat`},
    {group: `common/`, block: `input`},
  ],
  'addStyleBefore': [
    `src/scss/variables.scss`,
    `src/scss/mixins.scss`, // создается автоматически
    `src/scss/normalize.scss`,
  ],
  'addStyleAfter': [
    // 'src/scss/print.scss',
  ],
  'notJs': [
    `!src/js/jquery-3.4.0.min.js`
  ],
  'addAssets': {
    'src/fonts/': `fonts/`,
    'src/js/jquery-3.4.0.min.js': `js/`,
    'src/js/jquery.nicescroll.min.js': `js/`,
    'src/js/ofi.min.js': `js/`
  },
  'dir': {
    'src': `src/`,
    'build': `build/`,
    'blocks': `src/blocks/`,
    'data': `src/data/`
  },
  'createBlock': {
    'f': [`scss`, `js`, `pug`, `img`, `md`],
    'default': [`scss`, `img`]
  }
};

module.exports = config;

$(window).on(`load resize`, () => {
  const niceScrollConf = {
    cursorcolor: `#2ac9b3`,
    cursorwidth: `4px`,
    background: `#e9f3ff`
  };

  if (window.matchMedia(mediaQuery.medium).matches) {
    $(`.how-it-works__scheme-wrapper`).
        niceScroll(`.how-it-works__scheme`, niceScrollConf);
  } else {
    $(`.how-it-works__scheme-wrapper`).getNiceScroll().remove();
  }
});

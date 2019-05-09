$(window).on(`load resize`, () => {
  let image = `${$(`.article-hero__img`).attr(`src`)}`;
  let overlay = `linear-gradient(rgba(138, 70, 198, 0.80) 0%, rgba(235, 87, 87, 0.5) 100%), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`;
  if (window.matchMedia(mediaQuery.medium).matches) {
    $(`.article-hero`).css({'backgroundImage': `${overlay}, url("${image}")`});
  } else {
    $(`.article-hero`).css({'backgroundImage': ``});
  }
});

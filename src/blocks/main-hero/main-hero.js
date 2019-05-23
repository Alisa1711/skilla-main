$(window).on(`load resize`, () => {
  if (window.matchMedia(mediaQuery.large).matches) {
    $(`.main-hero__inner`).append($(`.main-hero__top`));
  } else {
    $(`.main-hero`).append($(`.main-hero__top`));
  }
});

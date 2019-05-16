$(window).on(`load resize`, () => {
  if (!window.matchMedia(mediaQuery.medium).matches) {
    $(`.reviews__avatar`).each((i, avatar) => {
      if (i > 7) {
        $(avatar).addClass(`visually-hidden`);
      }
    });
  }
});

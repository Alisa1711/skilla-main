$(window).on(`load resize`, () => {
  if (window.matchMedia(mediaQuery.mediumOnly).matches) {
    $(`.article__fav-list .preview`).eq(2).addClass(`visually-hidden`);
  } else {
    $(`.article__fav-list .preview`).eq(2).removeClass(`visually-hidden`);
  }

  if (window.matchMedia(mediaQuery.large).matches) {
    $(`.article__note`).each(function () {
      let marginTopNext = parseInt($(this).next().css(`marginTop`), 10);
      let marginBottomPrev = parseInt($(this).prev().css(`marginBottom`), 10);
      let marginTop = Math.abs(marginTopNext - marginBottomPrev);

      $(this).css({'marginTop': `${marginTop}px`});
    });
  } else {
    $(`.article__note`).attr({'style': ``});
  }
});

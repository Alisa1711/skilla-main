(function () {
  let scrollTop;

  $(`.modal-trigger`).on(`click`, function () {
    scrollTop = $(document).scrollTop();
    let id = $(this).data(`modal`);
    $(`body`).addClass(`modal-opened`);
    $(`.overlay`).fadeIn(`fast`);
    $(id).slideDown(`fast`);
    if (window.matchMedia(mediaQuery.smallOnly).matches) {
      $(`body`).css(`top`, `${-scrollTop}px`);
    }
  });

  $(`.overlay`).on(`click`, function () {
    $(`body`).removeClass(`modal-opened`);
    $(`.modal`).fadeOut(`fast`);
    $(this).fadeOut(`fast`);
    if (window.matchMedia(mediaQuery.smallOnly).matches) {
      $(`body`).removeAttr(`style`);
      window.scroll(0, scrollTop);
    }
  });

  $(`.modal-close`).on(`click`, function () {
    $(`body`).removeClass(`modal-opened`);
    $(this).parent(`.modal`).fadeOut(`fast`);
    $(`.overlay`).fadeOut(`fast`);
    if (window.matchMedia(mediaQuery.smallOnly).matches) {
      $(`body`).removeAttr(`style`);
      window.scroll(0, scrollTop);
    }
  });
})();

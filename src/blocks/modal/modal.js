$(`.modal-trigger`).on(`click`, function () {
  closeModal($(this).closest(`.modal`));

  let id = $(this).data(`modal`);
  if (!$(this).data(`scroll`)) {
    $(`body`).addClass(`modal-opened`);
  }
  if ($(this).data(`overlay`) !== `off`) {
    $(`.overlay`).fadeIn(`fast`);
  }
  $(id).fadeIn(`fast`);
  if (window.matchMedia(mediaQuery.smallOnly).matches) {
    scrollTop = $(document).scrollTop();
    $(`body`).css(`top`, `${-scrollTop}px`);
  }
});

$(`.overlay`).on(`click`, () => {
  closeModal();
});

$(`.modal-close`).on(`click`, function () {
  closeModal($(this).closest(`.modal`));
});

$(`.modal-trigger`).on(`click`, function () {
  let id = $(this).data(`modal`);
  if (!$(this).data(`scroll`)) {
    $(`body`).addClass(`modal-opened`);
  }
  $(`.overlay`).fadeIn(`fast`);
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
  closeModal($(this).parent(`.modal`));
});

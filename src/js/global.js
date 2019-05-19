const mediaQuery = {
  smallOnly: `(max-width: 767px)`,
  medium: `(min-width: 768px)`,
  mediumOnly: `(min-width: 768px) and (max-width: 1199px)`,
  large: `(min-width: 1200px)`
};

let scrollTop;

const closeModal = (modal = $(`.modal`)) => {
  $(`body`).removeClass(`modal-opened`);
  $(`.overlay`).fadeOut(`fast`);
  modal.fadeOut(`fast`);
  if (window.matchMedia(mediaQuery.smallOnly).matches) {
    $(`body`).removeAttr(`style`);
    window.scroll(0, scrollTop);
  }
};

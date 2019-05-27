$(`.course-nav__link`).on(`click`, function (e) {
  let anchor = $(this);
  scrollTop = $(anchor.attr(`href`)).offset().top - $(`.header`).height();
  $(`html, body`).stop().animate({
    scrollTop
  }, 500);
  e.preventDefault();
  closeModal($(`#course-nav`));
});

$(`.program__lesson-top`).on(`click`, function () {
  $(this).next(`.program__descr`).slideToggle(`fast`);
  let video = $(this).closest(`.program__lesson`).find(`iframe`);
  video.attr(`src`, video.attr(`src`));
});

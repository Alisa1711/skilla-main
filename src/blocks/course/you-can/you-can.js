$(`.you-can__list .you-can__item:first-child`).
  addClass(`active`).
  next(`.you-can__descr`).slideDown(`fast`);

$(`.you-can__item`).on(`click`, function () {
  $(this).toggleClass(`active`).next(`.you-can__descr`).slideToggle(`fast`);
});

$(window).on(`scroll`, function () {
  if ($(this).scrollTop() > 20) {
    $(`.header`).addClass(`header--fix`);
  } else {
    $(`header`).removeClass(`header--fix`);
  }
});

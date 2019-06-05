(function () {
  const setArticleBg = () => {
    let image = $(`.article-hero__img:hidden`);
    let imageSrc = image.attr(`src`);
    let overlay = `linear-gradient(rgba(0, 23, 57, 0.8), rgba(0, 23, 57, 0.8))`;

    if ($(window).width() >= 1200) {
      $(`.article-hero`).css({'backgroundImage': `${overlay}, url("${imageSrc}")`});
      $(`.article-hero--main .container`).append($(`.top-posts`));
    } else if ($(window).width() >= 768) {
      $(`.article-hero`).css({'backgroundImage': `${overlay}, url("${imageSrc}")`});
      $(`.article-hero--main`).after($(`.top-posts`));
    } else {
      $(`.article-hero`).css({'backgroundImage': ``});
    }
  };

  setArticleBg();

  $(window).on(`resize`, () => {
    setArticleBg();
  });
})();

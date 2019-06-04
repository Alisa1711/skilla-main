(function () {
  const setArticleBg = () => {
    let image = $(`.article-hero__img:hidden`);
    let imageSrc = image.attr(`src`);
    let overlay = `linear-gradient(rgba(138, 70, 198, 0.80) 0%, rgba(235, 87, 87, 0.5) 100%), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`;

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

  $(window).on(`load resize`, () => {
    setArticleBg();
  });
})();

(function () {
  const setVideoPreview = () => {
    $(`.course-hero__video`).css(`backgroundImage`, `url("https://img.youtube.com/vi/${videoID}/maxresdefault.jpg")`);
  };
  const playVideo = () => {
    $(`.course-hero__video`).html(`<iframe src="https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`);
  };

  setVideoPreview();

  $(`.course-hero__video`).on(`click`, playVideo);
})();

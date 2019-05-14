(function () {

  const resizeIndicator = (tab) => {
    let tabPosition = tab.position();
    let tabPositionLeft = tabPosition.left + parseInt(tab.css(`marginLeft`), 10);
    let tabWidth = tab.innerWidth();

    tab.siblings(`.tabs__indicator`).attr(`style`, `left:${tabPositionLeft}px; width:${tabWidth}px`);
  };

  const setTabActive = (tab) => {
    let contentID = tab.data(`content`);
    let content = tab.closest(`.tabs`).find(contentID);

    tab.siblings(`.tabs__item`).
      removeClass(`active`).
      end().
      addClass(`active`);

    content.siblings(`.tabs__content-item`).
      removeClass(`active`).
      end().
      addClass(`active`);
  };

  $(`.tabs__item:first-child`).each(function () {
    setTabActive($(this));
    resizeIndicator($(this));
  });

  $(window).on(`load resize`, () => {
    $(`.tabs__item.active`).each(function () {
      resizeIndicator($(this));
    });
  });

  $(`.tabs__item`).on(`click`, function () {
    setTabActive($(this));
    resizeIndicator($(this));
  });

})();

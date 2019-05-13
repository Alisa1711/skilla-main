(function () {

  const firstTabs = $(`.tabs .tabs-item:first`);

  const setTabActive = (tab) => {
    let tabs = tab.closest(`.tabs`);
    let contentID = tab.data(`content`);
    let tabPosition = tab.position();
    let tabWidth = `${tab.innerWidth()}px`;

    tab.siblings(`.tabs-item`).
      removeClass(`active`).
      end().
      addClass(`active`);

    tabs.find(`.tabs-indicator`).css({
      'left': tabPosition.left,
      'width': tabWidth
    });

    tabs.find(`.tabs-content`).children().slideUp({
      duration: `fast`,
      complete() {
        tabs.find(contentID).slideDown(`fast`);
      }
    });
  };

  setTabActive(firstTabs);

  $(`.tabs-item`).on(`click`, function () {
    setTabActive($(this));
  });

})();

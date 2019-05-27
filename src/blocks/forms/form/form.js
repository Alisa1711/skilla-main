(function () {
  $(`.form__done`).hide();
  $(`.form .form__step:first-child`).show();
  $(`.form__steps-indicator-item:first-child`).addClass(`active`);

  $(`.form__step [name="next"]`).on(`click`, function () {
    let form = $(this).closest(`.form`);
    let steps = form.find(`.form__step`);
    let indicators = form.find(`.form__steps-indicator-item`);
    let currentStep = form.find(`.form__step:visible:first`);
    let stepIndex = currentStep.index() + 1;
    let nextStep = steps.eq(stepIndex);

    currentStep.hide();
    $(currentStep.data(`message`)).hide();

    nextStep.show();
    $(nextStep.data(`message`)).show();

    indicators.removeClass(`active`);
    indicators.eq(stepIndex).addClass(`active`);
  });
})();

$(`.form .form__step:first-child`).show();
let steps = $(`.form .form__step`);
let currentStep = 0;

$(`.form__step [name="next"]`).on(`click`, function () {
  $(this).closest(`.form__step`).hide();
  currentStep++;
  steps.eq(currentStep).show();
});

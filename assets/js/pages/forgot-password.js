(function () {
  "use strict";

  const form = document.getElementById("recoveryForm");
  const email = document.getElementById("recoveryEmail");
  const error = document.getElementById("emailError");
  const successState = document.getElementById("successState");
  const sentEmail = document.getElementById("sentEmail");
  const resendButton = document.getElementById("resendButton");

  if (!form || !email || !error || !successState) return;

  function validateEmail() {
    const value = email.value.trim();
    let message = "";
    if (!value) message = "يرجى إدخال البريد الإلكتروني.";
    else if (!email.validity.valid) message = "يرجى إدخال بريد إلكتروني صحيح.";

    email.closest(".form-field").classList.toggle("is-invalid", Boolean(message));
    email.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
    return !message;
  }

  email.addEventListener("blur", validateEmail);
  email.addEventListener("input", function () {
    if (email.getAttribute("aria-invalid") === "true") validateEmail();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateEmail()) {
      email.focus();
      return;
    }
    sentEmail.textContent = email.value.trim();
    form.hidden = true;
    successState.hidden = false;
  });

  resendButton.addEventListener("click", function () {
    resendButton.textContent = "تم إرسال الرمز مجددًا";
    resendButton.disabled = true;
    window.setTimeout(function () {
      resendButton.textContent = "إعادة إرسال الرمز";
      resendButton.disabled = false;
    }, 3000);
  });
})();

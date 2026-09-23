(function () {
  "use strict";

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.getElementById("passwordToggle");
  const formStatus = document.getElementById("formStatus");

  if (!form || !emailInput || !passwordInput || !passwordToggle) return;

  const fields = {
    email: {
      input: emailInput,
      error: document.getElementById("emailError"),
      messages: {
        missing: "يرجى إدخال البريد الإلكتروني.",
        invalid: "يرجى إدخال بريد إلكتروني صحيح."
      }
    },
    password: {
      input: passwordInput,
      error: document.getElementById("passwordError"),
      messages: {
        missing: "يرجى إدخال كلمة المرور.",
        short: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل."
      }
    }
  };

  function setFieldState(field, message) {
    const wrapper = field.input.closest(".form-field");
    const hasError = Boolean(message);

    wrapper.classList.toggle("is-invalid", hasError);
    field.input.setAttribute("aria-invalid", String(hasError));
    field.error.textContent = message || "";
    return !hasError;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) return setFieldState(fields.email, fields.email.messages.missing);
    if (!emailInput.validity.valid) {
      return setFieldState(fields.email, fields.email.messages.invalid);
    }
    return setFieldState(fields.email, "");
  }

  function validatePassword() {
    const value = passwordInput.value;
    if (!value) return setFieldState(fields.password, fields.password.messages.missing);
    if (value.length < 6) {
      return setFieldState(fields.password, fields.password.messages.short);
    }
    return setFieldState(fields.password, "");
  }

  passwordToggle.addEventListener("click", function () {
    const shouldShow = passwordInput.type === "password";
    passwordInput.type = shouldShow ? "text" : "password";
    passwordToggle.setAttribute("aria-pressed", String(shouldShow));
    passwordToggle.setAttribute("aria-label", shouldShow ? "إخفاء كلمة المرور" : "إظهار كلمة المرور");
    passwordToggle.querySelector("i").className = shouldShow ? "bi bi-eye-slash" : "bi bi-eye";
    passwordInput.focus();
  });

  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);

  emailInput.addEventListener("input", function () {
    if (emailInput.getAttribute("aria-invalid") === "true") validateEmail();
  });

  passwordInput.addEventListener("input", function () {
    if (passwordInput.getAttribute("aria-invalid") === "true") validatePassword();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    formStatus.textContent = "";

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    formStatus.textContent = "تم التحقق من البيانات، جارٍ تسجيل الدخول...";
  });
})();

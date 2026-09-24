(function () {
  "use strict";

  const form = document.getElementById("registerForm");
  if (!form) return;

  const roles = {
    customer: { label: "عميل" },
    designer: { label: "مصمم" },
    printshop: { label: "مطبعة" }
  };
  const roleInputs = Array.from(form.querySelectorAll('input[name="accountType"]'));
  const roleSections = Array.from(form.querySelectorAll(".role-fields"));
  const submitLabel = form.querySelector(".submit-button span");
  const formStatus = document.getElementById("formStatus");
  const terms = document.getElementById("terms");
  const termsError = document.getElementById("termsError");
  const password = document.getElementById("password");
  const passwordConfirm = document.getElementById("passwordConfirm");
  const steps = Array.from(form.querySelectorAll(".form-step"));
  const progressSteps = Array.from(form.querySelectorAll(".progress-step"));
  const nextButton = document.getElementById("nextStep");
  const previousButton = document.getElementById("previousStep");

  function showStep(number) {
    steps.forEach(function (step) {
      const active = Number(step.dataset.step) === number;
      step.hidden = !active;
      step.classList.toggle("is-active", active);
    });
    progressSteps.forEach(function (step) {
      step.classList.toggle("is-active", Number(step.dataset.progress) <= number);
    });
    formStatus.textContent = "";
  }

  function setRole(role) {
    roleSections.forEach(function (section) {
      const isActive = section.dataset.role === role;
      section.hidden = !isActive;
      section.querySelectorAll("input, select, textarea").forEach(function (field) {
        field.disabled = !isActive;
        if (!isActive) clearFieldError(field);
      });
    });
    submitLabel.textContent = "إنشاء حساب " + roles[role].label;
    formStatus.textContent = "";
  }

  function getFieldWrapper(field) {
    return field.closest(".form-field");
  }

  function clearFieldError(field) {
    const wrapper = getFieldWrapper(field);
    if (!wrapper) return;
    wrapper.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    const error = wrapper.querySelector(".field-error");
    if (error) error.textContent = "";
  }

  function showFieldError(field, message) {
    const wrapper = getFieldWrapper(field);
    if (!wrapper) return false;
    wrapper.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
    const error = wrapper.querySelector(".field-error");
    if (error) error.textContent = message;
    return false;
  }

  function validateField(field) {
    if (field.disabled || field.type === "radio" || field.type === "checkbox") return true;
    const value = field.value.trim();
    if (field.required && !value) return showFieldError(field, "هذا الحقل مطلوب.");
    if (field.type === "email" && value && !field.validity.valid) return showFieldError(field, "أدخل بريدًا إلكترونيًا صحيحًا.");
    if (field.type === "url" && value && !field.validity.valid) return showFieldError(field, "أدخل رابطًا صحيحًا يبدأ بـ https://");
    if (field === password && value.length < 8) return showFieldError(field, "كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
    if (field === passwordConfirm && value !== password.value) return showFieldError(field, "كلمتا المرور غير متطابقتين.");
    clearFieldError(field);
    return true;
  }

  function validateServices() {
    const activeSection = form.querySelector('.role-fields:not([hidden])');
    if (!activeSection || activeSection.dataset.role !== "printshop") return true;
    const services = Array.from(activeSection.querySelectorAll('input[name="services"]'));
    const wrapper = services[0].closest(".form-field");
    const error = wrapper.querySelector(".field-error");
    const valid = services.some(function (service) { return service.checked; });
    wrapper.classList.toggle("is-invalid", !valid);
    error.textContent = valid ? "" : "اختر خدمة طباعة واحدة على الأقل.";
    return valid;
  }

  roleInputs.forEach(function (input) {
    input.addEventListener("change", function () { setRole(input.value); });
  });

  form.querySelectorAll("input, select, textarea").forEach(function (field) {
    if (field.type !== "radio" && field.type !== "checkbox") {
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
        if (field === password && passwordConfirm.value) validateField(passwordConfirm);
      });
    }
  });

  form.querySelectorAll('input[name="services"]').forEach(function (service) {
    service.addEventListener("change", validateServices);
  });

  document.querySelectorAll(".password-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      const input = document.getElementById(button.dataset.target);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-label", show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور");
      button.querySelector("i").className = show ? "bi bi-eye-slash" : "bi bi-eye";
      input.focus();
    });
  });

  nextButton.addEventListener("click", function () {
    const firstStep = form.querySelector('[data-step="1"]');
    const fields = Array.from(firstStep.querySelectorAll("input:not(:disabled), select:not(:disabled), textarea:not(:disabled)"));
    let valid = true;
    fields.forEach(function (field) {
      if (field.type !== "radio" && field.type !== "checkbox" && !validateField(field)) valid = false;
    });
    if (!valid) {
      const firstInvalid = firstStep.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    showStep(2);
  });

  previousButton.addEventListener("click", function () { showStep(1); });

  terms.addEventListener("change", function () {
    termsError.textContent = terms.checked ? "" : "يجب الموافقة على الشروط والأحكام.";
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    formStatus.textContent = "";
    const activeFields = Array.from(form.querySelectorAll("input:not(:disabled), select:not(:disabled), textarea:not(:disabled)"));
    let valid = true;
    activeFields.forEach(function (field) {
      if (field.type !== "radio" && field.type !== "checkbox" && !validateField(field)) valid = false;
    });
    if (!validateServices()) valid = false;
    if (!terms.checked) {
      termsError.textContent = "يجب الموافقة على الشروط والأحكام.";
      valid = false;
    }
    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"], .is-invalid input, .is-invalid select, .is-invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    const selectedRole = form.querySelector('input[name="accountType"]:checked').value;
    formStatus.textContent = "تم التحقق من بيانات حساب " + roles[selectedRole].label + " بنجاح.";
  });

  setRole(form.querySelector('input[name="accountType"]:checked').value);
  showStep(1);
})();

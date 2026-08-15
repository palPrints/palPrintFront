"use strict";

/* =========================================================
   PalPrints — Designer Profile
   File: assets/js/pages/designerProfile.js
   يعتمد على: assets/js/pages/profile-core.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const Core = window.PalProfile;

  if (!Core) {
    console.error("لم يتم تحميل profile-core.js قبل designerProfile.js");
    return;
  }

  /* =======================================================
     القاموس
     ======================================================= */

  const dictionary = {
    ar: {
      documentTitle: "الملف الشخصي للمصمم | PalPrints",
      documentDescription: "الملف الشخصي للمصمم في منصة PalPrints",

      skipToContent: "تخطي إلى المحتوى",
      sidebarLabel: "القائمة الجانبية للمصمم",
      designerNavLabel: "روابط حساب المصمم",
      breadcrumbLabel: "مسار التنقل",
      goHome: "الانتقال إلى الصفحة الرئيسية",
      openSidebar: "فتح القائمة الجانبية",
      closeSidebar: "إغلاق القائمة الجانبية",
      goBack: "الرجوع إلى الصفحة السابقة",
      back: "رجوع",
      close: "إغلاق",

      changeTheme: "تغيير المظهر",
      switchToDark: "تفعيل الوضع الليلي",
      switchToLight: "تفعيل الوضع النهاري",
      changeLanguage: "تغيير اللغة",
      shoppingCart: "سلة المشتريات",
      notifications: "الإشعارات",

      home: "الرئيسية",
      profileTitle: "الملف الشخصي",
      myDesigns: "تصاميمي",
      uploadDesign: "رفع تصميم جديد",
      ordersAndSales: "الطلبات والمبيعات",
      walletAndEarnings: "الأرباح والمحفظة",
      withdrawals: "طلبات السحب",
      settingsSecurity: "الإعدادات والأمان",
      support: "التواصل مع الدعم الفني",
      logout: "تسجيل الخروج",
      logoutConfirm: "هل تريد تسجيل الخروج من حسابك؟",

      designerPhoto: "صورة المصمم",
      changePhoto: "تغيير الصورة الشخصية",
      location: "غزة، فلسطين",
      listSeparator: "، ",

      /* بيانات العرض التجريبية — تُستبدل ببيانات المستخدم الحقيقية */
      demoDesignerName: "سارة أحمد",
      demoDesignerRole: "مصممة جرافيك",
      demoSpecialization: "تصميم جرافيك وهويات بصرية",
      demoExperience: "3 سنوات",
      demoJoinDate: "10 يناير 2024",
      demoAbout:
        "مصممة جرافيك شغوفة بتحويل الأفكار إلى تصاميم إبداعية ومؤثرة، " +
        "متخصصة في الهويات البصرية والمطبوعات وتصميمات المنتجات.",
      demoSkills: [
        "تصميم الشعارات",
        "تصميم المطبوعات",
        "تصميم السوشيال ميديا",
        "أدوبي إليستريتور",
        "أدوبي فوتوشوب",
        "كانفا برو"
      ],

      editProfile: "تعديل الملف الشخصي",
      editProfileDescription: "عدّلي معلوماتك المهنية ثم احفظي التغييرات.",
      viewPortfolio: "عرض معرض الأعمال",

      /* حالات اعتماد الحساب */
      approvalApproved: "مصممة معتمدة",
      approvalPending: "قيد المراجعة",
      approvalRejected: "مرفوض",
      approvalIncomplete: "يحتاج استكمال بيانات",
      approvalPendingTitle: "حسابك قيد المراجعة",
      approvalPendingText:
        "يراجع فريق PalPrints بياناتك حالياً، وسيصلك إشعار فور اكتمال المراجعة.",
      approvalRejectedTitle: "تم رفض طلب الاعتماد",
      approvalRejectedText:
        "راجع ملاحظات فريق المراجعة وأعد إرسال بياناتك مرة أخرى.",
      approvalIncompleteTitle: "بيانات الاعتماد غير مكتملة",
      approvalIncompleteText:
        "أكمل البيانات والمستندات المطلوبة ليتم اعتماد حسابك ونشر تصاميمك.",
      completeVerification: "استكمال بيانات الاعتماد",

      designsStatus: "حالة تصاميمك",
      statusDraft: "مسودة",
      statusPublished: "منشور",
      statusUnderReview: "قيد المراجعة",
      statusRejected: "مرفوض",
      viewAllDesigns: "عرض جميع التصاميم",

      performanceSummary: "ملخص الأداء",
      publishedDesigns: "تصميماً منشوراً",
      underReviewDesigns: "قيد المراجعة",
      salesCount: "عملية بيع",
      generalRating: "التقييم العام",

      portfolio: "معرض الأعمال",
      portfolioLink: "رابط المعرض",
      editPortfolio: "تعديل",
      editPortfolioTitle: "معرض الأعمال",
      editPortfolioDescription:
        "أضيفي رابط معرض أعمالك ليتمكن العملاء من الاطلاع عليه.",
      addPortfolio: "إضافة معرض الأعمال",
      showPortfolio: "عرض المعرض",
      portfolioItemBranding: "هوية بصرية",
      portfolioItemPackaging: "تغليف منتجات",
      portfolioItemSocial: "سوشيال ميديا",

      mySkills: "مهاراتي",
      editSkills: "تعديل المهارات",
      editSkillsDescription: "افصلي بين المهارات بفاصلة.",
      skillsField: "المهارات — افصلي بينها بفاصلة",
      aboutMe: "نبذة عني",
      editAbout: "تعديل",
      editAboutTitle: "تعديل النبذة",
      editAboutDescription: "عرّفي العملاء بأسلوبك وخبراتك في سطور قصيرة.",

      accountInformation: "معلومات الحساب",
      editInformation: "تعديل المعلومات",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      specialization: "التخصص",
      experience: "الخبرة",
      workLocation: "موقع العمل",
      joinDate: "تاريخ الانضمام",
      fullName: "الاسم الكامل",
      professionalTitle: "المسمى المهني",
      manageSecurity: "إدارة الأمان",
      securityNote:
        "كلمة المرور وإعدادات الأمان تُدار من «الإعدادات والأمان».",
      passwordMovedNote:
        "تغيير كلمة المرور أصبح ضمن «الإعدادات والأمان».",

      totalEarnings: "إجمالي الأرباح",
      availableForWithdrawal: "متاح للسحب",
      pendingEarnings: "أرباح معلقة",
      requestWithdrawal: "طلب سحب",
      withdrawalNote:
        "تُحوّل الأرباح المتاحة خلال ٣ أيام عمل بعد الموافقة على الطلب.",
      withdrawalRequested: "تم إرسال طلب السحب، سيصلك إشعار عند الموافقة.",

      cancel: "إلغاء",
      saveChanges: "حفظ التغييرات",
      saving: "جارٍ الحفظ…",
      saveSuccess: "تم حفظ التغييرات بنجاح.",
      requiredField: "هذا الحقل مطلوب.",
      invalidEmail: "أدخل بريداً إلكترونياً صحيحاً.",
      invalidLink: "أدخل رابطاً صحيحاً يبدأ بـ https.",

      errorTitle: "تعذر تحميل البيانات",
      errorHeroText:
        "حدث خطأ أثناء جلب بيانات حسابك، تحقق من الاتصال ثم أعد المحاولة.",
      retry: "إعادة المحاولة",
      emptyDesignsTitle: "لا توجد تصاميم بعد",
      emptyDesignsText:
        "ابدأ برفع أول تصميم لك ليظهر هنا مع حالته ومراحل مراجعته.",
      emptyPortfolioTitle: "لم تُضِف معرض أعمال بعد",
      emptyPortfolioText:
        "أضف رابط معرض أعمالك ليطّلع عليه العملاء وتزيد فرص بيع تصاميمك.",

      preferenceOn: "تم التفعيل",
      preferenceOff: "تم الإيقاف",

      avatarTypeError: "يُسمح بصور PNG أو JPG أو WEBP فقط.",
      avatarSizeError: "حجم الصورة يجب أن يكون أقل من 2 ميجابايت.",
      avatarReadError: "تعذر قراءة الصورة.",
      avatarSuccess: "تم تحديث الصورة بنجاح."
    },

    en: {
      documentTitle: "Designer Profile | PalPrints",
      documentDescription: "Designer profile on the PalPrints platform",

      skipToContent: "Skip to content",
      sidebarLabel: "Designer sidebar",
      designerNavLabel: "Designer account links",
      breadcrumbLabel: "Breadcrumb",
      goHome: "Go to the home page",
      openSidebar: "Open sidebar",
      closeSidebar: "Close sidebar",
      goBack: "Go back to the previous page",
      back: "Back",
      close: "Close",

      changeTheme: "Change theme",
      switchToDark: "Switch to dark mode",
      switchToLight: "Switch to light mode",
      changeLanguage: "Change language",
      shoppingCart: "Shopping cart",
      notifications: "Notifications",

      home: "Home",
      profileTitle: "Profile",
      myDesigns: "My designs",
      uploadDesign: "Upload new design",
      ordersAndSales: "Orders & sales",
      walletAndEarnings: "Wallet & earnings",
      withdrawals: "Withdrawal requests",
      settingsSecurity: "Settings & security",
      support: "Contact support",
      logout: "Log out",
      logoutConfirm: "Do you want to log out of your account?",

      designerPhoto: "Designer photo",
      changePhoto: "Change profile photo",
      location: "Gaza, Palestine",
      listSeparator: ", ",

      demoDesignerName: "Sara Ahmed",
      demoDesignerRole: "Graphic designer",
      demoSpecialization: "Graphic design & brand identity",
      demoExperience: "3 years",
      demoJoinDate: "10 January 2024",
      demoAbout:
        "A graphic designer passionate about turning ideas into creative, " +
        "impactful work — specialised in brand identities, print and " +
        "product design.",
      demoSkills: [
        "Logo design",
        "Print design",
        "Social media design",
        "Adobe Illustrator",
        "Adobe Photoshop",
        "Canva Pro"
      ],

      editProfile: "Edit profile",
      editProfileDescription:
        "Update your professional details and save the changes.",
      viewPortfolio: "View portfolio",

      approvalApproved: "Verified designer",
      approvalPending: "Under review",
      approvalRejected: "Rejected",
      approvalIncomplete: "Needs more information",
      approvalPendingTitle: "Your account is under review",
      approvalPendingText:
        "The PalPrints team is reviewing your details and you will be notified once it is done.",
      approvalRejectedTitle: "Verification request rejected",
      approvalRejectedText:
        "Review the team's notes and submit your details again.",
      approvalIncompleteTitle: "Verification details are incomplete",
      approvalIncompleteText:
        "Complete the required details and documents so your account can be verified.",
      completeVerification: "Complete verification",

      designsStatus: "Your designs status",
      statusDraft: "Draft",
      statusPublished: "Published",
      statusUnderReview: "Under review",
      statusRejected: "Rejected",
      viewAllDesigns: "View all designs",

      performanceSummary: "Performance summary",
      publishedDesigns: "Published designs",
      underReviewDesigns: "Under review",
      salesCount: "Sales",
      generalRating: "Overall rating",

      portfolio: "Portfolio",
      portfolioLink: "Portfolio link",
      editPortfolio: "Edit",
      editPortfolioTitle: "Portfolio",
      editPortfolioDescription:
        "Add your portfolio link so customers can explore your work.",
      addPortfolio: "Add portfolio",
      showPortfolio: "Open portfolio",
      portfolioItemBranding: "Brand identity",
      portfolioItemPackaging: "Product packaging",
      portfolioItemSocial: "Social media",

      mySkills: "My skills",
      editSkills: "Edit skills",
      editSkillsDescription: "Separate skills with a comma.",
      skillsField: "Skills — separate them with a comma",
      aboutMe: "About me",
      editAbout: "Edit",
      editAboutTitle: "Edit about",
      editAboutDescription:
        "Introduce your style and experience in a few short lines.",

      accountInformation: "Account information",
      editInformation: "Edit information",
      email: "Email",
      phone: "Phone number",
      specialization: "Specialization",
      experience: "Experience",
      workLocation: "Work location",
      joinDate: "Join date",
      fullName: "Full name",
      professionalTitle: "Professional title",
      manageSecurity: "Manage security",
      securityNote:
        "Password and security settings are managed in “Settings & security”.",
      passwordMovedNote:
        "Password changes now live in “Settings & security”.",

      totalEarnings: "Total earnings",
      availableForWithdrawal: "Available to withdraw",
      pendingEarnings: "Pending earnings",
      requestWithdrawal: "Request withdrawal",
      withdrawalNote:
        "Available earnings are transferred within 3 business days after approval.",
      withdrawalRequested:
        "Withdrawal request sent — you will be notified once approved.",

      cancel: "Cancel",
      saveChanges: "Save changes",
      saving: "Saving…",
      saveSuccess: "Changes saved successfully.",
      requiredField: "This field is required.",
      invalidEmail: "Enter a valid email address.",
      invalidLink: "Enter a valid link starting with https.",

      errorTitle: "Could not load data",
      errorHeroText:
        "Something went wrong while loading your account. Check your connection and try again.",
      retry: "Try again",
      emptyDesignsTitle: "No designs yet",
      emptyDesignsText:
        "Upload your first design to see its status and review progress here.",
      emptyPortfolioTitle: "No portfolio added yet",
      emptyPortfolioText:
        "Add your portfolio link so customers can explore your work and buy more designs.",

      preferenceOn: "enabled",
      preferenceOff: "disabled",

      avatarTypeError: "Only PNG, JPG or WEBP images are allowed.",
      avatarSizeError: "Image size must be under 2 MB.",
      avatarReadError: "Could not read the image.",
      avatarSuccess: "Photo updated successfully."
    }
  };

  Core.init({ dictionary: dictionary });

  /* =======================================================
     بيانات تجريبية — تُستبدل بنداءات API
     ======================================================= */

  /* الحالات المتاحة: approved | pending | rejected | incomplete */

  /* about و skills تبقيان null إلى أن يعدّلهما المستخدم،
     فتُعرض حتى ذلك الحين النسخة التجريبية بلغة الصفحة. */

  const designer = {
    approvalStatus: "approved",
    portfolioUrl: "https://behance.net/sara-design",
    about: null,
    skills: null
  };

  function designerAbout() {
    return designer.about || Core.translate("demoAbout");
  }

  function designerSkills() {
    if (designer.skills) {
      return designer.skills;
    }

    const demo = Core.translate("demoSkills");

    return Array.isArray(demo) ? demo : [];
  }

  function fakeRequest(payload, delay) {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve(payload);
      }, delay || 550);
    });
  }

  /* =======================================================
     حالة اعتماد الحساب
     ======================================================= */

  const approvalBadge = document.getElementById("designerApprovalBadge");
  const approvalText = document.getElementById("designerApprovalText");
  const approvalAlert = document.getElementById("approvalAlert");
  const approvalAlertTitle = document.getElementById("approvalAlertTitle");
  const approvalAlertText = document.getElementById("approvalAlertText");

  const APPROVAL_MAP = {
    approved: {
      className: "is-approved",
      icon: "bi-patch-check-fill",
      labelKey: "approvalApproved"
    },
    pending: {
      className: "is-pending",
      icon: "bi-hourglass-split",
      labelKey: "approvalPending",
      alertClass: "",
      titleKey: "approvalPendingTitle",
      textKey: "approvalPendingText"
    },
    rejected: {
      className: "is-rejected",
      icon: "bi-x-octagon",
      labelKey: "approvalRejected",
      alertClass: "is-rejected",
      titleKey: "approvalRejectedTitle",
      textKey: "approvalRejectedText"
    },
    incomplete: {
      className: "is-incomplete",
      icon: "bi-exclamation-circle",
      labelKey: "approvalIncomplete",
      alertClass: "is-incomplete",
      titleKey: "approvalIncompleteTitle",
      textKey: "approvalIncompleteText"
    }
  };

  function renderApprovalStatus() {
    const config =
      APPROVAL_MAP[designer.approvalStatus] || APPROVAL_MAP.pending;

    if (approvalBadge) {
      approvalBadge.className = "profile-badge " + config.className;

      const icon = approvalBadge.querySelector("i");

      if (icon) {
        icon.className = "bi " + config.icon;
      }
    }

    if (approvalText) {
      approvalText.textContent = Core.translate(config.labelKey);
    }

    if (!approvalAlert) {
      return;
    }

    if (designer.approvalStatus === "approved") {
      approvalAlert.hidden = true;
      return;
    }

    approvalAlert.hidden = false;

    approvalAlert.className =
      "designer-approval-alert " + (config.alertClass || "");

    if (approvalAlertTitle) {
      approvalAlertTitle.textContent = Core.translate(config.titleKey);
    }

    if (approvalAlertText) {
      approvalAlertText.textContent = Core.translate(config.textKey);
    }
  }

  /* =======================================================
     المهارات
     ======================================================= */

  const skillsList = document.getElementById("skillsList");

  function renderSkills() {
    if (!skillsList) {
      return;
    }

    skillsList.innerHTML = "";

    designerSkills().forEach(function (skill) {
      const item = document.createElement("li");
      item.className = "designer-skill";
      item.textContent = skill;

      skillsList.appendChild(item);
    });
  }

  /* =======================================================
     النبذة ومعرض الأعمال
     ======================================================= */

  const aboutElement = document.getElementById("designerAbout");
  const portfolioSection = document.getElementById("portfolioSection");
  const portfolioLink = document.getElementById("portfolioLink");
  const portfolioLinkText = document.getElementById("portfolioLinkText");

  function renderAbout() {
    if (aboutElement) {
      aboutElement.textContent = designerAbout();
    }
  }

  function renderPortfolio() {
    if (!portfolioLink || !portfolioLinkText) {
      return;
    }

    if (!designer.portfolioUrl) {
      Core.setState(portfolioSection, "empty");
      return;
    }

    portfolioLink.href = designer.portfolioUrl;

    portfolioLinkText.textContent = designer.portfolioUrl
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");

    Array.prototype.forEach.call(
      portfolioSection.querySelectorAll('a[target="_blank"]'),
      function (link) {
        link.href = designer.portfolioUrl;
      }
    );

    Core.setState(portfolioSection, "ready");
  }

  /* =======================================================
     النماذج
     ======================================================= */

  function clearFieldErrors(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll(".profile-field"),
      function (field) {
        field.classList.remove("has-error");

        const input = field.querySelector("input, select, textarea");

        if (input) {
          input.removeAttribute("aria-invalid");
        }
      }
    );
  }

  function validate(form, inputs) {
    clearFieldErrors(form);

    let valid = true;

    inputs.forEach(function (input) {
      if (!input) {
        return;
      }

      const value = String(input.value || "").trim();
      const field = input.closest(".profile-field");

      let ok = Boolean(value);

      if (ok && input.type === "email") {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      if (ok && input.type === "url") {
        ok = /^https?:\/\/.+\..+/.test(value);
      }

      if (!ok) {
        valid = false;

        if (field) {
          field.classList.add("has-error");
        }

        input.setAttribute("aria-invalid", "true");
      }
    });

    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');

      if (firstInvalid) {
        firstInvalid.focus();
      }
    }

    return valid;
  }

  /* تعديل الملف الشخصي — نافذة واحدة تضم كل الحقول */

  const editForm = document.getElementById("designerEditForm");
  const editSave = document.getElementById("designerEditSave");

  /* عناصر العرض التي تتغذى من النافذة */

  const displayFields = {
    name: document.getElementById("designerName"),
    role: document.getElementById("designerRole"),
    email: document.getElementById("designerEmail"),
    phone: document.getElementById("designerPhone"),
    location: document.getElementById("designerLocation"),
    infoEmail: document.getElementById("infoEmail"),
    infoPhone: document.getElementById("infoPhone"),
    infoSpecialization: document.getElementById("infoSpecialization"),
    infoExperience: document.getElementById("infoExperience"),
    infoLocation: document.getElementById("infoLocation")
  };

  /* بعد أن يكتب المستخدم بياناته الحقيقية لا يجوز
     أن يستبدلها مبدّل اللغة بالنص التجريبي المترجم */

  function keepUserValue(element, value) {
    if (!element) {
      return;
    }

    element.removeAttribute("data-i18n");
    element.textContent = value;
  }

  function editInput(id) {
    return document.getElementById(id);
  }

  /* تُملأ الحقول من القيم المعروضة حالياً حتى تتبع اللغة النشطة */

  const editDialog = Core.setupDialog("designerEditDialog", {
    onOpen: function () {
      const pairs = [
        ["editFullName", displayFields.name],
        ["editRole", displayFields.role],
        ["editEmail", displayFields.email],
        ["editPhone", displayFields.phone],
        ["editSpecialization", displayFields.infoSpecialization],
        ["editExperience", displayFields.infoExperience],
        ["editLocation", displayFields.location]
      ];

      pairs.forEach(function (pair) {
        const input = editInput(pair[0]);

        if (input && pair[1]) {
          input.value = pair[1].textContent.trim();
        }
      });

      const portfolioValue = editInput("portfolioInput");
      const skillsValue = editInput("skillsInput");
      const aboutValue = editInput("aboutInput");

      if (portfolioValue) {
        portfolioValue.value = designer.portfolioUrl || "";
      }

      if (skillsValue) {
        skillsValue.value = designerSkills().join(
          Core.translate("listSeparator")
        );
      }

      if (aboutValue) {
        aboutValue.value = designerAbout();
      }

      if (editForm) {
        clearFieldErrors(editForm);
      }
    }
  });

  if (editForm) {
    editForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = editInput("editFullName");
      const role = editInput("editRole");
      const email = editInput("editEmail");
      const phone = editInput("editPhone");
      const specialization = editInput("editSpecialization");
      const experience = editInput("editExperience");
      const location = editInput("editLocation");
      const skillsInput = editInput("skillsInput");
      const aboutInput = editInput("aboutInput");
      const portfolioUrlInput = editInput("portfolioInput");

      const inputs = [
        fullName,
        role,
        email,
        phone,
        specialization,
        experience,
        location,
        skillsInput,
        aboutInput
      ];

      let valid = validate(editForm, inputs);

      /* رابط المعرض اختياري، ويُتحقق منه فقط عند كتابته */

      if (portfolioUrlInput) {
        const link = String(portfolioUrlInput.value || "").trim();
        const field = portfolioUrlInput.closest(".profile-field");

        if (link && !/^https?:\/\/.+\..+/.test(link)) {
          valid = false;

          if (field) {
            field.classList.add("has-error");
          }
        }
      }

      if (!valid) {
        return;
      }

      const label = editSave.querySelector("span");
      const originalText = label ? label.textContent : "";

      if (label) {
        label.textContent = Core.translate("saving");
      }

      editSave.disabled = true;

      fakeRequest(true, 650).then(function () {
        keepUserValue(displayFields.name, fullName.value.trim());
        keepUserValue(displayFields.role, role.value.trim());
        keepUserValue(displayFields.email, email.value.trim());
        keepUserValue(displayFields.phone, phone.value.trim());
        keepUserValue(displayFields.location, location.value.trim());
        keepUserValue(displayFields.infoEmail, email.value.trim());
        keepUserValue(displayFields.infoPhone, phone.value.trim());

        keepUserValue(
          displayFields.infoSpecialization,
          specialization.value.trim()
        );

        keepUserValue(displayFields.infoExperience, experience.value.trim());
        keepUserValue(displayFields.infoLocation, location.value.trim());

        designer.skills = skillsInput.value
          .split(/[،,]/)
          .map(function (skill) {
            return skill.trim();
          })
          .filter(Boolean);

        designer.about = aboutInput.value.trim();

        if (portfolioUrlInput) {
          designer.portfolioUrl = portfolioUrlInput.value.trim();
        }

        renderSkills();
        renderAbout();
        renderPortfolio();

        if (label) {
          label.textContent = originalText;
        }

        editSave.disabled = false;

        editDialog.close();

        Core.toast(Core.translate("saveSuccess"), "success");
      });
    });
  }

  /* طلب سحب */

  const withdrawButton = document.getElementById("withdrawButton");

  if (withdrawButton) {
    withdrawButton.addEventListener("click", function () {
      withdrawButton.disabled = true;

      fakeRequest(true, 600).then(function () {
        withdrawButton.disabled = false;

        Core.toast(Core.translate("withdrawalRequested"), "success");
      });
    });
  }

  /* =======================================================
     تحميل الأقسام
     ======================================================= */

  const heroSection = document.getElementById("profileHero");
  const designsSection = document.getElementById("designsStatusSection");
  const performanceSection = document.getElementById("performanceSection");
  const walletSection = document.getElementById("walletSection");

  function loadHero() {
    Core.loadSection(heroSection, function () {
      return fakeRequest(designer, 450);
    }).then(function () {
      renderApprovalStatus();
    });
  }

  function loadDesigns() {
    Core.loadSection(
      designsSection,
      function () {
        return fakeRequest({ published: 12 }, 600);
      },
      {
        isEmpty: function (result) {
          return !result;
        }
      }
    );
  }

  function loadPerformance() {
    Core.loadSection(performanceSection, function () {
      return fakeRequest({ rating: 4.8 }, 550);
    });
  }

  function loadWallet() {
    Core.loadSection(walletSection, function () {
      return fakeRequest({ total: 1090 }, 700);
    });
  }

  function loadPortfolio() {
    Core.setState(portfolioSection, "loading");

    fakeRequest(designer.portfolioUrl, 500).then(function () {
      renderPortfolio();
    });
  }

  Core.onRetry(heroSection, loadHero);
  Core.onRetry(designsSection, loadDesigns);
  Core.onRetry(performanceSection, loadPerformance);
  Core.onRetry(walletSection, loadWallet);
  Core.onRetry(portfolioSection, loadPortfolio);

  renderSkills();
  renderAbout();

  loadHero();
  loadDesigns();
  loadPerformance();
  loadWallet();
  loadPortfolio();

  /* =======================================================
     إعادة الرسم عند تغيير اللغة
     ======================================================= */

  Core.onLanguageChange(function () {
    renderApprovalStatus();

    /* المهارات والنبذة تُرسمان بالـ JS فلا يصلهما مبدّل النصوص،
       ونعيد رسمهما ما دامتا بالنسخة التجريبية */

    renderSkills();
    renderAbout();
  });
});

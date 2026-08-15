"use strict";

/* =========================================================
   PalPrints — Customer Profile
   File: assets/js/pages/custProfile.js
   يعتمد على: assets/js/pages/profile-core.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const Core = window.PalProfile;

  if (!Core) {
    console.error("لم يتم تحميل profile-core.js قبل custProfile.js");
    return;
  }

  /* =======================================================
     القاموس
     ======================================================= */

  const dictionary = {
    ar: {
      documentTitle: "الملف الشخصي | PalPrints",
      documentDescription: "الملف الشخصي للعميل في منصة PalPrints",

      skipToContent: "تخطي إلى المحتوى",
      sidebarLabel: "القائمة الجانبية للعميل",
      customerNavLabel: "روابط حساب العميل",
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
      myOrders: "طلباتي",
      favorites: "المفضلة",
      savedCustomizations: "تخصيصاتي المحفوظة",
      shippingAddresses: "عناوين الشحن",
      settingsSecurity: "الإعدادات والأمان",
      support: "التواصل مع الدعم الفني",
      logout: "تسجيل الخروج",
      logoutConfirm: "هل تريد تسجيل الخروج من حسابك؟",

      welcomeBack: "مرحباً بعودتك",
      customerRole: "عميل PalPrints",
      customerPhoto: "صورة العميل",
      location: "غزة، فلسطين",
      listSeparator: "، ",

      /* بيانات العرض التجريبية — تُستبدل ببيانات المستخدم الحقيقية */
      demoCustomerName: "أحمد محمد",
      demoAddressTitle: "المنزل",
      demoAddressCity: "غزة",
      demoAddressDetails: "الرمال، شارع الوحدة",
      changePhoto: "تغيير الصورة الشخصية",
      editProfile: "تعديل الملف الشخصي",
      editProfileDescription: "حدّث بياناتك الأساسية ثم احفظ التغييرات.",

      currentOrder: "طلبك الحالي",
      orderNumber: "رقم الطلب",
      statusOutForDelivery: "قيد التوصيل",
      trackerLabel: "مراحل تنفيذ الطلب",
      stepConfirmed: "تم التأكيد",
      stepPrinting: "قيد الطباعة",
      stepShipped: "تم الشحن",
      stepOutForDelivery: "قيد التوصيل",
      trackOrder: "تتبع الطلب",
      startNewOrder: "ابدأ طلباً جديداً",

      activitySummary: "ملخص نشاطك",
      activeOrders: "طلب نشط",
      outForDelivery: "قيد التوصيل",
      completedOrders: "طلبات مكتملة",
      inFavorites: "في المفضلة",

      myLibrary: "مكتبتي",
      myLibraryDescription: "فرقٌ بسيط بين ما أعجبك وما بدأت بتخصيصه.",
      favoritesDescription:
        "التصاميم والمنتجات التي أعجبتك واحتفظت بها للرجوع إليها.",
      savedCustomizationsDescription:
        "منتجات خصّصتها بتصميمك ولم تُكمل طلبها بعد، يمكنك متابعتها لاحقاً.",

      addAddress: "إضافة عنوان",
      editAddress: "تعديل العنوان",
      deleteAddress: "حذف",
      setAsDefault: "تعيين كعنوان افتراضي",
      defaultAddress: "العنوان الافتراضي",
      makeDefault: "تعيين كافتراضي",
      addressLabel: "اسم العنوان",
      addressLabelHint: "المنزل، العمل…",
      addressDetails: "تفاصيل العنوان",
      addressDetailsHint: "الحي، الشارع، أقرب معلم",
      addressDialogDescription:
        "أدخل تفاصيل العنوان بدقة ليصل الطلب في الوقت المحدد.",
      saveAddress: "حفظ العنوان",
      addressSaved: "تم حفظ العنوان بنجاح.",
      addressDeleted: "تم حذف العنوان.",
      addressDefaultSet: "تم تعيين العنوان الافتراضي.",
      addressDeleteConfirm: "هل تريد حذف هذا العنوان؟",
      addressDeleteTitle: "حذف عنوان الشحن",
      addressDeleteDescription:
        "سيتم حذف العنوان التالي من حسابك. لن يتم تغيير أي طلب قائم.",
      confirmDeleteAddress: "حذف العنوان",
      addressDeleteDefaultBlocked:
        "لا يمكن حذف العنوان الافتراضي، عيّن عنواناً افتراضياً آخر أولاً.",

      notificationPreferences: "تفضيلات الإشعارات",
      preferenceOffers: "العروض والتحديثات عبر البريد الإلكتروني",
      preferenceOrderUpdates: "تحديثات حالة الطلب",
      preferenceOn: "تم التفعيل",
      preferenceOff: "تم الإيقاف",
      securityNote:
        "لتغيير كلمة المرور وإعدادات الأمان انتقل إلى «الإعدادات والأمان».",
      passwordMovedNote:
        "تغيير كلمة المرور أصبح ضمن «الإعدادات والأمان» لحماية حسابك.",

      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      city: "المدينة",
      cancel: "إلغاء",
      saveChanges: "حفظ التغييرات",
      saving: "جارٍ الحفظ…",
      saveSuccess: "تم حفظ التغييرات بنجاح.",
      requiredField: "هذا الحقل مطلوب.",
      invalidEmail: "أدخل بريداً إلكترونياً صحيحاً.",

      errorTitle: "تعذر تحميل البيانات",
      errorHeroText:
        "حدث خطأ أثناء جلب بيانات حسابك، تحقق من الاتصال ثم أعد المحاولة.",
      errorOrderText:
        "لم نتمكن من جلب حالة طلبك الحالي، أعد المحاولة بعد قليل.",
      errorAddressText: "لم نتمكن من جلب عناوين الشحن الخاصة بك.",
      retry: "إعادة المحاولة",
      emptyOrderTitle: "لا يوجد طلب نشط حالياً",
      emptyOrderText:
        "عند إنشاء طلب جديد ستظهر هنا مراحل تنفيذه وحالة الشحن.",
      emptyAddressTitle: "لا توجد عناوين محفوظة",
      emptyAddressText:
        "أضف عنوان الشحن الأول ليصل طلبك بسرعة إلى المكان الصحيح.",

      avatarTypeError: "يُسمح بصور PNG أو JPG أو WEBP فقط.",
      avatarSizeError: "حجم الصورة يجب أن يكون أقل من 2 ميجابايت.",
      avatarReadError: "تعذر قراءة الصورة.",
      avatarSuccess: "تم تحديث الصورة بنجاح."
    },

    en: {
      documentTitle: "Profile | PalPrints",
      documentDescription: "Customer profile on the PalPrints platform",

      skipToContent: "Skip to content",
      sidebarLabel: "Customer sidebar",
      customerNavLabel: "Customer account links",
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
      myOrders: "My orders",
      favorites: "Favorites",
      savedCustomizations: "Saved customizations",
      shippingAddresses: "Shipping addresses",
      settingsSecurity: "Settings & security",
      support: "Contact support",
      logout: "Log out",
      logoutConfirm: "Do you want to log out of your account?",

      welcomeBack: "Welcome back",
      customerRole: "PalPrints customer",
      customerPhoto: "Customer photo",
      location: "Gaza, Palestine",
      listSeparator: ", ",

      demoCustomerName: "Ahmed Mohammed",
      demoAddressTitle: "Home",
      demoAddressCity: "Gaza",
      demoAddressDetails: "Al-Rimal, Al-Wehda Street",
      changePhoto: "Change profile photo",
      editProfile: "Edit profile",
      editProfileDescription: "Update your basic details and save changes.",

      currentOrder: "Your current order",
      orderNumber: "Order number",
      statusOutForDelivery: "Out for delivery",
      trackerLabel: "Order progress steps",
      stepConfirmed: "Confirmed",
      stepPrinting: "Printing",
      stepShipped: "Shipped",
      stepOutForDelivery: "Out for delivery",
      trackOrder: "Track order",
      startNewOrder: "Start a new order",

      activitySummary: "Your activity",
      activeOrders: "Active order",
      outForDelivery: "Out for delivery",
      completedOrders: "Completed orders",
      inFavorites: "In favorites",

      myLibrary: "My library",
      myLibraryDescription:
        "A simple difference between what you liked and what you started customizing.",
      favoritesDescription:
        "Designs and products you liked and saved to revisit later.",
      savedCustomizationsDescription:
        "Products you customized but have not ordered yet — continue any time.",

      addAddress: "Add address",
      editAddress: "Edit address",
      deleteAddress: "Delete",
      setAsDefault: "Set as default address",
      defaultAddress: "Default address",
      makeDefault: "Make default",
      addressLabel: "Address name",
      addressLabelHint: "Home, work…",
      addressDetails: "Address details",
      addressDetailsHint: "Neighborhood, street, nearest landmark",
      addressDialogDescription:
        "Enter accurate address details so the order arrives on time.",
      saveAddress: "Save address",
      addressSaved: "Address saved successfully.",
      addressDeleted: "Address deleted.",
      addressDefaultSet: "Default address updated.",
      addressDeleteConfirm: "Do you want to delete this address?",
      addressDeleteTitle: "Delete shipping address",
      addressDeleteDescription:
        "This address will be removed from your account. Existing orders will not be changed.",
      confirmDeleteAddress: "Delete address",
      addressDeleteDefaultBlocked:
        "You cannot delete the default address — set another one as default first.",

      notificationPreferences: "Notification preferences",
      preferenceOffers: "Offers and updates by email",
      preferenceOrderUpdates: "Order status updates",
      preferenceOn: "enabled",
      preferenceOff: "disabled",
      securityNote:
        "To change your password and security settings go to “Settings & security”.",
      passwordMovedNote:
        "Password changes now live in “Settings & security” to protect your account.",

      fullName: "Full name",
      email: "Email",
      phone: "Phone number",
      city: "City",
      cancel: "Cancel",
      saveChanges: "Save changes",
      saving: "Saving…",
      saveSuccess: "Changes saved successfully.",
      requiredField: "This field is required.",
      invalidEmail: "Enter a valid email address.",

      errorTitle: "Could not load data",
      errorHeroText:
        "Something went wrong while loading your account. Check your connection and try again.",
      errorOrderText:
        "We could not load your current order status. Please try again shortly.",
      errorAddressText: "We could not load your shipping addresses.",
      retry: "Try again",
      emptyOrderTitle: "No active order right now",
      emptyOrderText:
        "When you place a new order, its progress and shipping status appear here.",
      emptyAddressTitle: "No saved addresses",
      emptyAddressText:
        "Add your first shipping address so your order reaches the right place.",

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

  const ADDRESS_STORAGE_KEY = "palprints-customer-addresses";

  /* العنوان التجريبي يخزّن مفاتيح ترجمة بدل نص ثابت،
     أما العناوين التي يضيفها المستخدم فتخزّن نصه كما كتبه. */

  const defaultAddresses = [
    {
      id: "addr-1",
      titleKey: "demoAddressTitle",
      cityKey: "demoAddressCity",
      detailsKey: "demoAddressDetails",
      phone: "059 123 4567",
      isDefault: true
    }
  ];

  /* يعيد نص الحقل مترجماً إن كان تجريبياً، أو كما أدخله المستخدم */

  function addressText(address, field) {
    const key = address[field + "Key"];

    return key ? Core.translate(key) : address[field] || "";
  }

  function readAddresses() {
    try {
      const stored = window.localStorage.getItem(ADDRESS_STORAGE_KEY);

      if (!stored) {
        return defaultAddresses.slice();
      }

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : defaultAddresses.slice();
    } catch (error) {
      return defaultAddresses.slice();
    }
  }

  function writeAddresses(list) {
    try {
      window.localStorage.setItem(
        ADDRESS_STORAGE_KEY,
        JSON.stringify(list)
      );
    } catch (error) {
      /* تجاهل */
    }
  }

  let addresses = readAddresses();

  /* =======================================================
     محاكاة نداء الشبكة
     ======================================================= */

  function fakeRequest(payload, delay) {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve(payload);
      }, delay || 550);
    });
  }

  /* =======================================================
     العناصر
     ======================================================= */

  const heroSection = document.getElementById("profileHero");
  const orderSection = document.getElementById("currentOrderSection");
  const activitySection = document.getElementById("activitySection");
  const addressesSection = document.getElementById("addressesSection");
  const addressList = document.getElementById("addressList");

  /* =======================================================
     عرض عناوين الشحن
     ======================================================= */

  function buildAddressItem(address) {
    const item = document.createElement("li");

    item.className =
      "customer-address" + (address.isDefault ? " is-default" : "");

    item.setAttribute("data-address-id", address.id);

    /* الرأس */

    const top = document.createElement("div");
    top.className = "customer-address-top";

    const title = document.createElement("span");
    title.className = "customer-address-title";
    title.innerHTML =
      '<i class="bi bi-geo-alt-fill" aria-hidden="true"></i>';

    const titleText = document.createElement("span");
    titleText.textContent = addressText(address, "title");
    title.appendChild(titleText);

    top.appendChild(title);

    if (address.isDefault) {
      const badge = document.createElement("span");
      badge.className = "customer-address-default-badge";
      badge.innerHTML = '<i class="bi bi-star-fill" aria-hidden="true"></i>';

      const badgeText = document.createElement("span");
      badgeText.textContent = Core.translate("defaultAddress");
      badge.appendChild(badgeText);

      top.appendChild(badge);
    }

    item.appendChild(top);

    /* التفاصيل */

    const lines = document.createElement("div");
    lines.className = "customer-address-lines";

    const place = document.createElement("span");
    place.innerHTML = '<i class="bi bi-signpost" aria-hidden="true"></i>';

    const placeText = document.createElement("span");

    placeText.textContent =
      addressText(address, "city") +
      Core.translate("listSeparator") +
      addressText(address, "details");

    place.appendChild(placeText);

    const phone = document.createElement("span");
    phone.innerHTML = '<i class="bi bi-telephone" aria-hidden="true"></i>';

    const phoneText = document.createElement("span");
    phoneText.setAttribute("dir", "ltr");
    phoneText.textContent = address.phone;
    phone.appendChild(phoneText);

    lines.appendChild(place);
    lines.appendChild(phone);

    item.appendChild(lines);

    /* الإجراءات */

    const actions = document.createElement("div");
    actions.className = "customer-address-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "customer-address-action";
    editButton.setAttribute("data-action", "edit");
    editButton.innerHTML = '<i class="bi bi-pencil" aria-hidden="true"></i>';

    const editText = document.createElement("span");
    editText.textContent = Core.translate("editAddress");
    editButton.appendChild(editText);

    const defaultButton = document.createElement("button");
    defaultButton.type = "button";
    defaultButton.className = "customer-address-action";
    defaultButton.setAttribute("data-action", "default");
    defaultButton.disabled = Boolean(address.isDefault);
    defaultButton.innerHTML = '<i class="bi bi-star" aria-hidden="true"></i>';

    const defaultText = document.createElement("span");
    defaultText.textContent = Core.translate("makeDefault");
    defaultButton.appendChild(defaultText);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "customer-address-action is-danger";
    deleteButton.setAttribute("data-action", "delete");
    deleteButton.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i>';

    const deleteText = document.createElement("span");
    deleteText.textContent = Core.translate("deleteAddress");
    deleteButton.appendChild(deleteText);

    actions.appendChild(editButton);
    actions.appendChild(defaultButton);
    actions.appendChild(deleteButton);

    item.appendChild(actions);

    return item;
  }

  function renderAddresses() {
    if (!addressList) {
      return;
    }

    addressList.innerHTML = "";

    addresses.forEach(function (address) {
      addressList.appendChild(buildAddressItem(address));
    });

    Core.setState(
      addressesSection,
      addresses.length === 0 ? "empty" : "ready"
    );
  }

  /* =======================================================
     نافذة العنوان
     ======================================================= */

  const addressDialog = Core.setupDialog("addressDialog");
  const addressDeleteDialog = Core.setupDialog("addressDeleteDialog", {
    onOpen: function () {
      const cancelButton = document.getElementById("addressDeleteCancel");

      if (cancelButton) {
        window.setTimeout(function () {
          cancelButton.focus();
        }, 0);
      }
    }
  });

  const addressDeleteName = document.getElementById("addressDeleteName");
  const addressDeleteConfirmButton = document.getElementById(
    "addressDeleteConfirmButton"
  );
  let pendingAddressDeleteId = null;

  const addressForm = document.getElementById("addressForm");
  const addressIdInput = document.getElementById("addressId");
  const addressTitleInput = document.getElementById("addressTitle");
  const addressCityInput = document.getElementById("addressCity");
  const addressDetailsInput = document.getElementById("addressDetails");
  const addressPhoneInput = document.getElementById("addressPhone");
  const addressDefaultInput = document.getElementById("addressDefault");
  const addressDialogTitle = document.getElementById("addressDialogTitle");

  function openAddressDialog(address) {
    if (!addressDialog) {
      return;
    }

    const editing = Boolean(address);

    if (addressDialogTitle) {
      addressDialogTitle.textContent = Core.translate(
        editing ? "editAddress" : "addAddress"
      );
    }

    addressIdInput.value = editing ? address.id : "";
    addressTitleInput.value = editing ? addressText(address, "title") : "";
    addressCityInput.value = editing ? addressText(address, "city") : "";
    addressDetailsInput.value = editing ? addressText(address, "details") : "";
    addressPhoneInput.value = editing ? address.phone : "";
    addressDefaultInput.checked = editing ? Boolean(address.isDefault) : false;

    /* العنوان الأول يصبح افتراضياً تلقائياً */
    if (!editing && addresses.length === 0) {
      addressDefaultInput.checked = true;
      addressDefaultInput.disabled = true;
    } else {
      addressDefaultInput.disabled = Boolean(editing && address.isDefault);
    }

    clearFieldErrors(addressForm);

    addressDialog.open();
  }

  function clearFieldErrors(form) {
    if (!form) {
      return;
    }

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

  function markFieldError(input) {
    const field = input.closest(".profile-field");

    if (field) {
      field.classList.add("has-error");
    }

    input.setAttribute("aria-invalid", "true");
  }

  function validateRequired(form, inputs) {
    clearFieldErrors(form);

    let valid = true;

    inputs.forEach(function (input) {
      if (!input || input.disabled) {
        return;
      }

      const value = String(input.value || "").trim();

      if (!value) {
        markFieldError(input);
        valid = false;
        return;
      }

      if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        markFieldError(input);
        valid = false;
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

  if (addressForm) {
    addressForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const valid = validateRequired(addressForm, [
        addressTitleInput,
        addressCityInput,
        addressDetailsInput,
        addressPhoneInput
      ]);

      if (!valid) {
        return;
      }

      const id = addressIdInput.value;

      const payload = {
        id: id || "addr-" + Date.now(),
        title: addressTitleInput.value.trim(),
        city: addressCityInput.value.trim(),
        details: addressDetailsInput.value.trim(),
        phone: addressPhoneInput.value.trim(),
        isDefault: addressDefaultInput.checked || addresses.length === 0
      };

      if (id) {
        addresses = addresses.map(function (address) {
          return address.id === id ? payload : address;
        });
      } else {
        addresses = addresses.concat([payload]);
      }

      /* عنوان افتراضي واحد فقط */
      if (payload.isDefault) {
        addresses = addresses.map(function (address) {
          return Object.assign({}, address, {
            isDefault: address.id === payload.id
          });
        });
      }

      writeAddresses(addresses);
      renderAddresses();

      addressDialog.close();

      Core.toast(Core.translate("addressSaved"), "success");
    });
  }

  const addAddressButton = document.getElementById("addAddressButton");

  if (addAddressButton) {
    addAddressButton.addEventListener("click", function () {
      openAddressDialog(null);
    });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-add-address]"),
    function (button) {
      button.addEventListener("click", function () {
        openAddressDialog(null);
      });
    }
  );

  /* إجراءات العناوين */

  if (addressList) {
    addressList.addEventListener("click", function (event) {
      const button = event.target.closest("[data-action]");

      if (!button) {
        return;
      }

      const item = button.closest("[data-address-id]");

      if (!item) {
        return;
      }

      const id = item.getAttribute("data-address-id");

      const address = addresses.filter(function (entry) {
        return entry.id === id;
      })[0];

      if (!address) {
        return;
      }

      const action = button.getAttribute("data-action");

      if (action === "edit") {
        openAddressDialog(address);
        return;
      }

      if (action === "default") {
        addresses = addresses.map(function (entry) {
          return Object.assign({}, entry, { isDefault: entry.id === id });
        });

        writeAddresses(addresses);
        renderAddresses();

        Core.toast(Core.translate("addressDefaultSet"), "success");
        return;
      }

      if (action === "delete") {
        if (address.isDefault && addresses.length > 1) {
          Core.toast(
            Core.translate("addressDeleteDefaultBlocked"),
            "error"
          );
          return;
        }

        pendingAddressDeleteId = id;

        if (addressDeleteName) {
          addressDeleteName.textContent = addressText(address, "title");
        }

        if (addressDeleteDialog) {
          addressDeleteDialog.open();
        }
      }
    });
  }

  if (addressDeleteConfirmButton) {
    addressDeleteConfirmButton.addEventListener("click", function () {
      if (!pendingAddressDeleteId) {
        return;
      }

      addresses = addresses.filter(function (entry) {
        return entry.id !== pendingAddressDeleteId;
      });

      pendingAddressDeleteId = null;
      writeAddresses(addresses);
      renderAddresses();

      if (addressDeleteDialog) {
        addressDeleteDialog.close();
      }

      Core.toast(Core.translate("addressDeleted"), "success");
    });
  }

  /* =======================================================
     نافذة تعديل الملف الشخصي
     ======================================================= */

  /* حقول العرض في بطاقة الهيرو */

  const customerNameElement = document.getElementById("customerName");
  const customerEmailElement = document.getElementById("customerEmail");
  const customerPhoneElement = document.getElementById("customerPhone");
  const customerLocationElement = document.getElementById("customerLocation");

  /* تُملأ النافذة من القيم المعروضة حالياً حتى تتبع اللغة النشطة */

  const customerEditDialog = Core.setupDialog("customerEditDialog", {
    onOpen: function () {
      const map = [
        ["editFullName", customerNameElement],
        ["editEmail", customerEmailElement],
        ["editPhone", customerPhoneElement],
        ["editCity", customerLocationElement]
      ];

      map.forEach(function (pair) {
        const input = document.getElementById(pair[0]);

        if (input && pair[1]) {
          input.value = pair[1].textContent.trim();
        }
      });

      clearFieldErrors(document.getElementById("customerEditForm"));
    }
  });

  const customerEditForm = document.getElementById("customerEditForm");
  const customerEditSave = document.getElementById("customerEditSave");

  /* بعد أن يكتب المستخدم بياناته الحقيقية لا يجوز
     أن يستبدلها مبدّل اللغة بالنص التجريبي المترجم */

  function keepUserValue(element, value) {
    if (!element) {
      return;
    }

    element.removeAttribute("data-i18n");
    element.textContent = value;
  }

  if (customerEditForm) {
    customerEditForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = document.getElementById("editFullName");
      const email = document.getElementById("editEmail");
      const phone = document.getElementById("editPhone");
      const city = document.getElementById("editCity");

      if (!validateRequired(customerEditForm, [fullName, email, phone, city])) {
        return;
      }

      /* حالة الحفظ */
      const label = customerEditSave.querySelector("span");
      const originalText = label ? label.textContent : "";

      if (label) {
        label.textContent = Core.translate("saving");
      }

      customerEditSave.disabled = true;

      fakeRequest(true, 700).then(function () {
        keepUserValue(customerNameElement, fullName.value.trim());
        keepUserValue(customerEmailElement, email.value.trim());
        keepUserValue(customerPhoneElement, phone.value.trim());
        keepUserValue(customerLocationElement, city.value.trim());

        if (label) {
          label.textContent = originalText;
        }

        customerEditSave.disabled = false;

        customerEditDialog.close();

        Core.toast(Core.translate("saveSuccess"), "success");
      });
    });
  }

  /* =======================================================
     شريط تتبع الطلب
     =======================================================
     المراحل تُبنى من البيانات لا من HTML، فتكفي قيمة
     currentOrder.step لتحديث الخط والنقاط والشارة معاً.

     للربط بالـ API لاحقاً:
     PalOrderTracker.setStep("shipped")
     ======================================================= */

  const ORDER_STEPS = [
    {
      key: "confirmed",
      labelKey: "stepConfirmed",
      icon: "bi-check2-circle",
      badge: "is-pending"
    },
    {
      key: "printing",
      labelKey: "stepPrinting",
      icon: "bi-printer",
      badge: "is-pending"
    },
    {
      key: "shipped",
      labelKey: "stepShipped",
      icon: "bi-box-seam",
      badge: "is-pending"
    },
    {
      key: "delivery",
      labelKey: "stepOutForDelivery",
      icon: "bi-truck",
      badge: "is-approved"
    }
  ];

  /* المسافة الزمنية بين امتلاء مرحلة والتي تليها */
  const TRACKER_STEP_DELAY = 220;

  const trackerElement = document.getElementById("orderTracker");
  const orderStatusBadge = document.getElementById("currentOrderStatus");
  const orderNumberElement = document.getElementById("currentOrderNumber");

  /* الحالة الحالية — تُستبدل بما يعيده الخادم */
  const currentOrder = { number: "#PP-2048", step: "delivery" };

  let trackerTimers = [];

  function clearTrackerTimers() {
    trackerTimers.forEach(window.clearTimeout);
    trackerTimers = [];
  }

  function currentStepIndex() {
    for (let i = 0; i < ORDER_STEPS.length; i += 1) {
      if (ORDER_STEPS[i].key === currentOrder.step) {
        return i;
      }
    }

    return 0;
  }

  /* بناء مرحلة واحدة */

  function buildTrackerStep(step, state) {
    const item = document.createElement("li");

    item.className = "customer-tracker-step";
    item.setAttribute("data-step", step.key);

    if (state === "current") {
      item.setAttribute("aria-current", "step");
    }

    const dot = document.createElement("span");
    dot.className = "customer-tracker-dot";
    dot.setAttribute("aria-hidden", "true");

    const icon = document.createElement("i");

    /* المراحل المنتهية تحمل علامة صح،
       والمرحلة الحالية تحمل أيقونتها المعبّرة */
    icon.className =
      "bi " + (state === "done" ? "bi-check-lg" : step.icon);

    dot.appendChild(icon);

    const label = document.createElement("span");
    label.className = "customer-tracker-label";
    label.setAttribute("data-i18n", step.labelKey);
    label.textContent = Core.translate(step.labelKey);

    item.appendChild(dot);
    item.appendChild(label);

    return item;
  }

  /* شارة الحالة في رأس البطاقة */

  function renderOrderBadge(step) {
    if (!orderStatusBadge) {
      return;
    }

    orderStatusBadge.className = "profile-badge " + step.badge;

    const icon = orderStatusBadge.querySelector("i");

    if (icon) {
      icon.className = "bi " + step.icon;
    }

    const text = orderStatusBadge.querySelector("span");

    if (text) {
      /* تحديث المفتاح أيضاً كي يتبع النص تبديل اللغة */
      text.setAttribute("data-i18n", step.labelKey);
      text.textContent = Core.translate(step.labelKey);
    }
  }

  function renderOrderTracker(options) {
    if (!trackerElement) {
      return;
    }

    const settings = options || {};
    const index = currentStepIndex();

    clearTrackerTimers();

    trackerElement.innerHTML = "";

    const steps = [];

    ORDER_STEPS.forEach(function (step, i) {
      const state =
        i < index ? "done" : i === index ? "current" : "upcoming";

      const item = buildTrackerStep(step, state);

      trackerElement.appendChild(item);
      steps.push({ item: item, state: state });
    });

    renderOrderBadge(ORDER_STEPS[index]);

    /* المرحلة الحالية تُعلَّم فوراً، والخطوط المكتملة
       تمتلئ واحداً تلو الآخر */

    const animate =
      settings.animate === true && !Core.reducedMotion.matches;

    steps.forEach(function (entry, i) {
      if (entry.state === "current") {
        entry.item.classList.add("is-current");
        return;
      }

      if (entry.state !== "done") {
        return;
      }

      if (!animate) {
        entry.item.classList.add("is-done");
        return;
      }

      trackerTimers.push(
        window.setTimeout(function () {
          entry.item.classList.add("is-done");
        }, i * TRACKER_STEP_DELAY + 120)
      );
    });

    if (orderNumberElement) {
      orderNumberElement.textContent = currentOrder.number;
    }
  }

  /* واجهة صغيرة لتغيير المرحلة من الخارج */

  window.PalOrderTracker = {
    steps: ORDER_STEPS.map(function (step) {
      return step.key;
    }),

    getStep: function () {
      return currentOrder.step;
    },

    setStep: function (key) {
      const exists = ORDER_STEPS.some(function (step) {
        return step.key === key;
      });

      if (!exists) {
        console.warn("مرحلة غير معروفة:", key);
        return false;
      }

      currentOrder.step = key;

      renderOrderTracker({ animate: true });

      return true;
    }
  };

  /* =======================================================
     تحميل الأقسام
     ======================================================= */

  function loadHero() {
    Core.loadSection(heroSection, function () {
      return fakeRequest({ name: "أحمد محمد" }, 450);
    });
  }

  function loadCurrentOrder() {
    Core.loadSection(
      orderSection,
      function () {
        return fakeRequest(currentOrder, 650);
      },
      {
        isEmpty: function (result) {
          return !result;
        },

        /* الشريط يُبنى بعد وصول البيانات ويمتلئ متدرجاً */
        render: function (result) {
          if (result) {
            renderOrderTracker({ animate: true });
          }
        }
      }
    );
  }

  function loadActivity() {
    Core.loadSection(activitySection, function () {
      return fakeRequest({ active: 1 }, 550);
    });
  }

  function loadAddresses() {
    Core.setState(addressesSection, "loading");

    fakeRequest(addresses, 700).then(function () {
      renderAddresses();
    });
  }

  Core.onRetry(heroSection, loadHero);
  Core.onRetry(orderSection, loadCurrentOrder);
  Core.onRetry(activitySection, loadActivity);
  Core.onRetry(addressesSection, loadAddresses);

  loadHero();
  loadCurrentOrder();
  loadActivity();
  loadAddresses();

  /* =======================================================
     إعادة رسم العناصر الديناميكية عند تغيير اللغة
     ======================================================= */

  /* نص رسالة التأكيد الخاص بمفاتيح التفضيلات */

  const PREFERENCE_LABELS = {
    "customer-offers": "preferenceOffers",
    "customer-order-updates": "preferenceOrderUpdates"
  };

  function syncPreferenceLabels() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-preference-label]"),
      function (input) {
        const key = PREFERENCE_LABELS[input.getAttribute("data-preference")];

        if (key) {
          input.setAttribute("data-preference-label", Core.translate(key));
        }
      }
    );
  }

  /* مرة عند الفتح كي تتبع اللغة المحفوظة، ثم مع كل تبديل */

  syncPreferenceLabels();

  Core.onLanguageChange(function () {
    if (addresses.length > 0) {
      renderAddresses();
    }

    syncPreferenceLabels();

    /* الشريط مبنيٌّ بالجافاسكربت، فيُعاد رسمه بلا حركة
       كي لا يمتلئ من جديد عند مجرد تبديل اللغة */

    if (trackerElement && trackerElement.children.length) {
      renderOrderTracker({ animate: false });
    }
  });
});

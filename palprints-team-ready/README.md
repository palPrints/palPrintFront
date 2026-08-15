# PalPrints — صفحات الملف الشخصي للأدوار الثلاثة

هذه النسخة تحتوي على صفحات الملف الشخصي الثلاث (العميل، المصمم، المطبعة)
مع الأساس المشترك بينها، إضافةً إلى ملفات الـ Design System العامة.

---

## الصفحات

| الصفحة | الملف | CSS | JS |
| --- | --- | --- | --- |
| العميل | `custProfile.html` | `assets/css/pages/custProfile.css` | `assets/js/pages/custProfile.js` |
| المصمم | `designerProfile.html` | `assets/css/pages/designerProfile.css` | `assets/js/pages/designerProfile.js` |
| المطبعة | `printingProfile.html` | `assets/css/pages/printingProfile.css` | `assets/js/pages/printingProfile.js` |

---

## الأساس المشترك لصفحات الملف الشخصي

- `assets/css/pages/profile-core.css`
- `assets/js/pages/profile-core.js`

كل صفحة تستدعي `profile-core` أولاً ثم ملفها الخاص:

```html
<link rel="stylesheet" href="assets/css/pages/profile-core.css">
<link rel="stylesheet" href="assets/css/pages/custProfile.css">
...
<script src="assets/js/pages/profile-core.js"></script>
<script src="assets/js/pages/custProfile.js"></script>
```

### ما يوفّره `profile-core.css`

المتغيرات والألوان، الوضع الليلي، الخلفية الباستيلية، القائمة الجانبية،
الشريط العلوي، البطاقات، الأزرار، الشارات، شبكة الإحصائيات، صفوف
المعلومات، المحفظة، مفاتيح التفضيلات، حالات Loading / Empty / Error،
رسائل النجاح، النوافذ المنبثقة، وقواعد التجاوب.

### ما يوفّره `profile-core.js` عبر الكائن `PalProfile`

| الدالة | الوظيفة |
| --- | --- |
| `init({ dictionary })` | تهيئة الصفحة وتسجيل قاموس الترجمة |
| `setState(el, state)` | تبديل حالة القسم: `loading` / `ready` / `empty` / `error` |
| `loadSection(el, loader, opts)` | تحميل قسم مع إدارة حالاته تلقائياً |
| `onRetry(el, handler)` | ربط زر «إعادة المحاولة» داخل حالة الخطأ |
| `toast(message, type)` | رسالة نجاح أو خطأ أو معلومة |
| `applyLanguage(lang)` / `translate(key)` | الترجمة ودعم RTL / LTR |
| `applyTheme(theme)` | الوضع الليلي والنهاري |
| `setupDialog(id, opts)` | إدارة النوافذ المنبثقة |
| `maskAccountNumber` / `maskIban` | إخفاء البيانات البنكية للعرض |
| `sidebar` | التحكم بالقائمة الجانبية |

---

## الترجمة

كل نص مرئي يحمل أحد هذه الخصائص:

- `data-i18n` للنص
- `data-i18n-aria` لتسمية الوصول
- `data-i18n-alt` للنص البديل للصور
- `data-i18n-title` للتلميح
- `data-i18n-placeholder` للنص الإرشادي

المفاتيح معرّفة داخل قاموس كل صفحة (`ar` و `en`)، وتبديل اللغة يغيّر
`lang` و `dir` ويعيد الترجمة ويقلب اتجاه سهم الرجوع تلقائياً.

---

## الحالات الأساسية

كل قسم قابل للتحميل يحمل `data-state`، وبداخله:

```html
<section data-state="loading">
  <div data-state-loading>…هيكل عظمي…</div>
  <div data-state-empty>…حالة فارغة…</div>
  <div data-state-error>…خطأ + زر إعادة المحاولة…</div>
  <div data-state-content>…المحتوى…</div>
</section>
```

---

## ملاحظات أمنية مُلزِمة

### كلمة المرور

أُزيلت نهائياً من الصفحات الثلاث ومن نوافذ التعديل.
تغييرها يتم حصراً في صفحة **الإعدادات والأمان**.

### البيانات البنكية للمطبعة

يجب أن تُرجع الـ API القيم **مخفية افتراضياً**:

```json
{
  "bankName": "بنك فلسطين",
  "accountNumberMasked": "•••• 1121",
  "ibanMasked": "PS92 •••• •••• 1000"
}
```

- لا يُرجَع الرقم الكامل إلا ضمن إجراء آمن ومصرح به (تحقق إضافي +
  صلاحية + تسجيل في سجل التدقيق).
- نافذة التعديل **لا تُعبَّأ** بالقيم الحساسة، وتُفرَّغ الحقول فور الإرسال.
- دالتا `maskAccountNumber` و `maskIban` للعرض فقط وليستا بديلاً عن
  الإخفاء في الخادم.

---

## البيانات التجريبية

كل صفحة تحتوي كائن بيانات في أعلى ملف الـ JS يُستبدل لاحقاً بنداء API:

- العميل: العناوين مخزّنة في `localStorage` تحت `palprints-customer-addresses`.
- المصمم: `designer.approvalStatus` يقبل `approved` / `pending` / `rejected` / `incomplete`.
- المطبعة: `printer.approvalStatus` يقبل `approved` / `pending` / `incomplete` / `rejected`،
  و `printer.whatsappStatus` يقبل `verified` / `pending` / `unverified`.

تغيير أي من هذه القيم يعرض الشارة والتنبيه المناسبين مباشرة.

---

## الملفات المشتركة العامة

تُستخدم من `design-system.html` ومن بقية صفحات المشروع:

- `assets/css/variables.css`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/components.css`
- `assets/css/dark.css`
- `assets/css/responsive.css`
- `assets/js/theme.js`
- `assets/js/language.js`
- `assets/js/main.js`
- `assets/js/components.js`

لا تعدّلوا هذه الملفات دون مراجعة. صفحات الملف الشخصي لا تعتمد عليها،
وأي تعديل خاص بصفحة يبقى داخل ملفاتها أو داخل `profile-core`.

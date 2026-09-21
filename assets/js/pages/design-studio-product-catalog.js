(function publishStudioProductCatalog(window) {
  "use strict";

  const sizes = (...ids) => ids.map(id => ({ id, name: id === "standard" ? "قياسي" : id }));
  const area = (id, name, role, icon, mockup, printZone) => ({ id, name, role, icon, image: mockup, mockup, printZone });
  const product = config => {
    const printAreas = config.printAreas.map(item => ({ ...item, printZone: { ...item.printZone } }));
    return {
      ...config,
      printAreas,
      editor: {
        defaultAreaId: config.defaultAreaId,
        printAreas: printAreas.map(item => ({ ...item, printZone: { ...item.printZone } }))
      }
    };
  };

  const tshirtFront = "assets/images/printing-areas/tshirt/tshirt-front-removebg-preview.png";
  const tshirtBack = "assets/images/printing-areas/tshirt/tshirt-back-removebg-preview.png";
  const rightSleeve = "assets/images/printing-areas/tshirt/tshirt-rightSleeve-removebg-preview.png";
  const leftSleeve = "assets/images/printing-areas/tshirt/tshirt-leftSleeve-removebg-preview.png";
  const bodyZone = { leftPct: 31, topPct: 28, widthPct: 38, heightPct: 42, widthCm: 28, heightCm: 36 };
  const sleeveZone = { leftPct: 35, topPct: 34, widthPct: 30, heightPct: 28, widthCm: 10, heightCm: 12 };

  const products = [
    product({
      id: "product-001", categoryId: "tshirts", name: "تي شيرت كلاسيكي", studioTitle: "تيشيرت Unisex قطن كلاسيكي",
      description: "تي شيرت كلاسيكي عالي الجودة 100% قطن", price: 29, defaultAreaId: "front", defaultColor: "white",
      colors: [
        { id: "white", name: "أبيض", value: "#ffffff", image: "assets/images/tshirt.webp" },
        { id: "black", name: "أسود", value: "#000000", image: "assets/images/tshirt.webp" },
        { id: "navy", name: "كحلي", value: "#173B87", image: "assets/images/tshirt.webp" },
        { id: "red", name: "أحمر", value: "#D52A3C", image: "assets/images/tshirt.webp" },
        { id: "green", name: "أخضر", value: "#2E9B42", image: "assets/images/tshirt.webp" }
      ],
      sizes: sizes("S", "M", "L", "XL", "XXL"),
      printAreas: [
        area("front", "الأمام", "front", "bi bi-person-standing", tshirtFront, bodyZone),
        area("back", "الخلف", "back", "bi bi-person-standing", tshirtBack, bodyZone),
        area("right-sleeve", "الكم الأيمن", "right-sleeve", "bi bi-arrow-right", rightSleeve, sleeveZone),
        area("left-sleeve", "الكم الأيسر", "left-sleeve", "bi bi-arrow-left", leftSleeve, sleeveZone)
      ],
      thumbnail: "assets/images/tshirt.webp"
    }),
    product({
      id: "product-002", categoryId: "hoodies", name: "هودي بسيط", studioTitle: "هودي Unisex قطني",
      description: "هودي مريح للاستخدام اليومي", price: 79, defaultAreaId: "front", defaultColor: "white",
      colors: [
        { id: "white", name: "أبيض", value: "#ffffff", image: "assets/images/hoodie.png" },
        { id: "black", name: "أسود", value: "#000000", image: "assets/images/hoodie-black.png" }
      ],
      sizes: sizes("S", "M", "L", "XL"),
      printAreas: [
        area("front", "الأمام", "front", "bi bi-person-standing", "assets/images/printing-areas/hoodie/hoodie-front.png", { leftPct: 32, topPct: 29, widthPct: 36, heightPct: 40, widthCm: 28, heightCm: 36 }),
        area("back", "الخلف", "back", "bi bi-person-standing", "assets/images/printing-areas/hoodie/hoodie-back.png", { leftPct: 32, topPct: 29, widthPct: 36, heightPct: 40, widthCm: 28, heightCm: 36 })
      ],
      thumbnail: "assets/images/hoodie.png"
    }),
    product({
      id: "product-003", categoryId: "mugs", name: "كوب سيراميك", studioTitle: "كوب سيراميك",
      description: "كوب سيراميك عالي الجودة", price: 19, defaultAreaId: "front", defaultColor: "white",
      colors: [{ id: "white", name: "أبيض", value: "#ffffff", image: "assets/images/cup.webp" }], sizes: sizes("standard"),
      printAreas: [area("front", "الواجهة", "primary", "bi bi-cup-hot", "assets/images/cup.webp", { leftPct: 20, topPct: 32, widthPct: 60, heightPct: 36, widthCm: 20, heightCm: 9 })],
      thumbnail: "assets/images/cup.webp"
    }),
    product({
      id: "product-004", categoryId: "bags", name: "حقيبة قماشية", studioTitle: "حقيبة قماشية قطنية",
      description: "حقيبة قماشية عملية ومتينة", price: 39, defaultAreaId: "front", defaultColor: "white",
      colors: [{ id: "white", name: "أبيض", value: "#ffffff", image: "assets/images/bag.png" }], sizes: sizes("standard"),
      printAreas: [
        area("front", "الأمام", "front", "bi bi-bag", "assets/images/bag.png", { leftPct: 24, topPct: 22, widthPct: 52, heightPct: 56, widthCm: 28, heightCm: 30 }),
        area("back", "الخلف", "back", "bi bi-bag", "assets/images/bag.png", { leftPct: 24, topPct: 22, widthPct: 52, heightPct: 56, widthCm: 28, heightCm: 30 })
      ],
      thumbnail: "assets/images/bag.png"
    }),
    product({
      id: "product-005", categoryId: "tshirts", name: "تي شيرت ثقيل باهت", studioTitle: "تيشيرت Oversize قطن فاخر",
      description: "تي شيرت ثقيل بقصة مريحة وألوان باهتة عصرية", price: 49, defaultAreaId: "front", defaultColor: "faded-black",
      colors: [
        { id: "faded-black", name: "أسود باهت", value: "#4A4A48", image: "assets/images/products1/tshirt-2/tshirt-dyed-heavyweight-faded-black-removebg-preview.png" },
        { id: "faded-brown", name: "بني باهت", value: "#9B816A", image: "assets/images/products1/tshirt-2/tshirt-dyed-heavyweight-faded-brown-removebg-preview.png" },
        { id: "faded-cream", name: "كريمي باهت", value: "#F1EBDD", image: "assets/images/products1/tshirt-2/tshirt-dyed-heavyweight-faded-cream-removebg-preview.png" },
        { id: "faded-navy", name: "كحلي باهت", value: "#345775", image: "assets/images/products1/tshirt-2/tshirt-dyed-heavyweight-faded-navy-removebg-preview.png" }
      ],
      sizes: sizes("S", "M", "L", "XL", "XXL"),
      printAreas: [
        area("front", "الأمام", "front", "bi bi-person-standing", tshirtFront, { leftPct: 32, topPct: 31, widthPct: 36, heightPct: 36, widthCm: 28, heightCm: 36 }),
        area("back", "الخلف", "back", "bi bi-person-standing", tshirtBack, { leftPct: 32, topPct: 31, widthPct: 36, heightPct: 36, widthCm: 28, heightCm: 36 }),
        area("right-sleeve", "الكم الأيمن", "right-sleeve", "bi bi-arrow-right", rightSleeve, sleeveZone),
        area("left-sleeve", "الكم الأيسر", "left-sleeve", "bi bi-arrow-left", leftSleeve, sleeveZone)
      ],
      thumbnail: "assets/images/products1/tshirt-2/tshirt-dyed-heavyweight-faded-black-removebg-preview.png"
    }),
    product({
      id: "product-006", categoryId: "caps", name: "قبعة كلاسيكية", studioTitle: "قبعة Unisex كلاسيكية",
      description: "قبعة كلاسيكية قابلة للتعديل ومناسبة للطباعة الأمامية", price: 25, defaultAreaId: "front", defaultColor: "black",
      colors: [
        { id: "black", name: "أسود", value: "#171717", image: "assets/images/products1/cap/cap-black-removebg-preview.png" },
        { id: "navy", name: "كحلي", value: "#1D1E2B", image: "assets/images/products1/cap/cap-navy-removebg-preview.png" },
        { id: "storm", name: "رمادي فاتح", value: "#D3D3D3", image: "assets/images/products1/cap/cap-storm-removebg-preview.png" },
        { id: "walnut", name: "جوزي", value: "#786551", image: "assets/images/products1/cap/cap-wallnut-removebg-preview.png" }
      ],
      sizes: [{ id: "قياسي", name: "قياسي" }],
      printAreas: [area("front", "الواجهة", "primary", "bi bi-bullseye", "assets/images/products1/cap/cap-black-removebg-preview.png", { leftPct: 31, topPct: 29, widthPct: 38, heightPct: 20, widthCm: 18, heightCm: 8 })],
      thumbnail: "assets/images/products1/cap/cap-black-removebg-preview.png"
    })
  ];

  window.PALPRINTS_PRODUCT_CATALOG = Object.freeze({ products: Object.freeze(products) });
})(window);

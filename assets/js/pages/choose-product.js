/* =============================================================
   PALPRINTS
   CHOOSE PRODUCT PAGE
   Vanilla JavaScript
============================================================= */


/* =============================================================
   DOM ELEMENTS
============================================================= */

const elements = {

    categories:
        document.getElementById("categoriesContainer"),

    productsGrid:
        document.getElementById("productsGrid"),

    selectedProductTitle:
        document.getElementById("selected-product-title"),

    selectedProductDescription:
        document.getElementById("selected-product-description"),

    previewImage:
        document.getElementById("previewImage"),

    previewPlaceholder:
        document.getElementById("previewPlaceholder"),

    productOptions:
        document.getElementById("productOptions"),

    colors:
        document.getElementById("colorsContainer"),

    sizes:
        document.getElementById("sizesContainer"),

    printAreas:
        document.getElementById("printAreasContainer"),

    startDesignButton:
        document.getElementById("startDesignButton"),

    selectionMessage:
        document.getElementById("selectionMessage"),

    liveRegion:
        document.getElementById("liveRegion"),

    backButton:
        document.getElementById("backButton")

};


/* =============================================================
   APPLICATION STATE
============================================================= */

const state = {

    categories: [],

    products: [],

    activeCategory: "all",

    selectedProduct: null,

    selectedColor: null,

    selectedSize: null,

    selectedPrintAreas: []

};


/* =============================================================
   DEMO DATA
=============================================================

   IMPORTANT:

   This is only a frontend development dataset.

   In production, this data comes from the Backend.

============================================================= */

const backendResponse = {

    categories: [

        {
            id: "all",
            name: "الكل"
        },

        {
            id: "tshirts",
            name: "تي شيرت"
        },

        {
            id: "hoodies",
            name: "هودي"
        },

        {
            id: "mugs",
            name: "أكواب"
        },

        {
            id: "caps",
            name: "قبعات"
        },

        {
            id: "bags",
            name: "حقائب"
        }

    ],


    products: [

        {
            id: "product-001",

            categoryId: "tshirts",

            name: "تي شيرت كلاسيكي",

            studioTitle: "تيشيرت Unisex قطن كلاسيكي",

            description:
                "تي شيرت كلاسيكي عالي الجودة 100% قطن",

            price: 29,

            editor: {
                defaultAreaId: "front"
            },

            defaultColor: "white",

            colors: [

                {
                    id: "white",
                    name: "أبيض",
                    value: "#ffffff",

                    image:
                        "assets/images/tshirt.webp"
                },

                {
                    id: "black",
                    name: "أسود",
                    value: "#000000",

                    image:
                        "assets/images/tshirt.webp"
                },

                {
                    id: "navy",
                    name: "كحلي",
                    value: "#173B87",

                    image:
                        "assets/images/tshirt.webp"
                },

                {
                    id: "red",
                    name: "أحمر",
                    value: "#D52A3C",

                    image:
                        "assets/images/tshirt.webp"
                },

                {
                    id: "green",
                    name: "أخضر",
                    value: "#2E9B42",

                    image:
                        "assets/images/tshirt.webp"
                }

            ],

            sizes: [

                {
                    id: "S",
                    name: "S"
                },

                {
                    id: "M",
                    name: "M"
                },

                {
                    id: "L",
                    name: "L"
                },

                {
                    id: "XL",
                    name: "XL"
                },

                {
                    id: "XXL",
                    name: "XXL"
                }

            ],

            printAreas: [

                {
                    id: "front",
                    name: "الأمام",
                    role: "front",
                    icon: "bi bi-person-standing",
                    image: "assets/images/printing-areas/tshirt/tshirt-front-removebg-preview.png",
                    mockup: "assets/images/printing-areas/tshirt/tshirt-front-removebg-preview.png",
                    printZone: { leftPct: 31, topPct: 28, widthPct: 38, heightPct: 42, widthCm: 28, heightCm: 36 }
                },

                {
                    id: "back",
                    name: "الخلف",
                    role: "back",
                    icon: "bi bi-person-standing",
                    image: "assets/images/printing-areas/tshirt/tshirt-back-removebg-preview.png",
                    mockup: "assets/images/printing-areas/tshirt/tshirt-back-removebg-preview.png",
                    printZone: { leftPct: 31, topPct: 28, widthPct: 38, heightPct: 42, widthCm: 28, heightCm: 36 }
                },

                {
                    id: "right-sleeve",
                    name: "الكم الأيمن",
                    role: "right-sleeve",
                    icon: "bi bi-arrow-right",
                    image: "assets/images/design-studio/garments/standard-tshirt/white-right-sleeve.png",
                    mockup: "assets/images/design-studio/garments/standard-tshirt/white-right-sleeve.png",
                    printZone: { leftPct: 42.5, topPct: 27.8, widthPct: 13.5, heightPct: 12.15, widthCm: 10, heightCm: 12 }
                },

                {
                    id: "left-sleeve",
                    name: "الكم الأيسر",
                    role: "left-sleeve",
                    icon: "bi bi-arrow-left",
                    image: "assets/images/design-studio/garments/standard-tshirt/white-left-sleeve.png",
                    mockup: "assets/images/design-studio/garments/standard-tshirt/white-left-sleeve.png",
                    printZone: { leftPct: 46.1, topPct: 29.2, widthPct: 12.4, heightPct: 11.16, widthCm: 10, heightCm: 12 }
                }

            ],

            thumbnail:
                "assets/images/tshirt.webp"
        },


        {
            id: "product-002",

            categoryId: "hoodies",

            name: "هودي بسيط",

            studioTitle: "هودي Unisex قطني",

            description:
                "هودي مريح للاستخدام اليومي",

            price: 79,

            editor: {
                defaultAreaId: "front"
            },

            defaultColor: "white",

            colors: [

                {
                    id: "white",
                    name: "أبيض",
                    value: "#ffffff",
                    image:
                        "assets/images/hoodie.png"
                },

                {
                    id: "black",
                    name: "أسود",
                    value: "#000000",
                    image:
                        "assets/images/hoodie-black.png"
                }

            ],

            sizes: [

                {
                    id: "S",
                    name: "S"
                },

                {
                    id: "M",
                    name: "M"
                },

                {
                    id: "L",
                    name: "L"
                },

                {
                    id: "XL",
                    name: "XL"
                }

            ],

            printAreas: [

                {
                    id: "front",
                    name: "الأمام",
                    role: "front",
                    icon: "bi bi-person-standing",
                    image: "assets/images/printing-areas/hoodie/hoodie-front.png",
                    mockup: "assets/images/printing-areas/hoodie/hoodie-front.png",
                    printZone: { leftPct: 32, topPct: 29, widthPct: 36, heightPct: 40, widthCm: 28, heightCm: 36 }
                },

                {
                    id: "back",
                    name: "الخلف",
                    role: "back",
                    icon: "bi bi-person-standing",
                    image: "assets/images/printing-areas/hoodie/hoodie-back.png",
                    mockup: "assets/images/printing-areas/hoodie/hoodie-back.png",
                    printZone: { leftPct: 32, topPct: 29, widthPct: 36, heightPct: 40, widthCm: 28, heightCm: 36 }
                }

            ],

            thumbnail:
                "assets/images/hoodie.png"
        },


        {
            id: "product-003",

            categoryId: "mugs",

            name: "كوب سيراميك",

            studioTitle: "كوب سيراميك",

            description:
                "كوب سيراميك عالي الجودة",

            price: 19,

            editor: {
                defaultAreaId: "front"
            },

            defaultColor: "white",

            colors: [

                {
                    id: "white",
                    name: "أبيض",
                    value: "#ffffff",
                    image:
                        "assets/images/cup.webp"
                }

            ],

            sizes: [

                {
                    id: "standard",
                    name: "قياسي"
                }

            ],

            printAreas: [

                {
                    id: "front",
                    name: "الواجهة",
                    role: "primary",
                    icon: "bi bi-cup-hot",
                    mockup: "assets/images/cup.webp",
                    printZone: { leftPct: 20, topPct: 32, widthPct: 60, heightPct: 36, widthCm: 20, heightCm: 9 }
                }

            ],

            thumbnail:
                "assets/images/cup.webp"
        },


        {
            id: "product-004",

            categoryId: "bags",

            name: "حقيبة قماشية",

            studioTitle: "حقيبة قماشية قطنية",

            description:
                "حقيبة قماشية عملية ومتينة",

            price: 39,

            editor: {
                defaultAreaId: "front"
            },

            defaultColor: "white",

            colors: [

                {
                    id: "white",
                    name: "أبيض",
                    value: "#ffffff",
                    image:
                        "assets/images/bag.png"
                }

            ],

            sizes: [

                {
                    id: "standard",
                    name: "قياسي"
                }

            ],

            printAreas: [

                {
                    id: "front",
                    name: "الأمام",
                    role: "front",
                    icon: "bi bi-bag",
                    mockup: "assets/images/bag.png",
                    printZone: { leftPct: 24, topPct: 22, widthPct: 52, heightPct: 56, widthCm: 28, heightCm: 30 }
                },

                {
                    id: "back",
                    name: "الخلف",
                    role: "back",
                    icon: "bi bi-bag",
                    mockup: "assets/images/bag.png",
                    printZone: { leftPct: 24, topPct: 22, widthPct: 52, heightPct: 56, widthCm: 28, heightCm: 30 }
                }

            ],

            thumbnail:
                "assets/images/bag.png"
        },


        {
            id: "product-006",

            categoryId: "caps",

            name: "قبعة كلاسيكية",

            studioTitle: "قبعة Unisex كلاسيكية",

            description:
                "قبعة كلاسيكية قابلة للتعديل ومناسبة للطباعة الأمامية",

            price: 25,

            editor: {
                defaultAreaId: "front"
            },

            defaultColor: "black",

            colors: [
                { id: "black", name: "أسود", value: "#171717", image: "assets/images/products1/cap/cap-black-removebg-preview.png" },
                { id: "navy", name: "كحلي", value: "#1D1E2B", image: "assets/images/products1/cap/cap-navy-removebg-preview.png" },
                { id: "storm", name: "رمادي فاتح", value: "#D3D3D3", image: "assets/images/products1/cap/cap-storm-removebg-preview.png" },
                { id: "walnut", name: "جوزي", value: "#786551", image: "assets/images/products1/cap/cap-wallnut-removebg-preview.png" }
            ],

            sizes: [
                { id: "قياسي", name: "قياسي" }
            ],

            printAreas: [
                { id: "front", name: "الواجهة", role: "primary", icon: "bi bi-bullseye", mockup: "assets/images/products1/cap/cap-black-removebg-preview.png", printZone: { leftPct: 31, topPct: 29, widthPct: 38, heightPct: 20, widthCm: 18, heightCm: 8 } }
            ],

            thumbnail:
                "assets/images/products1/cap/cap-black-removebg-preview.png"
        }

    ]

};


/* =============================================================
   DESIGN STUDIO METADATA
============================================================= */

function prepareEditorMetadata(product) {

    if (!product || !product.editor) {
        return product;
    }

    product.editor.printAreas = (product.printAreas || [])
        .map(area => ({
            id: area.id,
            role: area.role,
            name: area.name,
            icon: area.icon,
            mockup: area.mockup || area.image || product.thumbnail,
            printZone: area.printZone ? { ...area.printZone } : null,
            sizePrintZones: area.sizePrintZones
                ? Object.fromEntries(Object.entries(area.sizePrintZones).map(([id, zone]) => [id, { ...zone }]))
                : undefined
        }));

    return product;

}


function resolveEditorAreaMockup(product, area) {

    if (!product || !area) {
        return "";
    }

    return area.mockup || area.image || product.thumbnail || "";

}


function validateEditorProduct(product) {

    if (!product || !product.editor) {
        return {
            valid: false,
            message: "هذا المنتج غير مهيأ لاستوديو التصميم بعد."
        };
    }

    const areas = Array.isArray(product.editor.printAreas)
        ? product.editor.printAreas
        : [];

    if (!areas.length) {
        return {
            valid: false,
            message: "لا توجد مناطق طباعة مهيأة لهذا المنتج."
        };
    }

    const defaultAreaExists = areas.some(
        area => area.id === product.editor.defaultAreaId
    );

    if (!defaultAreaExists) {
        return {
            valid: false,
            message: "منطقة الطباعة الافتراضية لهذا المنتج غير مهيأة."
        };
    }

    const ids = new Set();

    for (const area of areas) {

        if (!area.id || ids.has(area.id) || !resolveEditorAreaMockup(product, area)) {
            return {
                valid: false,
                message: "إحدى مناطق الطباعة تفتقد صورة المنتج أو معرفًا صالحًا."
            };
        }

        ids.add(area.id);

        const zone = area.printZone || {};
        const left = Number(zone.leftPct);
        const top = Number(zone.topPct);
        const width = Number(zone.widthPct);
        const height = Number(zone.heightPct);
        const physicalWidth = Number(zone.widthCm);
        const physicalHeight = Number(zone.heightCm);

        const coordinatesAreValid = [left, top, width, height, physicalWidth, physicalHeight]
            .every(Number.isFinite)
            && left >= 0
            && top >= 0
            && width > 0
            && height > 0
            && physicalWidth > 0
            && physicalHeight > 0
            && left + width <= 100
            && top + height <= 100;

        if (!coordinatesAreValid) {
            return {
                valid: false,
                message: "بيانات منطقة الطباعة لهذا المنتج غير مكتملة أو خارج حدود صورة المنتج."
            };
        }

    }

    return { valid: true, message: "" };

}


if (Array.isArray(window.PALPRINTS_PRODUCT_CATALOG?.products)) {
    backendResponse.products = window.PALPRINTS_PRODUCT_CATALOG.products.map(product =>
        JSON.parse(JSON.stringify(product))
    );
}

backendResponse.products.forEach(prepareEditorMetadata);


/* =============================================================
   INITIALIZATION
============================================================= */

function initializePage() {

    /*
        Simulate Backend response.
    */

    state.categories =
        backendResponse.categories;

    state.products =
        backendResponse.products;


    renderCategories();

    renderProducts();

}


/* =============================================================
   RENDER CATEGORIES
============================================================= */

function renderCategories() {

    elements.categories.innerHTML = "";


    state.categories.forEach(category => {

        const button =
            document.createElement("button");


        button.type = "button";

        button.className =
            "category-button";


        button.dataset.categoryId =
            category.id;


        button.textContent =
            category.name;


        button.setAttribute(
            "aria-current",
            category.id === state.activeCategory
                ? "true"
                : "false"
        );


        if (
            category.id ===
            state.activeCategory
        ) {

            button.classList.add("active");

        }


        button.addEventListener(
            "click",
            () => {

                selectCategory(
                    category.id
                );

            }
        );


        elements.categories.appendChild(
            button
        );

    });

}


/* =============================================================
   SELECT CATEGORY
============================================================= */

function selectCategory(categoryId) {

    state.activeCategory =
        categoryId;


    renderCategories();

    renderProducts();

}


/* =============================================================
   GET FILTERED PRODUCTS
============================================================= */

function getFilteredProducts() {

    if (
        state.activeCategory ===
        "all"
    ) {

        return state.products;

    }


    return state.products.filter(
        product =>
            product.categoryId ===
            state.activeCategory
    );

}


/* =============================================================
   RENDER PRODUCTS
============================================================= */

function renderProducts() {

    elements.productsGrid.innerHTML = "";


    const products =
        getFilteredProducts();


    if (!products.length) {

        renderEmptyProducts();

        return;

    }


    products.forEach(product => {

        const card =
            createProductCard(product);


        elements.productsGrid.appendChild(
            card
        );

    });

}


/* =============================================================
   CREATE PRODUCT CARD
============================================================= */

function createProductCard(product) {

    const article =
        document.createElement("article");


    article.className =
        "product-card";


    if (
        state.selectedProduct &&
        state.selectedProduct.id === product.id
    ) {

        article.classList.add(
            "selected"
        );

    }


    article.dataset.productId =
        product.id;


    const editorValidation =
        validateEditorProduct(product);


    if (!editorValidation.valid) {

        article.classList.add(
            "studio-unavailable"
        );

    }


    const button =
        document.createElement("button");


    button.type = "button";

    button.className =
        "product-card-button";


    button.disabled =
        !editorValidation.valid;


    button.setAttribute(
        "aria-label",
        editorValidation.valid
            ? `بدء تصميم ${product.name}`
            : `${product.name} غير متاح في استوديو التصميم: ${editorValidation.message}`
    );


    button.addEventListener(
        "click",
        () => {

            selectProduct(
                product.id
            );

        }
    );


    /* -----------------------------------------
       Selected indicator
    ------------------------------------------ */

    const indicator =
        document.createElement("span");


    indicator.className =
        "product-selected-indicator";


    indicator.setAttribute(
        "aria-hidden",
        "true"
    );


    indicator.textContent =
        "✓";


    /* -----------------------------------------
       Image wrapper
    ------------------------------------------ */

    const imageWrapper =
        document.createElement("div");


    imageWrapper.className =
        "product-image-wrapper";


    const image =
        document.createElement("img");


    image.className =
        "product-image";


    image.src =
        product.thumbnail;


    image.alt =
        product.name;


    image.loading =
        "lazy";


    imageWrapper.appendChild(
        image
    );


    /* -----------------------------------------
       Product information
    ------------------------------------------ */

    const information =
        document.createElement("div");


    information.className =
        "product-info";


    const name =
        document.createElement("h3");


    name.className =
        "product-name";


    name.textContent =
        product.name;


    const price =
        document.createElement("p");


    price.className =
        "product-price";


    price.textContent =
        `${product.price.toFixed(2)} رس`;


    information.appendChild(name);

    information.appendChild(price);


    if (!editorValidation.valid) {

        const availability =
            document.createElement("p");


        availability.className =
            "studio-availability-message";


        availability.textContent =
            "إعدادات الاستوديو غير مكتملة";


        information.appendChild(
            availability
        );

    }


    button.appendChild(
        imageWrapper
    );

    button.appendChild(
        information
    );


    article.appendChild(
        indicator
    );

    article.appendChild(
        button
    );


    return article;

}


/* =============================================================
   EMPTY PRODUCTS
============================================================= */

function renderEmptyProducts() {

    const empty =
        document.createElement("div");


    empty.className =
        "empty-products";


    empty.innerHTML = `
        <strong>
            لا توجد منتجات
        </strong>

        <span>
            لا توجد منتجات متاحة في هذه الفئة حاليًا.
        </span>
    `;


    elements.productsGrid.appendChild(
        empty
    );

}


/* =============================================================
   SELECT PRODUCT
============================================================= */

function selectProduct(productId) {

    const product =
        state.products.find(
            item =>
                item.id === productId
        );


    if (!product) {
        return;
    }


    const editorValidation =
        validateEditorProduct(product);


    if (!editorValidation.valid) {

        elements.selectionMessage.textContent =
            editorValidation.message;

        announce(
            editorValidation.message
        );

        return;

    }


    state.selectedProduct =
        product;


    /*
        Reset product-specific state.
    */

    state.selectedColor =
        product.colors.find(
            color =>
                color.id ===
                product.defaultColor
        ) ||
        product.colors[0] ||
        null;


    state.selectedSize =
        product.sizes[0] ||
        null;


    state.selectedPrintAreas =
        product.printAreas
            .filter(
                area => area.id === product.editor.defaultAreaId
            )
            .map(
                area => area.id
            );


    announce(
        `تم اختيار ${product.name}`
    );

    startDesign();

}


/* =============================================================
   RENDER PRODUCT DETAILS
============================================================= */

function renderProductDetails() {

    const product =
        state.selectedProduct;


    if (!product) {

        elements.productOptions.hidden =
            true;

        return;

    }


    elements.productOptions.hidden =
        false;


    elements.selectedProductTitle.textContent =
        product.name;


    elements.selectedProductDescription.textContent =
        product.description;


    renderPreview();

    renderColors();

    renderSizes();

    renderPrintAreas();

    updateStartButton();

}


/* =============================================================
   RENDER PREVIEW
============================================================= */

function renderPreview() {

    const color =
        state.selectedColor;


    if (!color) {

        elements.previewImage.hidden =
            true;

        if (elements.previewPlaceholder) {

            elements.previewPlaceholder.hidden =
                false;

        }

        return;

    }


    elements.previewImage.src =
        color.image;


    elements.previewImage.alt =
        `${state.selectedProduct.name} - ${color.name}`;


    elements.previewImage.hidden =
        false;


    if (elements.previewPlaceholder) {

        elements.previewPlaceholder.hidden =
            true;

    }

}


/* =============================================================
   RENDER COLORS
============================================================= */

function renderColors() {

    elements.colors.innerHTML = "";


    const colors =
        state.selectedProduct.colors;


    colors.forEach(color => {

        const label =
            document.createElement("label");


        label.className =
            "color-option";


        label.title =
            color.name;


        const input =
            document.createElement("input");


        input.type =
            "radio";


        input.name =
            "product-color";


        input.value =
            color.id;


        input.checked =
            state.selectedColor &&
            state.selectedColor.id ===
            color.id;


        input.setAttribute(
            "aria-label",
            color.name
        );


        input.addEventListener(
            "change",
            () => {

                selectColor(
                    color.id
                );

            }
        );


        const circle =
            document.createElement("span");


        circle.className =
            "color-circle";


        circle.style.backgroundColor =
            color.value;


        /*
            Add border for white colors
            so they remain visible.
        */

        if (
            color.value.toLowerCase() ===
            "#ffffff"
        ) {

            circle.style.border =
                "1px solid #d8dbe5";

        }


        label.appendChild(input);

        label.appendChild(circle);


        elements.colors.appendChild(
            label
        );

    });

}


/* =============================================================
   SELECT COLOR
============================================================= */

function selectColor(colorId) {

    const color =
        state.selectedProduct.colors.find(
            item =>
                item.id === colorId
        );


    if (!color) {
        return;
    }


    state.selectedColor =
        color;


    renderPreview();

    renderColors();

    announce(
        `تم اختيار اللون ${color.name}`
    );

}


/* =============================================================
   RENDER SIZES
============================================================= */

function renderSizes() {

    elements.sizes.innerHTML = "";


    state.selectedProduct.sizes.forEach(
        size => {

            const label =
                document.createElement("label");


            label.className =
                "size-option";


            const input =
                document.createElement("input");


            input.type =
                "radio";


            input.name =
                "product-size";


            input.value =
                size.id;


            input.checked =
                state.selectedSize &&
                state.selectedSize.id ===
                size.id;


            input.setAttribute(
                "aria-label",
                `المقاس ${size.name}`
            );


            input.addEventListener(
                "change",
                () => {

                    selectSize(
                        size.id
                    );

                }
            );


            const visualLabel =
                document.createElement("span");


            visualLabel.className =
                "size-label";


            visualLabel.textContent =
                size.name;


            label.appendChild(input);

            label.appendChild(
                visualLabel
            );


            elements.sizes.appendChild(
                label
            );

        }
    );

}


/* =============================================================
   SELECT SIZE
============================================================= */

function selectSize(sizeId) {

    const size =
        state.selectedProduct.sizes.find(
            item =>
                item.id === sizeId
        );


    if (!size) {
        return;
    }


    state.selectedSize =
        size;


    renderSizes();

    updateStartButton();

    announce(
        `تم اختيار المقاس ${size.name}`
    );

}


/* =============================================================
   RENDER PRINTING AREAS
============================================================= */

function renderPrintAreas() {

    elements.printAreas.innerHTML = "";


    /*
        Only areas returned by the Backend
        are rendered.

        Unsupported areas are never displayed.
    */

    state.selectedProduct.printAreas
        .forEach(area => {

            const label =
                document.createElement("label");


            label.className =
                "print-area-option";


            const input =
                document.createElement("input");


            input.type =
                "checkbox";


            input.name =
                "print-area";


            input.value =
                area.id;


            input.checked =
                state.selectedPrintAreas.includes(
                    area.id
                );


            input.setAttribute(
                "aria-label",
                area.name
            );


            input.addEventListener(
                "change",
                () => {

                    togglePrintArea(
                        area.id,
                        input.checked
                    );

                }
            );


            const visualLabel =
                document.createElement("span");


            visualLabel.className =
                "print-area-label";


            const icon =
                area.image
                    ? document.createElement("img")
                    : document.createElement("i");


            icon.className =
                "print-area-icon";


            icon.setAttribute(
                "aria-hidden",
                "true"
            );


            if (area.image) {

                icon.src =
                    area.image;

                icon.alt =
                    "";

                icon.draggable =
                    false;

            } else {

                icon.className =
                    `print-area-icon ${area.icon}`;

            }


            const name =
                document.createElement("span");


            name.textContent =
                area.name;


            visualLabel.appendChild(
                icon
            );


            visualLabel.appendChild(
                name
            );


            label.appendChild(input);

            label.appendChild(
                visualLabel
            );


            elements.printAreas.appendChild(
                label
            );

        });

}


/* =============================================================
   TOGGLE PRINT AREA
============================================================= */

function togglePrintArea(
    areaId,
    checked
) {

    if (checked) {

        if (
            !state.selectedPrintAreas
                .includes(areaId)
        ) {

            state.selectedPrintAreas.push(
                areaId
            );

        }

    } else {

        state.selectedPrintAreas =
            state.selectedPrintAreas.filter(
                id =>
                    id !== areaId
            );

    }


    updateStartButton();

}


/* =============================================================
   VALIDATE SELECTION
============================================================= */

function validateSelection() {

    if (!state.selectedProduct) {

        return {
            valid: false,
            message:
                "يرجى اختيار منتج أولًا."
        };

    }


    const editorValidation =
        validateEditorProduct(state.selectedProduct);


    if (!editorValidation.valid) {
        return editorValidation;
    }


    if (!state.selectedColor) {

        return {
            valid: false,
            message:
                "يرجى اختيار اللون."
        };

    }


    if (!state.selectedSize) {

        return {
            valid: false,
            message:
                "يرجى اختيار المقاس."
        };

    }


    if (
        state.selectedPrintAreas.length === 0
    ) {

        return {
            valid: false,
            message:
                "يرجى اختيار منطقة طباعة واحدة على الأقل."
        };

    }


    return {
        valid: true,
        message: ""
    };

}


/* =============================================================
   UPDATE START BUTTON
============================================================= */

function updateStartButton() {

    const validation =
        validateSelection();


    elements.startDesignButton.disabled =
        !validation.valid;


    elements.selectionMessage.textContent =
        validation.valid
            ? ""
            : validation.message;

}


/* =============================================================
   CREATE DESIGNER PAYLOAD
============================================================= */

function createEditorProductSnapshot(product) {

    return {
        id: product.id,
        categoryId: product.categoryId,
        name: product.name,
        studioTitle: product.studioTitle || product.name,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        colors: product.colors.map(color => ({
            ...color,
            areaMockups: color.areaMockups ? { ...color.areaMockups } : undefined
        })),
        sizes: product.sizes.map(size => ({ ...size })),
        editor: {
            defaultAreaId: product.editor.defaultAreaId,
            printAreas: product.editor.printAreas.map(area => ({
                ...area,
                printZone: { ...area.printZone },
                sizePrintZones: area.sizePrintZones
                    ? Object.fromEntries(Object.entries(area.sizePrintZones).map(([id, zone]) => [id, { ...zone }]))
                    : undefined
            }))
        }
    };

}


function createDesignerPayload() {

    return {

        designId:
            typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : `design-${Date.now()}-${Math.random().toString(16).slice(2)}`,

        productId:
            state.selectedProduct.id,

        colorId:
            state.selectedColor.id,

        sizeId:
            state.selectedSize.id,

        printAreaIds:
            [...state.selectedPrintAreas],

        editorProduct: createEditorProductSnapshot(state.selectedProduct),

        editorProducts: state.products
            .filter(product => validateEditorProduct(product).valid)
            .map(createEditorProductSnapshot)

    };

}


/* =============================================================
   START DESIGN
============================================================= */

function startDesign() {

    const validation =
        validateSelection();


    if (!validation.valid) {

        elements.selectionMessage.textContent =
            validation.message;

        announce(
            validation.message
        );

        return;

    }


    const payload =
        createDesignerPayload();


    /*
        This object is sent to the Design Studio.
        The editorProduct snapshot keeps the studio product-agnostic.

        Example:

        {
            productId: "product-001",
            colorId: "black",
            sizeId: "M",
            printAreaIds: [
                "front",
                "back"
            ]
        }
    */


    console.log(
        "Designer payload:",
        payload
    );


    sessionStorage.setItem(
        "palprintsDesignerSelection",
        JSON.stringify(payload)
    );


    window.location.href =
        "design-studio.html";

}


/* =============================================================
   BACK BUTTON
============================================================= */

function goBack() {

    if (
        window.history.length > 1
    ) {

        window.history.back();

        return;

    }


    /* Future designer dashboard fallback when no previous page exists. */

    window.location.href =
        "dashboard.html";

}


/* =============================================================
   SCREEN READER ANNOUNCEMENT
============================================================= */

function announce(message) {

    elements.liveRegion.textContent =
        "";


    window.setTimeout(
        () => {

            elements.liveRegion.textContent =
                message;

        },
        50
    );

}


/* =============================================================
   EVENTS
============================================================= */

elements.startDesignButton
    .addEventListener(
        "click",
        startDesign
    );


elements.backButton
    .addEventListener(
        "click",
        goBack
    );


/* =============================================================
   START APPLICATION
============================================================= */

initializePage();

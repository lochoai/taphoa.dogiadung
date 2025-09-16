// MÃ NGUỒN TRUNG TÂM

const TELEGRAM_BOT_TOKEN = "7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8";
const TELEGRAM_CHAT_ID = "7774024453";

const products = {
  "tap-hoa": {
    "mặt hàng": [
      {
        id: "th-mh-001",
        name: "Nước mắm Nam Ngư",
        price: 25000,
        img: "images/nước mắm nam ngư.jfif",
        desc: "Nước mắm truyền thống thơm ngon, đậm đà vị biển."
      },
      {
        id: "th-mh-002",
        name: "Coca-Cola chai 1.5L",
        price: 22000,
        img: "images/coca-cola-1.5l.jpg",
        desc: "Nước ngọt Coca-Cola chai 1.5L, giải khát tuyệt vời."
      }
    ],
    "gia vị": [
      {
        id: "th-gv-001",
        name: "Hạt nêm Ajinomoto",
        price: 18000,
        img: "images/hat-nem-ajinomoto.jpg",
        desc: "Gia vị nêm nếm ngon cho mọi món ăn."
      }
    ],
    "bánh kẹo": [
      {
        id: "th-bk-001",
        name: "Bánh quy Oreo",
        price: 12000,
        img: "images/oreo.jpg",
        desc: "Bánh quy Oreo ngon giòn, thơm ngon."
      }
    ],
    "đồ uống": [
      {
        id: "th-du-001",
        name: "Nước ép cam tươi",
        price: 15000,
        img: "images/nuoc-ep-cam.jpg",
        desc: "Nước ép cam nguyên chất, tốt cho sức khỏe."
      }
    ],
    "đồ gội rửa": [
      {
        id: "th-dgr-001",
        name: "Dầu gội Head & Shoulders",
        price: 60000,
        img: "images/dau-goi-hs.jpg",
        desc: "Dầu gội sạch gàu, thơm mát."
      }
    ],
    "thuốc lá": [
      {
        id: "th-tl-001",
        name: "Thuốc lá Jet",
        price: 35000,
        img: "images/thuoc-la-jet.jpg",
        desc: "Thuốc lá Jet hương vị đặc trưng."
      }
    ],
    "đồ khô": [
      {
        id: "th-dk-001",
        name: "Mực khô loại 1",
        price: 120000,
        img: "images/muc-kho.jpg",
        desc: "Mực khô tẩm gia vị ngon, dùng làm mồi nhậu."
      }
    ]
  },
  "gia-dung": {
    "mặt hàng": [
      {
        id: "gd-mh-001",
        name: "Nồi cơm điện Sunhouse",
        price: 1500000,
        img: "images/noi-com-dien.jpg",
        desc: "Nồi cơm điện dung tích 1.8L, tiết kiệm điện."
      }
    ],
    "đồ điện": [
      {
        id: "gd-de-001",
        name: "Quạt điện Asia",
        price: 650000,
        img: "images/quat-dien.jpg",
        desc: "Quạt điện làm mát hiệu quả, an toàn."
      }
    ],
    "đồ bếp": [
      {
        id: "gd-db-001",
        name: "Bộ dao nhà bếp",
        price: 300000,
        img: "images/bo-dao.jpg",
        desc: "Bộ dao sắc bén, tiện lợi cho nhà bếp."
      }
    ],
    "chén bát": [
      {
        id: "gd-cb-001",
        name: "Bộ chén bát sứ",
        price: 450000,
        img: "images/chen-bat.jpg",
        desc: "Bộ chén bát bằng sứ cao cấp, họa tiết đẹp."
      }
    ],
    "gia dụng": [
      {
        id: "gd-gd-001",
        name: "Máy hút bụi mini",
        price: 700000,
        img: "images/may-hut-bui.jpg",
        desc: "Máy hút bụi tiện dụng cho gia đình."
      }
    ]
  }
};

let currentCategory = "tap-hoa";
let currentSubCategory = "mặt hàng";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $("#cart-count").textContent = count;
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.tabIndex = 0;
  card.innerHTML = `
    <img src="${product.img}" alt="${product.name}" />
    <div class="product-info">
      <h4>${product.name}</h4>
      <p>${product.price.toLocaleString()} đ</p>
    </div>
    <div class="product-actions">
      <button class="add-cart-btn">Thêm giỏ hàng</button>
      <button class="buy-now-btn">Mua ngay</button>
    </div>
  `;

  // Hover effect done by CSS already

  // Click on product card to open detail modal
  card.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("add-cart-btn") ||
      e.target.classList.contains("buy-now-btn")
    ) {
      return; // ignore
    }
    showProductDetail(product);
  });

  card.querySelector(".add-cart-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  });

  card.querySelector(".buy-now-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    window.location.href = "cart.html";
  });

  return card;
}

function renderSubCategories() {
  const subCategoryContainer = $("#sub-categories");
  subCategoryContainer.innerHTML = "";
  const subCats = Object.keys(products[currentCategory]);
  subCats.forEach((subCat) => {
    const div = document.createElement("div");
    div.className = "sub-category";
    if (subCat === currentSubCategory) {
      div.classList.add("active");
    }
    div.textContent = subCat.toUpperCase();
    div.addEventListener("click", () => {
      currentSubCategory = subCat;
      renderSubCategories();
      renderProducts();
    });
    subCategoryContainer.appendChild(div);
  });
}

function renderProducts() {
  const productList = $("#product-list");
  productList.innerHTML = "";

  const productArr = products[currentCategory][currentSubCategory] || [];

  productArr.forEach((product) => {
    productList.appendChild(createProductCard(product));
  });
}

function showProductDetail(product) {
  const modal = $("#product-detail-modal");
  modal.querySelector(".modal-title").textContent = product.name;
  modal.querySelector(".modal-image").src = product.img;
  modal.querySelector(".modal-description").textContent = product.desc;
  modal.querySelector(".modal-price").textContent =
    product.price.toLocaleString() + " đ";

  // Remove old listeners to prevent stacking
  const addBtn = modal.querySelector(".add-to-cart-btn");
  const buyBtn = modal.querySelector(".buy-now-btn");
  addBtn.replaceWith(addBtn.cloneNode(true));
  buyBtn.replaceWith(buyBtn.cloneNode(true));
  const newAddBtn = modal.querySelector(".add-to-cart-btn");
  const newBuyBtn = modal.querySelector(".buy-now-btn");

  newAddBtn.addEventListener("click", () => {
    addToCart(product, 1);
  });
  newBuyBtn.addEventListener("click", () => {
    addToCart(product, 1);
    window.location.href = "cart.html";
  });

  // Show modal
  modal.classList.remove("hidden");
}

function closeProductDetail() {
  $("#product-detail-modal").classList.add("hidden");
}

function addToCart(product, qty) {
  const found = cart.find((item) => item.id === product.id);
  if (found) {
    found.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  saveCart();
  updateCartCount();
  showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 1000);
}

function initCategoryTabs() {
  const tapHoaTab = $("#tab-tap-hoa");
  const giaDungTab = $("#tab-gia-dung");

  tapHoaTab.addEventListener("click", () => {
    currentCategory = "tap-hoa";
    currentSubCategory = "mặt hàng";
    renderCategory();
  });

  giaDungTab.addEventListener("click", () => {
    currentCategory = "gia-dung";
    currentSubCategory = "mặt hàng";
    renderCategory();
  });
}

function renderCategory() {
  // Update active tab
  $("#tab-tap-hoa").classList.toggle("active", currentCategory === "tap-hoa");
  $("#tab-gia-dung").classList.toggle("active", currentCategory === "gia-dung");

  // Render sub categories and products
  renderSubCategories();
  renderProducts();
}

function initContactLinks() {
  // Phone call confirmation
  $("#phone-link").addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Bạn muốn gọi số 0372057834?")) {
      window.location.href = "tel:0372057834";
    }
  });

  // Facebook
  $("#fb-link").addEventListener("click", (e) => {
    e.preventDefault();
    window.open("https://www.facebook.com/pro.huuloc.1", "_blank");
  });

  // Zalo - not updated, alert
  $("#zl-link").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Zalo shop chưa cập nhật.");
  });

  // Telegram
  $("#tele-link").addEventListener("click", (e) => {
    e.preventDefault();
    window.open("https://t.me/7774024453", "_blank");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initCategoryTabs();
  renderCategory();
  initContactLinks();

  // Close product detail modal
  $("#product-detail-modal .close-btn").addEventListener("click", closeProductDetail);

  // Keyboard ESC to close modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductDetail();
    }
  });
});

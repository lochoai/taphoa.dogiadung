// --- Dữ liệu mẫu sản phẩm ---
// Bạn có thể mở rộng thêm hoặc thay đổi hình ảnh trong folder images/
const productsData = {
  taph: {
    "mat-hang": [
      {
        id: "taph-mh-001",
        name: "Nước mắm Nam Ngư",
        price: 25000,
        image: "images/nuoc-mam-nam-ngu.jpg",
      },
      {
        id: "taph-mh-002",
        name: "Gạo ST25",
        price: 150000,
        image: "images/gao-st25.jpg",
      },
      // Thêm sản phẩm khác...
    ],
    "gia-vi": [
      {
        id: "taph-gv-001",
        name: "Hạt nêm Knorr",
        price: 20000,
        image: "images/hat-nem-knorr.jpg",
      },
      // Thêm...
    ],
    "banh-keo": [
      {
        id: "taph-bk-001",
        name: "Bánh quy Oreo",
        price: 18000,
        image: "images/oreo.jpg",
      },
      // Thêm...
    ],
    "do-uong": [
      {
        id: "taph-du-001",
        name: "Coca-Cola",
        price: 12000,
        image: "images/cocacola.jpg",
      },
      // Thêm...
    ],
    "do-goi-rua": [
      {
        id: "taph-dgr-001",
        name: "Dầu gội Clear",
        price: 45000,
        image: "images/dau-goi-clear.jpg",
      },
      // Thêm...
    ],
    "thuoc-la": [
      {
        id: "taph-tl-001",
        name: "Thuốc lá Jet",
        price: 25000,
        image: "images/thuoc-la-jet.jpg",
      },
    ],
    "do-kho": [
      {
        id: "taph-dk-001",
        name: "Mực khô",
        price: 120000,
        image: "images/muc-kho.jpg",
      },
      // Thêm...
    ],
  },
  giad: {
    "mat-hang": [
      {
        id: "giad-mh-001",
        name: "Nồi cơm điện Sunhouse",
        price: 1500000,
        image: "images/noi-com-sunhouse.jpg",
      },
      // Thêm...
    ],
    "do-dien": [
      {
        id: "giad-dd-001",
        name: "Quạt cây Panasonic",
        price: 850000,
        image: "images/quat-cay.jpg",
      },
      // Thêm...
    ],
    "do-bep": [
      {
        id: "giad-db-001",
        name: "Chảo chống dính",
        price: 250000,
        image: "images/chao-chong-dinh.jpg",
      },
      // Thêm...
    ],
    "chen-bat": [
      {
        id: "giad-cb-001",
        name: "Bộ chén bát sứ",
        price: 300000,
        image: "images/bo-chen-bat.jpg",
      },
      // Thêm...
    ],
    "gia-dung": [
      {
        id: "giad-gd-001",
        name: "Máy hút bụi",
        price: 2200000,
        image: "images/may-hut-bui.jpg",
      },
      // Thêm...
    ],
  },
};

// --- Biến toàn cục ---
let currentCategory = "taph";
let currentSubcategory = "mat-hang";
let cart = {};

// --- DOM elements ---
const categoryTabs = document.querySelectorAll(".category");
const subcategoryContainers = {
  taph: document.getElementById("subcategories-tapho"),
  giad: document.getElementById("subcategories-giadung"),
};
const productListEl = document.getElementById("product-list");

// --- Khởi động ---
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  setupCategoryTabs();
  setupSubcategoryTabs();
  renderProducts();
  setupContactLinks();
});

// --- Hàm load giỏ hàng từ localStorage ---
function loadCartFromStorage() {
  const stored = localStorage.getItem("cart");
  if (stored) {
    cart = JSON.parse(stored);
  } else {
    cart = {};
  }
}

// --- Lưu giỏ hàng ---
function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Thiết lập sự kiện cho các tab danh mục lớn ---
function setupCategoryTabs() {
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.id === "category-tapho") {
        currentCategory = "taph";
      } else if (tab.id === "category-giadung") {
        currentCategory = "giad";
      }
      currentSubcategory = "mat-hang";
      // Update active tab
      categoryTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      // Hiện/ẩn subcategory
      for (const key in subcategoryContainers) {
        if (key === currentCategory) {
          subcategoryContainers[key].style.display = "flex";
        } else {
          subcategoryContainers[key].style.display = "none";
        }
      }
      // Reset active subcategory
      const subs = subcategoryContainers[currentCategory].querySelectorAll(".subcategory");
      subs.forEach((s) => {
        if (s.dataset.sub === "mat-hang") {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
      renderProducts();
    });
  });
}

// --- Thiết lập sự kiện cho các tab phân mục con ---
function setupSubcategoryTabs() {
  for (const key in subcategoryContainers) {
    const subs = subcategoryContainers[key].querySelectorAll(".subcategory");
    subs.forEach((sub) => {
      sub.addEventListener("click", () => {
        if (key !== currentCategory) return; // tránh click subcategory khác category
        currentSubcategory = sub.dataset.sub;
        // active subcategory
        subs.forEach((s) => s.classList.remove("active"));
        sub.classList.add("active");
        renderProducts();
      });
    });
  }
}

// --- Render danh sách sản phẩm ---
function renderProducts() {
  const data = productsData[currentCategory][currentSubcategory];
  productListEl.innerHTML = "";
  if (!data || data.length === 0) {
    productListEl.innerHTML = `<p>Chưa có sản phẩm nào trong mục này.</p>`;
    return;
  }

  // Chọn kiểu hiển thị 2 cột hay 4 cột
  if (currentSubcategory === "mat-hang") {
    productListEl.classList.remove("two-columns");
    productListEl.classList.remove("four-columns");
    productListEl.classList.add("four-columns");
  } else {
    productListEl.classList.remove("four-columns");
    productListEl.classList.remove("two-columns");
    productListEl.classList.add("two-columns");
  }

  data.forEach((prod) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = prod.id;

    card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" />
      <div class="product-name">${prod.name}</div>
      <div class="product-price">${formatCurrency(prod.price)}</div>
      <div class="product-actions">
        <button class="button add-cart-btn" title="Thêm vào giỏ hàng">+</button>
        <button class="button buy-now-btn" title="Mua ngay">🛒</button>
      </div>
    `;

    // Click vào thẻ để xem chi tiết
    card.querySelector("img").addEventListener("click", () => {
      showProductDetail(prod);
    });
    card.querySelector(".product-name").addEventListener("click", () => {
      showProductDetail(prod);
    });

    // Thêm giỏ hàng
    card.querySelector(".add-cart-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(prod.id, 1);
    });

    // Mua ngay
    card.querySelector(".buy-now-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(prod.id, 1);
      window.location.href = "cart.html";
    });

    productListEl.appendChild(card);
  });
}

// --- Format số tiền ---
function formatCurrency(num) {
  return num.toLocaleString("vi-VN") + " đ";
}

// --- Thêm sản phẩm vào giỏ hàng ---
function addToCart(productId, quantity) {
  if (!cart[productId]) {
    cart[productId] = 0;
  }
  cart[productId] += quantity;
  saveCartToStorage();
  showAddCartNotification(productId);
}

// --- Hiển thị thông báo thêm giỏ hàng ---
function showAddCartNotification(productId) {
  const product = findProductById(productId);
  if (!product) return;
  const notif = document.createElement("div");
  notif.className = "add-cart-notif";
  notif.textContent = `Đã thêm "${product.name}" vào giỏ hàng`;
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.classList.add("show");
  }, 10);
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 1000);
}

// --- Tìm sản phẩm theo id ---
function findProductById(id) {
  for (const catKey in productsData) {
    for (const subKey in productsData[catKey]) {
      const prod = productsData[catKey][subKey].find((p) => p.id === id);
      if (prod) return prod;
    }
  }
  return null;
}

// --- Hiển thị chi tiết sản phẩm ---
function showProductDetail(prod) {
  // Tạo overlay
  const overlay = document.createElement("div");
  overlay.className = "product-detail-overlay";

  overlay.innerHTML = `
    <div class="product-detail-content">
      <button class="btn-back-detail">&larr; Trở về</button>
      <img src="${prod.image}" alt="${prod.name}" />
      <h2>${prod.name}</h2>
      <p><strong>Giá:</strong> ${formatCurrency(prod.price)}</p>
      <p>Chi tiết sản phẩm sẽ được cập nhật sau.</p>
      <div class="product-detail-actions">
        <button class="button add-cart-btn">Thêm vào giỏ hàng</button>
        <button class="button buy-now-btn">Đặt hàng</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector(".btn-back-detail").addEventListener("click", () => {
    overlay.remove();
  });

  overlay.querySelector(".add-cart-btn").addEventListener("click", () => {
    addToCart(prod.id, 1);
  });

  overlay.querySelector(".buy-now-btn").addEventListener("click", () => {
    addToCart(prod.id, 1);
    window.location.href = "cart.html";
  });
}

// --- Thiết lập liên kết liên hệ ---
// Gồm gọi điện, fb, zalo, telegram
function setupContactLinks() {
  // Số điện thoại
  const phoneEl = document.getElementById("contact-phone");
  phoneEl.addEventListener("click", () => {
    const call = confirm("Bạn có muốn gọi số 0372057834 không?");
    if (call) {
      window.location.href = "tel:0372057834";
    }
  });

  // Facebook
  const fbEl = document.getElementById("contact-fb");
  fbEl.addEventListener("click", () => {
    window.open("https://www.facebook.com/pro.huuloc.1", "_blank");
  });

  // Zalo chưa cập nhật - bạn có thể thêm link khi có
  const zlEl = document.getElementById("contact-zl");
  zlEl.addEventListener("click", () => {
    alert("Zalo chưa cập nhật.");
  });

  // Telegram
  const teleEl = document.getElementById("contact-tele");
  teleEl.addEventListener("click", () => {
    window.open("https://t.me/7774024453", "_blank");
  });
}

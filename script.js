// Dữ liệu mẫu sản phẩm (có thể mở rộng sau này)
const products = [
  { id: 1, name: "Nước mắm Nam Ngư", category: "gia-vi", price: 18000 },
  { id: 2, name: "Kẹo dừa Bến Tre", category: "banh-keo", price: 25000 },
  { id: 3, name: "Trà xanh C2", category: "do-uong", price: 10000 },
  { id: 4, name: "Dầu gội Clear", category: "goi-rua", price: 55000 },
  { id: 5, name: "Thuốc lá Vinataba", category: "thuoc-la", price: 22000 },
  { id: 6, name: "Mì Hảo Hảo", category: "do-kho", price: 4000 },
  { id: 7, name: "Ổ điện 3 lỗ", category: "do-dien", price: 30000 },
  { id: 8, name: "Nồi inox", category: "do-bep", price: 120000 },
  { id: 9, name: "Chén sứ trắng", category: "chen-bat", price: 10000 },
  { id: 10, name: "Máy sấy tóc mini", category: "gia-dung", price: 80000 }
];

// LocalStorage keys
const CART_KEY = 'lochoai_cart';

// API TELEGRAM
const BOT_TOKEN = "7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8";
const CHAT_ID = "944976544";

// ========== HIỂN THỊ SẢN PHẨM ==========
function renderProducts(category = "all") {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";

  const filtered = category === "all" ? products : products.filter(p => p.category === category);
  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h4>${product.name}</h4>
      <p><strong>${product.price.toLocaleString()}₫</strong></p>
      <button class="add-to-cart" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
      <button class="buy-now" onclick="buyNow(${product.id})">Đặt hàng</button>
    `;

    container.appendChild(card);
  });
}

// ========== THÊM VÀO GIỎ HÀNG ==========
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || {};
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  showNotification("Đã thêm sản phẩm vào giỏ hàng");
  updateCartCount();
}

// ========== ĐẶT HÀNG NGAY ==========
function buyNow(id) {
  addToCart(id);
  window.location.href = "cart.html";
}

// ========== HIỂN THỊ GIỎ HÀNG ==========
function renderCart() {
  const tbody = document.querySelector("#cart-table tbody");
  const totalEl = document.getElementById("total-price");
  const grandTotalEl = document.getElementById("grand-total");
  if (!tbody) return;

  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || {};
  tbody.innerHTML = "";

  let total = 0;
  Object.keys(cart).forEach((id) => {
    const product = products.find((p) => p.id == id);
    const quantity = cart[id];
    const itemTotal = product.price * quantity;
    total += itemTotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${quantity}</td>
      <td>${product.price.toLocaleString()}₫</td>
      <td>${itemTotal.toLocaleString()}₫</td>
    `;
    tbody.appendChild(tr);
  });

  totalEl.textContent = total.toLocaleString();
  grandTotalEl.textContent = (total + 20000).toLocaleString();
}

// ========== ĐẾM SẢN PHẨM TRONG GIỎ ==========
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || {};
  const count = Object.values(cart).reduce((acc, cur) => acc + cur, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = count;
}

// ========== THÔNG BÁO ==========
function showNotification(text) {
  const notif = document.getElementById("notification");
  if (!notif) return;
  notif.textContent = text;
  notif.style.display = "block";
  setTimeout(() => {
    notif.style.display = "none";
  }, 1000);
}

// ========== GỬI ĐƠN HÀNG VỀ TELEGRAM ==========
async function sendOrderToTelegram(orderText) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: orderText }),
  });
  return res.ok;
}

// ========== XỬ LÝ ĐẶT HÀNG ==========
function handleOrder() {
  document.getElementById("checkout-form").classList.remove("hidden");
}

function cancelOrder() {
  document.getElementById("checkout-form").classList.add("hidden");
}

async function confirmOrder() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !address) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || {};
  if (!Object.keys(cart).length) return;

  let text = `🛒 *ĐƠN HÀNG MỚI*%0A`;
  text += `👤 Tên: ${name}%0A📞 SĐT: ${phone}%0A🏠 Địa chỉ: ${address}%0A`;
  text += `%0A🧾 *Chi tiết đơn:*%0A`;

  let total = 0;
  for (let id in cart) {
    const product = products.find(p => p.id == id);
    const quantity = cart[id];
    const itemTotal = product.price * quantity;
    total += itemTotal;
    text += `- ${product.name} x${quantity} = ${itemTotal.toLocaleString()}₫%0A`;
  }

  text += `%0A🚚 Phí ship: 20,000₫%0A💰 Tổng cộng: ${(total + 20000).toLocaleString()}₫`;

  const ok = await sendOrderToTelegram(text);

  if (ok) {
    showNotification("✅ Đặt hàng thành công!");
    localStorage.removeItem(CART_KEY);
    setTimeout(() => window.location.href = "index.html", 2000);
  } else {
    showNotification("❌ Đặt hàng thất bại. Vui lòng thử lại.");
  }
}

// ========== KHỞI TẠO ==========
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Nếu là index.html
  if (document.getElementById("product-list")) {
    renderProducts();

    document.querySelectorAll(".menu button").forEach(btn => {
      btn.addEventListener("click", () => {
        renderProducts(btn.dataset.category);
      });
    });
  }

  // Nếu là cart.html
  if (document.getElementById("cart-table")) {
    renderCart();

    const checkoutBtn = document.getElementById("checkout-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const confirmBtn = document.getElementById("confirm-btn");

    if (checkoutBtn) checkoutBtn.addEventListener("click", handleOrder);
    if (cancelBtn) cancelBtn.addEventListener("click", cancelOrder);
    if (confirmBtn) confirmBtn.addEventListener("click", confirmOrder);
  }
});

// Các sản phẩm mẫu (bạn có thể thay thế hình và thêm 20 sản phẩm mỗi loại)
const products = [
  { id: 1, name: "Nồi cơm điện Sunhouse", price: 350000, category: "do-dien", image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTA3s0gbQjUNPqxuGeIJOET2InAeMLSpzip1-dM--wAnNc-g5bAuxShEznNYQm9iIhISim_EP0yzPfMCseMfl9gpO-SUGZNszYNHlcy-SsBKB5GHsbE__zP" },
  { id: 2, name: "Nước mắm Nam Ngư", price: 25000, category: "gia-vi", image: "images/nuoc-mam.jpg" },
  { id: 3, name: "Bánh quy Oreo", price: 30000, category: "banh-keo", image: "images/bánh quy oreo.jfif" },
  { id: 4, name: "Coca-Cola", price: 15000, category: "do-uong", image: "images/cocacola.jpg" },
  { id: 5, name: "Dầu gội Head & Shoulders", price: 80000, category: "goi-rua", image: "images/dau-goi.jpg" },
  { id: 6, name: "Thuốc lá Vinataba", price: 40000, category: "thuoc-la", image: "images/thuoc-la.jpg" },
  { id: 7, name: "Mì tôm Hảo Hảo", price: 7000, category: "do-kho", image: "images/mi-tom.jpg" },
  { id: 8, name: "Quạt điện Asia", price: 650000, category: "do-dien", image: "images/quat-dien.jpg" },
  { id: 9, name: "Nồi lẩu điện", price: 450000, category: "do-bep", image: "images/noi-lau.jpg" },
  { id: 10, name: "Bộ chén bát sứ", price: 250000, category: "chen-bat", image: "images/chen-bat.jpg" },
  // Thêm các sản phẩm khác nếu cần ...
];

// Lấy cart từ localStorage hoặc tạo mới
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Kiểm tra trang hiện tại
const isIndexPage = document.body.querySelector("#product-list") !== null;
const isCartPage = document.body.querySelector("#cart-items") !== null;

function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl) return;
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountEl.textContent = count;
}

function showNotification(message, success = true) {
  const notif = document.createElement("div");
  notif.textContent = message;
  notif.style.position = "fixed";
  notif.style.top = "50%";
  notif.style.left = "50%";
  notif.style.transform = "translate(-50%, -50%)";
  notif.style.backgroundColor = success ? "#4caf50" : "#f44336";
  notif.style.color = "white";
  notif.style.padding = "15px 25px";
  notif.style.borderRadius = "8px";
  notif.style.zIndex = 1000;
  notif.style.fontSize = "1.2em";
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.remove();
  }, success ? 1000 : 2000);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Hiển thị sản phẩm index.html
function displayProducts(category = "all") {
  if (!isIndexPage) return;
  const productListEl = document.getElementById("product-list");
  let filtered = category === "all" ? products : products.filter(p => p.category === category);
  productListEl.innerHTML = "";
  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <div class="product-name" onclick="viewProduct(${product.id})">${product.name}</div>
      <div class="product-actions">
        <button class="add-cart-btn" onclick="addToCart(${product.id})">Thêm giỏ hàng</button>
        <button class="order-btn" onclick="orderNow(${product.id})">Đặt hàng</button>
      </div>
    `;
    productListEl.appendChild(card);
  });
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  showNotification(`${product.name} đã được thêm vào giỏ hàng`);
}

// Đặt hàng ngay
function orderNow(id) {
  addToCart(id);
  window.location.href = "cart.html";
}

// Xem chi tiết sản phẩm (có thể mở modal hoặc trang riêng, hiện đơn giản alert)
function viewProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  alert(`Tên sản phẩm: ${product.name}\nGiá: ${product.price.toLocaleString()} ₫\n\nChi tiết sẽ cập nhật sau.`);
}

// Xử lý menu lọc sản phẩm
if (isIndexPage) {
  document.querySelectorAll(".menu-item").forEach(btn => {
    btn.addEventListener("click", () => {
      displayProducts(btn.dataset.category);
    });
  });
}

// --------- Cart page functions -----------

function renderCartItems() {
  if (!isCartPage) return;
  const tbody = document.getElementById("cart-items");
  tbody.innerHTML = "";
  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Giỏ hàng trống.</td></tr>`;
    updateCartSummary(0);
    return;
  }
  cart.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        ${item.quantity}
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
      </td>
      <td>${item.price.toLocaleString()}</td>
      <td>${(item.price * item.quantity).toLocaleString()}</td>
      <td><button onclick="removeFromCart(${item.id})">Xóa</button></td>
    `;
    tbody.appendChild(row);
  });
  updateCartSummary();
}

function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCartItems();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCartItems();
}

function updateCartSummary() {
  const shippingFee = 20000;
  const totalPriceEl = document.getElementById("total-price");
  const shippingFeeEl = document.getElementById("shipping-fee");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  shippingFeeEl.textContent = shippingFee.toLocaleString();
  totalPriceEl.textContent = (total + shippingFee).toLocaleString();
}

// Hiển thị form đặt hàng
function showOrderForm() {
  document.getElementById("cart-section").classList.add("hidden");
  document.getElementById("order-form-section").classList.remove("hidden");
}

// Ẩn form đặt hàng
function hideOrderForm() {
  document.getElementById("order-form-section").classList.add("hidden");
  document.getElementById("cart-section").classList.remove("hidden");
}

// Gửi đơn hàng lên Telegram
async function sendOrderTelegram(data) {
  const BOT_TOKEN = "7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8";
  const CHAT_ID = "944976544";

  let productListText = data.products
    .map(p => `- ${p.name} x ${p.quantity}`)
    .join("\n");

  let time = new Date().toLocaleTimeString("vi-VN", { hour12: false });
  let date = new Date().toLocaleDateString("vi-VN");

  let message = `
🛒 ĐƠN HÀNG MỚI:
👤 Tên: ${data.name}
📞 SĐT: ${data.phone}
🏠 Địa chỉ: ${data.address}

📦 Sản phẩm:
${productListText}

thời gian: ${time} - ${date}
🚚 Phí ship: 20,000₫
💰 Tổng cộng: ${data.total.toLocaleString()} đ
  `;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message.trim(),
      }),
    });
    let result = await response.json();
    return result.ok;
  } catch (e) {
    return false;
  }
}

// Xử lý form đặt hàng submit
function setupOrderForm() {
  if (!isCartPage) return;

  const form = document.getElementById("order-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0) + 20000;

    const data = { name, phone, address, products: cart, total };

    const success = await sendOrderTelegram(data);
    if (success) {
      showNotification("Đặt hàng thành công!");
      cart = [];
      saveCart();
      renderCartItems();
      form.reset();
      hideOrderForm();
    } else {
      showNotification("Đặt hàng không thành công!", false);
    }
  });

  document.getElementById("btn-order").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }
    showOrderForm();
  });

  document.getElementById("btn-cancel").addEventListener("click", () => {
    hideOrderForm();
  });
}

function init() {
  updateCartCount();
  if (isIndexPage) {
    displayProducts();
  }
  if (isCartPage) {
    renderCartItems();
    setupOrderForm();
  }
}

init();

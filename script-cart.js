// Config Telegram Bot API
const TELEGRAM_BOT_TOKEN = "7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8";
const TELEGRAM_CHAT_ID = "7774024453";

const SHIPPING_FEE = 20000;
const FREE_SHIP_MIN = 200000;

// DOM
const cartContainer = document.getElementById("cart-container");
const btnBack = document.getElementById("btn-back");
const btnCheckout = document.getElementById("btn-checkout");
const shippingFeeEl = document.getElementById("shipping-fee");
const checkoutModal = document.getElementById("checkout-modal");
const orderForm = document.getElementById("order-form");
const btnCancel = document.getElementById("btn-cancel");

// --- Load giỏ hàng từ localStorage ---
let cart = {};
function loadCart() {
  const data = localStorage.getItem("cart");
  cart = data ? JSON.parse(data) : {};
}

// --- Lưu giỏ hàng ---
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Tìm sản phẩm theo id ---
function findProductById(id) {
  // Cần copy productsData từ script.js hoặc tạo 1 file js dùng chung.
  // Để demo tạm dùng fetch từ localStorage hoặc một api giả định.
  // Ở đây bạn có thể copy lại productsData từ script.js.
  if (!window.productsData) return null;
  for (const catKey in window.productsData) {
    for (const subKey in window.productsData[catKey]) {
      const prod = window.productsData[catKey][subKey].find((p) => p.id === id);
      if (prod) return prod;
    }
  }
  return null;
}

// --- Format tiền ---
function formatCurrency(num) {
  return num.toLocaleString("vi-VN") + " đ";
}

// --- Tính tổng tiền giỏ hàng ---
function calculateTotal() {
  let total = 0;
  for (const id in cart) {
    const prod = findProductById(id);
    if (prod) {
      total += prod.price * cart[id];
    }
  }
  return total;
}

// --- Hiển thị giỏ hàng ---
function renderCart() {
  if (!cart || Object.keys(cart).length === 0) {
    cartContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
    shippingFeeEl.textContent = "0 đ";
    btnCheckout.disabled = true;
    return;
  }
  btnCheckout.disabled = false;

  let html = `<table class="cart-table">
    <thead>
      <tr>
        <th>Tên sản phẩm</th>
        <th>Số lượng</th>
        <th>Giá</th>
        <th>Thành tiền</th>
        <th>Xóa</th>
      </tr>
    </thead>
    <tbody>`;

  for (const id in cart) {
    const prod = findProductById(id);
    if (!prod) continue;
    const qty = cart[id];
    const lineTotal = prod.price * qty;
    html += `
      <tr data-id="${id}">
        <td>${prod.name}</td>
        <td><input type="number" min="1" value="${qty}" class="qty-input" /></td>
        <td>${formatCurrency(prod.price)}</td>
        <td>${formatCurrency(lineTotal)}</td>
        <td><button class="btn-remove">Xóa</button></td>
      </tr>
    `;
  }

  html += `</tbody></table>`;

  const total = calculateTotal();
  const shipFee = total >= FREE_SHIP_MIN ? 0 : SHIPPING_FEE;
  shippingFeeEl.textContent = formatCurrency(shipFee);

  html += `
    <div class="cart-summary">
      <strong>Tổng cộng:</strong> ${formatCurrency(total + shipFee)}
    </div>
  `;

  cartContainer.innerHTML = html;

  // Gán sự kiện update số lượng
  cartContainer.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const tr = e.target.closest("tr");
      const id = tr.dataset.id;
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      cart[id] = val;
      saveCart();
      renderCart();
    });
  });

  // Xóa sản phẩm
  cartContainer.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tr = e.target.closest("tr");
      const id = tr.dataset.id;
      delete cart[id];
      saveCart();
      renderCart();
    });
  });
}

// --- Xử lý nút trở về ---
btnBack.addEventListener("click", () => {
  window.location.href = "index.html";
});

// --- Mở modal đặt hàng ---
btnCheckout.addEventListener("click", () => {
  checkoutModal.classList.remove("hidden");
});

// --- Đóng modal ---
btnCancel.addEventListener("click", () => {
  checkoutModal.classList.add("hidden");
});

// --- Gửi đơn hàng lên Telegram Bot ---
async function sendOrderToTelegram(orderData) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const text = buildOrderMessage(orderData);

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: "HTML",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return false;
  }
}

// --- Tạo mã đơn hàng ---
function generateOrderCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const numbers = Math.floor(Math.random() * 1e7)
    .toString()
    .padStart(7, "0");
  return code + numbers;
}

// --- Xây dựng nội dung tin nhắn ---
function buildOrderMessage({ name, phone, address, products, shipFee, total }) {
  const orderCode = generateOrderCode();
  const now = new Date();
  const timeStr = now.toLocaleTimeString("vi-VN");
  const dateStr = now.toLocaleDateString("vi-VN");

  let productLines = "";
  products.forEach(({ name, qty }) => {
    productLines += `- ${name} x ${qty}\n`;
  });

  return `<b>📦 ĐƠN HÀNG MỚI: ${orderCode}</b>
🕒 Thời gian: ${timeStr} - ${dateStr}
👤 Tên: ${name}
📞 SĐT: ${phone}
🏠 Địa chỉ: ${address}

🛒 Sản phẩm:
${productLines}
🚚 Phí ship: ${formatCurrency(shipFee)}
💰 Tổng cộng: ${formatCurrency(total)}
`;
}

// --- Xử lý submit form đặt hàng ---
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = orderForm.customerName.value.trim();
  const phone = orderForm.customerPhone.value.trim();
  const address = orderForm.customerAddress.value.trim();

  if (!name || !phone || !address) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  const products = [];
  for (const id in cart) {
    const prod = findProductById(id);
    if (prod) {
      products.push({ name: prod.name, qty: cart[id] });
    }
  }
  const totalProductPrice = calculateTotal();
  const shipFee = totalProductPrice >= FREE_SHIP_MIN ? 0 : SHIPPING_FEE;
  const total = totalProductPrice + shipFee;

  btnCheckout.disabled = true;
  btnCancel.disabled = true;

  const success = await sendOrderToTelegram({
    name,
    phone,
    address,
    products,
    shipFee,
    total,
  });

  if (success) {
    alert("Đặt hàng thành công!");
    cart = {};
    saveCart();
    renderCart();
    checkoutModal.classList.add("hidden");
  } else {
    alert("Đặt hàng thất bại. Vui lòng thử lại.");
  }

  btnCheckout.disabled = false;
  btnCancel.disabled = false;
});

// --- Khởi tạo ---
function init() {
  // Để dùng chung productsData từ script.js bạn có thể load nó ở đây hoặc copy vào cart script.
  // Dưới đây là một ví dụ giả định đã có productsData gán vào window.productsData:
  // window.productsData = { ... };

  loadCart();
  renderCart();
}

init();

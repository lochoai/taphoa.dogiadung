// Dữ liệu mẫu sản phẩm
const products = {
  "tap-hoa": {
    "mặt hàng": [
      { name: "Nước mắm Nam Ngư", price: 20000, image: "images/nuocmam.jpg" },
      { name: "Coca-Cola", price: 10000, image: "images/coca.jpg" },
    ],
    "gia vị": [],
    "bánh kẹo": [],
    "đồ uống": [],
    "gội rửa": [],
    "thuốc lá": [],
    "đồ khô": []
  },
  "gia-dung": {
    "mặt hàng": [
      { name: "Nồi cơm điện Sunhouse", price: 500000, image: "images/noicom.jpg" }
    ],
    "đồ điện": [],
    "đồ bếp": [],
    "chén bát": [],
    "gia dụng": []
  }
};

let currentCategory = "tap-hoa";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Hiển thị các danh mục phụ
function selectCategory(category) {
  currentCategory = category;
  const sub = Object.keys(products[category]);
  const subContainer = document.getElementById("sub-categories");
  subContainer.innerHTML = "";
  sub.forEach(key => {
    const btn = document.createElement("button");
    btn.textContent = key.toUpperCase();
    btn.onclick = () => renderProducts(products[category][key]);
    subContainer.appendChild(btn);
  });
  renderProducts(products[category]["mặt hàng"]);
}

// Hiển thị sản phẩm
function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}"/>
      <h4>${item.name}</h4>
      <p>${item.price.toLocaleString()} đ</p>
      <div class="actions">
        <button onclick='addToCart("${item.name}", ${item.price})'>Thêm</button>
        <button onclick="goToCart()">Mua</button>
      </div>`;
    container.appendChild(div);
  });
}

function addToCart(name, price) {
  const index = cart.findIndex(item => item.name === name);
  if (index >= 0) {
    cart[index].qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alertCenter(`${name} đã thêm vào giỏ hàng!`);
}

function goToCart() {
  window.location.href = "cart.html";
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

function alertCenter(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.style.position = "fixed";
  div.style.top = "50%";
  div.style.left = "50%";
  div.style.transform = "translate(-50%, -50%)";
  div.style.background = "#d4ffd4";
  div.style.padding = "1em";
  div.style.border = "1px solid #000";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1000);
}

function goBack() {
  window.history.back();
}

// CART PAGE FUNCTIONS
if (window.location.pathname.includes("cart.html")) {
  const cartItems = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");

  function renderCart() {
    cartItems.innerHTML = "";
    cart.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `<p>${item.name} x ${item.qty} = ${(item.price * item.qty).toLocaleString()} đ</p>`;
      cartItems.appendChild(div);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const ship = total < 200000 ? 20000 : 0;
    summary.innerHTML = `
      <p><strong>Tổng:</strong> ${total.toLocaleString()} đ</p>
      <p><strong>Phí ship:</strong> ${ship.toLocaleString()} đ</p>
      <button onclick="document.getElementById('checkout-form').classList.remove('hidden')">Đặt Hàng</button>`;
  }

  window.cancelCheckout = () => {
    document.getElementById("checkout-form").classList.add("hidden");
  };

  window.submitOrder = () => {
    const name = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    if (!name || !phone || !address) return alert("Vui lòng nhập đầy đủ!");

    const orderId = "LCH" + Math.floor(Math.random() * 1e7);
    const time = new Date();
    const timeStr = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} - ${time.toLocaleDateString("vi-VN")}`;
    const productsText = cart.map(p => `- ${p.name} x ${p.qty}`).join("\n");
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const ship = total < 200000 ? 20000 : 0;
    const full = total + ship;

    const text = `📦 ĐƠN HÀNG MỚI: ${orderId}
🕒thời gian: ${timeStr}
👤 Tên: ${name}
📞 SĐT: ${phone}
🏠 Địa chỉ: ${address}

🛒 Sản phẩm:
${productsText}

🚚 Phí ship: ${ship.toLocaleString()}₫
💰 Tổng cộng: ${full.toLocaleString()} đ`;

    fetch(`https://api.telegram.org/bot7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "7774024453",
        text
      })
    }).then(res => {
      if (res.ok) {
        alertCenter("Đặt hàng thành công!");
        cart = [];
        localStorage.removeItem("cart");
        setTimeout(() => window.location.href = "index.html", 2000);
      } else {
        alertCenter("Đặt hàng thất bại!");
      }
    });
  };

  renderCart();
} else {
  updateCartCount();
  selectCategory("tap-hoa");
}

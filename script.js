// Danh mục sản phẩm
const products = [
  // TẠP HÓA
  {
    id: "th1",
    name: "Nước mắm Nam Ngư",
    price: 32000,
    category: "tap-hoa",
    subcategory: "gia-vi",
    img: "images/nuoc-mam-nam-ngu.png",
    desc: "Nước mắm Nam Ngư đậm đà, chai 500ml"
  },
  {
    id: "th2",
    name: "Coca-Cola Lon",
    price: 9000,
    category: "tap-hoa",
    subcategory: "do-uong",
    img: "images/coca.jpg",
    desc: "Nước ngọt Coca lon 330ml mát lạnh"
  },
  {
    id: "th3",
    name: "Bánh quy Oreo",
    price: 15000,
    category: "tap-hoa",
    subcategory: "banh-keo",
    img: "images/oreo.jpg",
    desc: "Bánh quy socola kem sữa"
  },
  {
    id: "th4",
    name: "Thuốc lá Vinataba",
    price: 22000,
    category: "tap-hoa",
    subcategory: "thuoc-la",
    img: "images/vinataba.jpg",
    desc: "Thuốc lá Việt chính hãng"
  },

  // GIA DỤNG
  {
    id: "gd1",
    name: "Nồi cơm điện Sunhouse",
    price: 550000,
    category: "gia-dung",
    subcategory: "do-dien",
    img: "images/noicom.jpg",
    desc: "Nồi cơm điện Sunhouse 1.8L"
  },
  {
    id: "gd2",
    name: "Bếp hồng ngoại",
    price: 690000,
    category: "gia-dung",
    subcategory: "do-bep",
    img: "images/bephongngoai.jpg",
    desc: "Bếp hồng ngoại tiện dụng"
  },
  {
    id: "gd3",
    name: "Bộ chén sứ Minh Long",
    price: 350000,
    category: "gia-dung",
    subcategory: "chen-bat",
    img: "images/chenbat.jpg",
    desc: "Bộ chén sứ 10 món cao cấp"
  },
  {
    id: "gd4",
    name: "Kệ inox nhà bếp",
    price: 270000,
    category: "gia-dung",
    subcategory: "gia-dung",
    img: "images/keinox.jpg",
    desc: "Kệ inox đa năng 3 tầng"
  }
];

// Subcategories
const subCategories = {
  "tap-hoa": [
    { key: "mat-hang", label: "Mặt hàng" },
    { key: "gia-vi", label: "Gia vị" },
    { key: "banh-keo", label: "Bánh kẹo" },
    { key: "do-uong", label: "Đồ uống" },
    { key: "goi-rua", label: "Gội rửa" },
    { key: "thuoc-la", label: "Thuốc lá" },
    { key: "do-kho", label: "Đồ khô" }
  ],
  "gia-dung": [
    { key: "mat-hang", label: "Mặt hàng" },
    { key: "do-dien", label: "Đồ điện" },
    { key: "do-bep", label: "Đồ bếp" },
    { key: "chen-bat", label: "Chén bát" },
    { key: "gia-dung", label: "Gia dụng" }
  ]
};

let currentCategory = "tap-hoa";
let currentModalProduct = null;

function selectCategory(category) {
  currentCategory = category;
  renderSubCategories(category);
  renderProducts(category, "mat-hang");
}

function renderSubCategories(category) {
  const container = document.getElementById("sub-categories");
  container.innerHTML = "";
  subCategories[category].forEach(sub => {
    const btn = document.createElement("button");
    btn.innerText = sub.label;
    btn.onclick = () => renderProducts(category, sub.key);
    container.appendChild(btn);
  });
}

function renderProducts(category, sub) {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";

  const filtered = products.filter(p => {
    return p.category === category && (sub === "mat-hang" || p.subcategory === sub);
  });

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}" onclick="showModal('${p.id}')">
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()}₫</p>
      <div class="actions">
        <button onclick="addToCart('${p.id}')">Thêm vào giỏ</button>
        <button onclick="buyNow('${p.id}')">Mua ngay</button>
      </div>
    `;
    container.appendChild(div);
  });
}
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === id);
  if (index >= 0) {
    cart[index].quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  saveCart(cart); // lưu lại vào localStorage
  showNotification(`🛒 Đã thêm vào giỏ: ${getProduct(id)?.name || id}`);
}

function buyNow(id) {
  addToCart(id);
  window.location.href = "cart.html";
}

function showNotification(msg) {
  const noti = document.getElementById("notification");
  if (!noti) return;
  noti.innerText = msg;
  noti.classList.remove("hidden");
  setTimeout(() => {
    noti.classList.add("hidden");
  }, 1000);
}

function getProduct(id) {
  return products.find(p => p.id === id);
}

function showModal(id) {
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("product-modal-content");
  if (!modal || !modalContent) return;

  const p = getProduct(id);
  currentModalProduct = p;

  modalContent.innerHTML = `
    <button class="close-btn" onclick="hideModal()">❌</button>
    <img src="${p.img}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p><strong>${p.price.toLocaleString()}₫</strong></p>
    <p>${p.desc}</p>
    <div class="actions">
      <button onclick="addToCart('${p.id}')">Thêm vào giỏ</button>
      <button onclick="buyNow('${p.id}')">Mua ngay</button>
    </div>
  `;
  modal.classList.remove("hidden");
}

function hideModal() {
  const modal = document.getElementById("product-modal");
  if (modal) modal.classList.add("hidden");
}

// Cart page
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = "<p>Giỏ hàng trống</p>";
    return;
  }

  let total = 0;
  container.innerHTML = "";
  cart.forEach(item => {
    const product = getProduct(item.id);
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <p><strong>${product.name}</strong> x ${item.quantity}</p>
      <p>Giá: ${itemTotal.toLocaleString()}₫</p>
    `;
    container.appendChild(div);
  });

  // Phí ship
  const shippingFee = total >= 200000 ? 0 : 20000;
  document.getElementById("shipping-fee").innerText = shippingFee.toLocaleString() + "₫";
  document.getElementById("total-amount").innerText = (total + shippingFee).toLocaleString() + "₫";
}
// Gửi đơn hàng về Telegram
async function submitOrder() {
  const name = document.getElementById("order-name").value.trim();
  const phone = document.getElementById("order-phone").value.trim();
  const address = document.getElementById("order-address").value.trim();

  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.");
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    alert("Giỏ hàng trống.");
    return;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  const dateStr = now.toLocaleDateString('vi-VN');
  const orderCode = generateOrderCode();

  let text = `📦 ĐƠN HÀNG MỚI: ${orderCode}\n`;
  text += `🕒Thời gian: ${timeStr} - ${dateStr}\n`;
  text += `👤 Tên: ${name}\n`;
  text += `📞 SĐT: ${phone}\n`;
  text += `🏠 Địa chỉ: ${address}\n\n`;
  text += `🛒 Sản phẩm:\n`;

  let total = 0;
  cart.forEach(item => {
    const p = getProduct(item.id);
    const itemTotal = p.price * item.quantity;
    total += itemTotal;
    text += `- ${p.name} x ${item.quantity}\n`;
  });

  const shipping = total >= 200000 ? 0 : 20000;
  const grandTotal = total + shipping;

  text += `\n🚚 Phí ship: ${shipping.toLocaleString()}₫`;
  text += `\n💰 Tổng cộng: ${grandTotal.toLocaleString()} đ`;

  const token = "7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8";
  const chat_id = "7774024453";
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id,
        text
      })
    });

    if (res.ok) {
      showNotification("✅ Đặt hàng thành công!");
      localStorage.removeItem("cart");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      alert("Lỗi gửi đơn hàng. Vui lòng thử lại.");
    }
  } catch (err) {
    console.error(err);
    alert("Đã xảy ra lỗi khi gửi đơn hàng.");
  }
}

// Tạo mã đơn hàng (3 chữ cái + 7 số)
function generateOrderCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letters = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const numbers = Math.floor(1000000 + Math.random() * 9000000);
  return `${letters}${numbers}`;
}

// Hiển thị form đặt hàng
function showOrderForm() {
  const form = document.getElementById("order-form");
  if (form) form.classList.remove("hidden");
}

// Ẩn form đặt hàng
function hideOrderForm() {
  const form = document.getElementById("order-form");
  if (form) form.classList.add("hidden");
}

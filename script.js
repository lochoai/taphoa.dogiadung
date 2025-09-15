// ========== CẤU HÌNH TELEGRAM ==========
const BOT_TOKEN = '7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8';
const CHAT_ID = '7774024453';

// ========== DỮ LIỆU GIẢ MẪU ==========
const PRODUCTS = {
  'tap-hoa': {
    'Mặt hàng': ['Bánh quy Oreo', 'Coca-Cola', 'Nước mắm Nam Ngư'],
    'Gia vị': ['Muối', 'Đường', 'Hạt nêm'],
    'Bánh kẹo': ['Kẹo dẻo', 'Bánh Choco Pie'],
    'Đồ uống': ['Pepsi', 'Trà xanh 0 độ'],
    'Đồ gội rửa': ['Dầu gội Clear', 'Nước rửa chén'],
    'Thuốc lá': ['Thuốc lá Thăng Long'],
    'Đồ khô': ['Miến dong', 'Mì tôm Hảo Hảo']
  },
  'gia-dung': {
    'Mặt hàng': ['Nồi cơm điện Sunhouse', 'Quạt điện Asia'],
    'Đồ điện': ['Bóng đèn LED', 'Ổ cắm điện'],
    'Đồ bếp': ['Chảo chống dính', 'Dao inox'],
    'Chén bát': ['Bát sứ Minh Long', 'Ly thủy tinh'],
    'Gia dụng': ['Thau nhựa', 'Chổi lau nhà']
  }
};

const PRICES = {
  'Nồi cơm điện Sunhouse': 890000,
  'Quạt điện Asia': 390000,
  'Bóng đèn LED': 25000,
  'Ổ cắm điện': 55000,
  'Chảo chống dính': 120000,
  'Dao inox': 35000,
  'Bát sứ Minh Long': 20000,
  'Ly thủy tinh': 15000,
  'Thau nhựa': 18000,
  'Chổi lau nhà': 80000,
  'Bánh quy Oreo': 18000,
  'Coca-Cola': 12000,
  'Nước mắm Nam Ngư': 35000,
  'Muối': 5000,
  'Đường': 10000,
  'Hạt nêm': 15000,
  'Kẹo dẻo': 8000,
  'Bánh Choco Pie': 20000,
  'Pepsi': 12000,
  'Trà xanh 0 độ': 11000,
  'Dầu gội Clear': 45000,
  'Nước rửa chén': 20000,
  'Thuốc lá Thăng Long': 15000,
  'Miến dong': 18000,
  'Mì tôm Hảo Hảo': 5000
};

let currentCategory = null;
let cart = JSON.parse(localStorage.getItem('cart')) || {};

function showCategory(cat) {
  currentCategory = cat;
  const subcats = PRODUCTS[cat];
  const subEl = document.getElementById('subcategories');
  subEl.innerHTML = '';
  for (let sub in subcats) {
    const el = document.createElement('div');
    el.className = 'subcat';
    el.innerText = sub;
    el.onclick = () => showProducts(cat, sub);
    subEl.appendChild(el);
  }
  showProducts(cat, 'Mặt hàng');
}

function showProducts(cat, sub) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  PRODUCTS[cat][sub].forEach(name => {
    const price = PRICES[name] || 0;
    const product = document.createElement('div');
    product.className = 'product';
    product.innerHTML = `
      <img src="https://via.placeholder.com/150x100?text=${encodeURIComponent(name)}" alt="${name}" />
      <div class="name">${name}</div>
      <div class="price">${price.toLocaleString()} đ</div>
      <button onclick="addToCart('${name}')">🛒</button>
      <button onclick="buyNow('${name}')">⚡</button>
    `;
    container.appendChild(product);
  });
}

function addToCart(name) {
  if (cart[name]) cart[name]++;
  else cart[name] = 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  showToast(`Đã thêm ${name} vào giỏ`);
}

function buyNow(name) {
  addToCart(name);
  showCart();
}

function toggleCart() {
  const el = document.getElementById('cart');
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
  renderCart();
}

function showCart() {
  document.getElementById('cart').style.display = 'block';
  renderCart();
}

function hideCart() {
  document.getElementById('cart').style.display = 'none';
}

function renderCart() {
  const items = document.getElementById('cart-items');
  items.innerHTML = '';
  let total = 0;
  for (let name in cart) {
    const price = PRICES[name] || 0;
    const qty = cart[name];
    total += price * qty;
    const row = document.createElement('tr');
    row.innerHTML = `<td>${name}</td><td>x ${qty}</td><td>${(price * qty).toLocaleString()} đ</td>`;
    items.appendChild(row);
  }
  document.getElementById('cart-total').innerText = total.toLocaleString();
  document.getElementById('shipping-fee').innerText = total >= 200000 ? '0' : '20,000';
}

function checkout() {
  document.getElementById('checkout-form').classList.remove('hidden');
}

function closeForm() {
  document.getElementById('checkout-form').classList.add('hidden');
}

function generateOrderCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letters = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const numbers = Math.floor(1000000 + Math.random() * 8999999);
  return letters + numbers;
}

function submitOrder() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();

  if (!name || !phone || !address) {
    showToast('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN') + ' - ' + now.toLocaleDateString('vi-VN');
  const orderCode = generateOrderCode();
  let message = `📦 ĐƠN HÀNG MỚI:\n🕒thời gian: ${timeStr}\n👤 Tên: ${name}\n📞 SĐT: ${phone}\n🏠 Địa chỉ: ${address}\n\n🛒 Sản phẩm:\n`;

  let total = 0;
  for (let name in cart) {
    const qty = cart[name];
    const price = PRICES[name] || 0;
    total += qty * price;
    message += `- ${name} x ${qty}\n`;
  }

  const shipping = total >= 200000 ? 0 : 20000;
  message += `\n🚚 Phí ship: ${shipping.toLocaleString()}₫`;
  message += `\n💰 Tổng cộng: ${(total + shipping).toLocaleString()} đ`;
  message += `\n🔖 Mã đơn hàng: ${orderCode}`;

  // Gửi đến Telegram
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message
    })
  }).then(res => {
    if (res.ok) {
      showToast('🟢 Đặt hàng thành công!');
      cart = {};
      localStorage.removeItem('cart');
      hideCart();
      closeForm();
      showCategory(currentCategory);
    } else {
      showToast('🔴 Đặt hàng không thành công!');
    }
  });
}

function showToast(text) {
  const toast = document.getElementById('toast');
  toast.innerText = text;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2000);
}

// Hiển thị mặc định
showCategory('tap-hoa');

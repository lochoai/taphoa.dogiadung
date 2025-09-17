// Thông số bot và chat
const BOT_TOKEN = '7986532916:AAGPbxtqJHILVuHBYh0fwsKU62a4jEJ8Jp8';
const CHAT_ID = '7774024453';

// Dữ liệu mẫu sản phẩm
const PRODUCTS = {
  'tap-hoa': [
    { id: 'nm_nuoc_mam', name: 'Nước mắm Nam Ngư', price: 30000, image: 'images/nuoc-mam.jpg' },
    { id: 'banh_oreo', name: 'Bánh quy Oreo', price: 25000, image: 'images/oreo.jpg' },
    // thêm sản phẩm khác...
  ],
  'gia-dung': [
    { id: 'noi_com_dien_sunhouse', name: 'Nồi cơm điện Sunhouse', price: 1500000, image: 'images/noi-com.jpg' },
    // thêm sản phẩm khác...
  ]
};

let currentCategory = 'tap-hoa';
let currentSub = 'all';
let cart = {};

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  renderCategoryButtons();
  renderSubcategories();
  renderProducts();
  setupCartIcon();
});

// Load giỏ hàng từ localStorage nếu có
function loadCartFromStorage() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = {};
    }
  }
}

// Lưu giỏ hàng
function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Giao diện menu category
function renderCategoryButtons() {
  const btns = document.querySelectorAll('.category-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      currentSub = 'all';
      renderSubcategories();
      renderProducts();
    });
  });
  // mặc định active
  document.querySelector(`.category-btn[data-category="${currentCategory}"]`).classList.add('active');
}

// Giao diện subcategories dựa vào category
function renderSubcategories() {
  const subEl = document.getElementById('subcategories');
  subEl.innerHTML = '';
  const subs = currentCategory === 'tap-hoa'
    ? ['all', 'gia vị', 'bánh kẹo', 'đồ uống', 'đồ gội rửa', 'thuốc lá', 'đồ khô']
    : ['all', 'đồ điện', 'đồ bếp', 'chén bát', 'gia dụng'];
  subs.forEach(sub => {
    const btn = document.createElement('button');
    btn.textContent = sub.charAt(0).toUpperCase() + sub.slice(1);
    btn.classList.add('sub-btn');
    btn.dataset.sub = sub;
    btn.addEventListener('click', () => {
      currentSub = sub;
      // add active style
      document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
    subEl.append(btn);
  });
  // mặc định chọn all
  const first = subEl.querySelector('button');
  if (first) first.classList.add('active');
}

// Hiển thị sản phẩm
function renderProducts() {
  const prodEl = document.getElementById('products');
  prodEl.innerHTML = '';
  const list = PRODUCTS[currentCategory] || [];
  list.forEach(p => {
    // nếu currentSub != 'all' thì lọc
    if (currentSub !== 'all' && p.name.toLowerCase().indexOf(currentSub) === -1) {
      // đơn giản: tên có chứa từ sub mới hiển thị
      return;
    }
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${p.image || ''}" alt="${p.name}">
      <div class="product-name">${p.name}</div>
      <div class="product-price">${formatPrice(p.price)}</div>
      <div class="actions">
        <button class="add-cart-btn" data-id="${p.id}">Thêm giỏ hàng</button>
        <button class="buy-now-btn" data-id="${p.id}">Mua ngay</button>
      </div>
    `;
    // event
    const btnAdd = card.querySelector('.add-cart-btn');
    btnAdd.addEventListener('click', () => {
      addToCart(p.id, 1);
      showNotification(`${p.name} đã được thêm vào giỏ hàng`);
    });
    const btnBuy = card.querySelector('.buy-now-btn');
    btnBuy.addEventListener('click', () => {
      addToCart(p.id, 1);
      // redirect tới giỏ hàng
      window.location.href = 'cart.html';
    });
    prodEl.append(card);
  });
}

// Hàm format giá
function formatPrice(num) {
  return new Intl.NumberFormat('vi-VN').format(num) + '₫';
}

// Thêm sản phẩm vào giỏ
function addToCart(id, qty) {
  if (!cart[id]) cart[id] = 0;
  cart[id] += qty;
  saveCartToStorage();
}

// Setup icon giỏ hàng (có thể hiển thị số lượng nếu muốn)
function setupCartIcon() {
  const cartIcon = document.querySelector('.cart-icon');
  cartIcon.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
}

// ---- CART PAGE ----

if (window.location.pathname.endsWith('cart.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    renderCartTable();
    document.getElementById('back-btn').addEventListener('click', () => {
      window.history.back();
    });
    document.getElementById('back-to-shop').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
    document.getElementById('checkout-btn').addEventListener('click', () => {
      openCheckoutModal();
    });
    document.getElementById('cancel-checkout').addEventListener('click', () => {
      closeCheckoutModal();
    });
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const address = form.address.value.trim();
      if (!name || !phone || !address) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }
      sendOrder(name, phone, address);
    });
  });
}

function renderCartTable() {
  const tbody = document.querySelector('#cart-table tbody');
  tbody.innerHTML = '';
  let total = 0;
  for (const id in cart) {
    const product = findProductById(id);
    if (!product) continue;
    const qty = cart[id];
    const linePrice = product.price * qty;
    total += linePrice;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td><input type="number" min="1" value="${qty}" data-id="${id}" class="qty-input"></td>
      <td>${formatPrice(product.price)}</td>
      <td>${formatPrice(linePrice)}</td>
      <td><button class="remove-btn" data-id="${id}">X</button></td>
    `;
    tbody.append(tr);
  }
  document.getElementById('total-price').textContent = formatPrice(total);
  const shipping = (total > 0 && total < 199999) ? 20000 : 0;
  document.getElementById('shipping-fee').textContent = formatPrice(shipping);
  saveCartToStorage();
  // event listeners cho qty và remove
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', () => {
      const id = input.dataset.id;
      const newQty = parseInt(input.value);
      if (newQty <= 0) {
        delete cart[id];
      } else {
        cart[id] = newQty;
      }
      renderCartTable();
    });
  });
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      delete cart[id];
      renderCartTable();
    });
  });
}

function openCheckoutModal() {
  document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

function clearCart() {
  cart = {};
  saveCartToStorage();
}

function sendOrder(name, phone, address) {
  // Tạo mã đơn hàng: 3 chữ cái in hoa + 7 số
  const code = randomOrderCode();
  const now = new Date();
  const timeString = now.toLocaleTimeString('vi-VN');
  const dateString = now.toLocaleDateString('vi-VN');
  // Tạo nội dung đơn hàng
  let message = `📦 ĐƠN HÀNG MỚI: ${code}\n🕒 Thời gian: ${timeString} - ${dateString}\n👤 Tên: ${name}\n📞 SĐT: ${phone}\n🏠 Địa chỉ: ${address}\n\n🛒 Sản phẩm:\n`;
  for (const id in cart) {
    const product = findProductById(id);
    if (!product) continue;
    message += `- ${product.name} x ${cart[id]}\n`;
  }
  const total = Object.keys(cart).reduce((sum, id) => {
    const p = findProductById(id);
    return sum + (p.price * (cart[id] || 0));
  }, 0);
  const shippingFee = (total > 0 && total < 199999) ? 20000 : 0;
  const totalWithShip = total + shippingFee;
  message += `\n🚚 Phí ship: ${shippingFee}₫\n💰 Tổng cộng: ${totalWithShip}₫`;

  // Gửi tới Telegram
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message
    })
  })
  .then(resp => resp.json())
  .then(data => {
    if (data.ok) {
      showNotification('Đặt hàng thành công!');
      clearCart();
      closeCheckoutModal();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      showNotification('Đặt hàng không thành công!');
    }
  })
  .catch(err => {
    console.error('Error sending order', err);
    showNotification('Lỗi mạng, vui lòng thử lại sau');
  });
}

function randomOrderCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const nums = Math.floor(Math.random() * 9000000) + 1000000;
  return result + nums;
}

function showNotification(text) {
  const notif = document.getElementById('notification');
  notif.textContent = text;
  notif.classList.remove('hidden');
  setTimeout(() => {
    notif.classList.add('hidden');
  }, 1000); // 1 giây
}

function findProductById(id) {
  for (const cat in PRODUCTS) {
    for (const p of PRODUCTS[cat]) {
      if (p.id === id) return p;
    }
  }
  return null;
}

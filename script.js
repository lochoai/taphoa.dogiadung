// Dữ liệu mẫu sản phẩm (bạn có thể thêm/xóa, sửa)
const products = {
  taphoa: [
    { id: 'tp1', name: 'Nước mắm Nam Ngư', category: 'tatca', price: 30000, img: 'images/nuocmam.jpg', desc: 'Nước mắm truyền thống thơm ngon' },
    { id: 'tp2', name: 'Bánh quy Oreo', category: 'banhkeo', price: 40000, img: 'images/oreo.jpg', desc: 'Bánh quy Oreo ngon ngọt' },
    { id: 'tp3', name: 'Coca-Cola', category: 'douong', price: 15000, img: 'images/coca.jpg', desc: 'Nước ngọt Coca-Cola 500ml' },
    { id: 'tp4', name: 'Gia vị hạt nêm', category: 'giavi', price: 20000, img: 'images/giavi.jpg', desc: 'Gia vị hạt nêm tự nhiên' },
    { id: 'tp5', name: 'Dầu gội Head & Shoulders', category: 'dogoirua', price: 65000, img: 'images/daugoi.jpg', desc: 'Dầu gội sạch gàu' },
    { id: 'tp6', name: 'Thuốc lá Marlboro', category: 'thuocla', price: 70000, img: 'images/thuocla.jpg', desc: 'Thuốc lá Marlboro chính hãng' },
    { id: 'tp7', name: 'Đậu phộng rang', category: 'dokho', price: 25000, img: 'images/dauphong.jpg', desc: 'Đậu phộng rang muối' },
  ],
  giadung: [
    { id: 'gd1', name: 'Nồi cơm điện Sunhouse', category: 'tatca', price: 1200000, img: 'images/noicomedien.jpg', desc: 'Nồi cơm điện Sunhouse 1.8L' },
    { id: 'gd2', name: 'Ấm siêu tốc', category: 'dodien', price: 350000, img: 'images/am.jpg', desc: 'Ấm siêu tốc 1.5L' },
    { id: 'gd3', name: 'Bộ nồi inox', category: 'dobep', price: 800000, img: 'images/bonoi.jpg', desc: 'Bộ nồi inox 3 món' },
    { id: 'gd4', name: 'Chén bát sứ', category: 'chenbat', price: 150000, img: 'images/chenbat.jpg', desc: 'Bộ 6 chén bát sứ' },
    { id: 'gd5', name: 'Quạt điện', category: 'giadung', price: 400000, img: 'images/quatdien.jpg', desc: 'Quạt điện để bàn' },
  ],
};

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

// Giỏ hàng lưu localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === product.id);
  if (index >= 0) {
    cart[index].qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showToast(`Đã thêm ${product.name} vào giỏ hàng`);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $('#cart-count').textContent = count;
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1000);
}

// Hiển thị sản phẩm theo danh mục con
function renderProducts(categoryKey, subcatKey, containerId) {
  let items;
  if (subcatKey === 'tatca') {
    items = products[categoryKey];
  } else {
    items = products[categoryKey].filter(p => p.category === subcatKey);
  }
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" class="product-image" />
      <div class="product-name">${product.name}</div>
      <div class="product-price">${product.price.toLocaleString('vi-VN')} ₫</div>
      <div class="product-actions">
        <button class="btn-add">Thêm giỏ</button>
        <button class="btn-buy">Mua ngay</button>
      </div>
    `;

    // Click xem chi tiết
    card.querySelector('.product-image').addEventListener('click', () => openProductDetail(product));
    card.querySelector('.product-name').addEventListener('click', () => openProductDetail(product));
    card.querySelector('.product-price').addEventListener('click', () => openProductDetail(product));

    // Thêm giỏ hàng
    card.querySelector('.btn-add').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product);
    });

    // Mua ngay
    card.querySelector('.btn-buy').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product);
      window.location.href = 'cart.html';
    });

    container.appendChild(card);
  });
}

// Chi tiết sản phẩm popup
function openProductDetail(product) {
  let overlay = document.getElementById('product-detail-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'product-detail-overlay';
    overlay.className = 'product-detail-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="product-detail-content">
      <div class="product-detail-close" title="Đóng">&times;</div>
      <img src="${product.img}" alt="${product.name}" />
      <h2>${product.name}</h2>
      <p><strong>Giá:</strong> ${product.price.toLocaleString('vi-VN')} ₫</p>
      <p>${product.desc}</p>
      <div style="display:flex; gap: 10px; margin-top: 10px;">
        <button id="detail-add" class="btn-add">Thêm giỏ</button>
        <button id="detail-buy" class="btn-buy">Mua ngay</button>
      </div>
    </div>
  `;

  overlay.style.display = 'flex';

  overlay.querySelector('.product-detail-close').addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  overlay.querySelector('#detail-add').addEventListener('click', () => {
    addToCart(product);
  });

  overlay.querySelector('#detail-buy').addEventListener('click', () => {
    addToCart(product);
    window.location.href = 'cart.html';
  });
}

// Xử lý chọn danh mục con
function setupCategorySelection(categoryKey, containerId, subcatsId) {
  const subcatButtons = document.querySelectorAll(`#${subcatsId} .subcat-btn`);
  subcatButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Bỏ active hết
      subcatButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render

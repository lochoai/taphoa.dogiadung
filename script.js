// script.js

// ======== DỮ LIỆU SẢN PHẨM MẪU ========
// Bạn có thể thay bằng API hoặc backend riêng của bạn
const products = [
  // Tạp Hóa
  { id: 1, category: 'Tạp Hóa', subcategory: 'Mặt hàng', name: 'Nước mắm Nam Ngư', price: 45000, img: 'images/nuocmam.jpg' },
  { id: 2, category: 'Tạp Hóa', subcategory: 'Gia vị', name: 'Hạt nêm Ajinomoto', price: 35000, img: 'images/hatnem.jpg' },
  { id: 3, category: 'Tạp Hóa', subcategory: 'Bánh kẹo', name: 'Bánh quy Oreo', price: 28000, img: 'images/oreo.jpg' },
  { id: 4, category: 'Tạp Hóa', subcategory: 'Đồ uống', name: 'Coca-Cola', price: 15000, img: 'images/cocacola.jpg' },
  { id: 5, category: 'Tạp Hóa', subcategory: 'Đồ gội rửa', name: 'Dầu gội Head & Shoulders', price: 120000, img: 'images/daugoi.jpg' },
  { id: 6, category: 'Tạp Hóa', subcategory: 'Thuốc lá', name: 'Thuốc lá Vinataba', price: 50000, img: 'images/thuocla.jpg' },
  { id: 7, category: 'Tạp Hóa', subcategory: 'Đồ khô', name: 'Cá khô', price: 90000, img: 'images/cakho.jpg' },
  // Gia Dụng
  { id: 8, category: 'Gia Dụng', subcategory: 'Mặt hàng', name: 'Nồi cơm điện Sunhouse', price: 1200000, img: 'images/noicomedien.jpg' },
  { id: 9, category: 'Gia Dụng', subcategory: 'Đồ điện', name: 'Quạt cây Panasonic', price: 850000, img: 'images/quat.jpg' },
  { id: 10, category: 'Gia Dụng', subcategory: 'Đồ bếp', name: 'Bộ nồi inox', price: 1100000, img: 'images/noi.jpg' },
  { id: 11, category: 'Gia Dụng', subcategory: 'Chén bát', name: 'Bộ chén bát sứ', price: 450000, img: 'images/chenbat.jpg' },
  { id: 12, category: 'Gia Dụng', subcategory: 'Gia dụng', name: 'Máy xay sinh tố', price: 780000, img: 'images/mayxay.jpg' },
];

// ======== GIỎ HÀNG LƯU LOCALSTORAGE ========
const CART_STORAGE_KEY = 'loc_hoai_cart';

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
}

let cart = loadCart();

// ======== HIỂN THỊ GIỎ HÀNG SỐ LƯỢNG TRÊN ICON HEADER ========
function updateCartIconCount() {
  const cartCountElem = document.querySelector('#cart-count');
  if (cartCountElem) {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElem.textContent = totalCount;
  }
}

// ======== HIỂN THỊ DANH MỤC SẢN PHẨM (index.html) ========
function renderCategories() {
  const tapHoaSubcats = ['Mặt hàng', 'Gia vị', 'Bánh kẹo', 'Đồ uống', 'Đồ gội rửa', 'Thuốc lá', 'Đồ khô'];
  const giaDungSubcats = ['Mặt hàng', 'Đồ điện', 'Đồ bếp', 'Chén bát', 'Gia dụng'];

  // Hiển thị phần danh mục
  const tapHoaSection = document.querySelector('#taphoblock');
  const giaDungSection = document.querySelector('#giadungblock');

  if (!tapHoaSection || !giaDungSection) return;

  // Render subcategories danh mục Tạp Hóa
  const tapHoaSubcatList = document.createElement('div');
  tapHoaSubcatList.classList.add('subcategory-list');
  tapHoaSubcats.forEach(subcat => {
    const subcatElem = document.createElement('div');
    subcatElem.className = 'subcategory-item';
    subcatElem.textContent = subcat;
    subcatElem.dataset.category = 'Tạp Hóa';
    subcatElem.dataset.subcategory = subcat;
    subcatElem.addEventListener('click', () => {
      renderProducts('Tạp Hóa', subcat);
    });
    tapHoaSubcatList.appendChild(subcatElem);
  });
  tapHoaSection.appendChild(tapHoaSubcatList);

  // Render subcategories danh mục Gia Dụng
  const giaDungSubcatList = document.createElement('div');
  giaDungSubcatList.classList.add('subcategory-list');
  giaDungSubcats.forEach(subcat => {
    const subcatElem = document.createElement('div');
    subcatElem.className = 'subcategory-item';
    subcatElem.textContent = subcat;
    subcatElem.dataset.category = 'Gia Dụng';
    subcatElem.dataset.subcategory = subcat;
    subcatElem.addEventListener('click', () => {
      renderProducts('Gia Dụng', subcat);
    });
    giaDungSubcatList.appendChild(subcatElem);
  });
  giaDungSection.appendChild(giaDungSubcatList);

  // Mặc định hiển thị tất cả sản phẩm
  renderProducts();
}

// ======== HIỂN THỊ SẢN PHẨM THEO DANH MỤC (index.html) ========
function renderProducts(category = null, subcategory = null) {
  const productGrid = document.querySelector('#product-grid');
  if (!productGrid) return;

  productGrid.innerHTML = '';

  let filteredProducts = products;
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  if (subcategory) {
    filteredProducts = filteredProducts.filter(p => p.subcategory === subcategory);
  }

  if (filteredProducts.length === 0) {
    productGrid.textContent = 'Không có sản phẩm nào.';
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <div class="product-name">${product.name}</div>
      <div class="product-price">${product.price.toLocaleString('vi-VN')} đ</div>
      <div class="product-actions">
        <button class="add-to-cart">Thêm vào giỏ</button>
        <button class="buy-now">Mua ngay</button>
      </div>
    `;

    // Thêm sự kiện cho nút thêm vào giỏ
    card.querySelector('.add-to-cart').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product.id, 1);
      showAddCartNotification(product.name);
    });

    // Nút mua ngay chuyển sang trang chi tiết
    card.querySelector('.buy-now').addEventListener('click', (e) => {
      e.stopPropagation();
      goToProductDetail(product.id);
    });

    // Click vào card cũng mở trang chi tiết
    card.addEventListener('click', () => {
      goToProductDetail(product.id);
    });

    productGrid.appendChild(card);
  });
}

// ======== CHUYỂN SANG TRANG CHI TIẾT SẢN PHẨM ========
function goToProductDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

// ======== THÊM SẢN PHẨM VÀO GIỎ HÀNG ========
function addToCart(productId, quantity = 1) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  saveCart(cart);
  updateCartIconCount();
}

// ======== HIỂN THỊ THÔNG BÁO ĐÃ THÊM VÀO GIỎ ========
function showAddCartNotification(productName) {
  const notification = document.getElementById('add-cart-notification');
  if (!notification) return;

  notification.textContent = `Đã thêm "${productName}" vào giỏ hàng!`;
  notification.style.opacity = '1';
  notification.style.pointerEvents = 'auto';

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.pointerEvents = 'none';
  }, 1800);
}

// ======== TRANG PRODUCT DETAIL ========
function renderProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));
  const product = products.find(p => p.id === productId);
  if (!product) {
    document.body.innerHTML = '<h2>Sản phẩm không tồn tại</h2>';
    return;
  }

  const container = document.createElement('div');
  container.className = 'product-detail-container';

  container.innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p class="product-detail-info">Giá: ${product.price.toLocaleString('vi-VN')} đ</p>
    <div class="product-detail-actions">
      <button class="add-to-cart">Thêm vào giỏ</button>
      <button class="buy-now">Mua ngay</button>
    </div>
  `;

  document.body.appendChild(container);

  // Thêm nút back góc trên trái
  const backBtn = document.createElement('button');
  backBtn.className = 'back-button';
  backBtn.textContent = '← Quay lại';
  backBtn.addEventListener('click', () => {
    window.history.back();
  });
  document.body.appendChild(backBtn);

  // Bắt sự kiện nút thêm vào giỏ
  container.querySelector('.add-to-cart').addEventListener('click', () => {
    addToCart(product.id, 1);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  });

  // Mua ngay chuyển đến giỏ hàng
  container.querySelector('.buy-now').addEventListener('click', () => {
    addToCart(product.id, 1);
    window.location.href = 'cart.html';
  });
}

// ======== HIỂN THỊ GIỎ HÀNG (cart.html) ========
function renderCart() {
  const cartContainer = document.querySelector('.cart-container');
  if (!cartContainer) return;

  cartContainer.innerHTML = '<h2>Giỏ hàng của bạn</h2>';

  if (cart.length === 0) {
    cartContainer.innerHTML += '<p>Giỏ hàng đang trống.</p>';
    return;
  }

  // Bảng giỏ hàng
  const table = document.createElement('table');
  table.className = 'cart-table';

  table.innerHTML = `
    <thead>
      <tr>
        <th>Ảnh</th>
        <th>Sản phẩm</th>
        <th>Giá (đ)</th>
        <th>Số lượng</th>
        <th>Thành tiền (đ)</th>
        <th>Thao tác</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement('tbody');

  let totalPrice = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td><img src="${product.img}" alt="${product.name}"></td>
      <td>${product.name}</td>
      <td>${product.price.toLocaleString('vi-VN')}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" style="width: 60px;" />
      </td>
      <td>${itemTotal.toLocaleString('vi-VN')}</td>
      <td><button class="remove-btn">Xóa</button></td>
    `;

    // Cập nhật số lượng khi input thay đổi
    const qtyInput = tr.querySelector('input[type="number"]');
    qtyInput.addEventListener('change', (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) {
        val = 1;
        e.target.value = val;
      }
      item.quantity = val;
      saveCart(cart);
      renderCart();
      updateCartIconCount();
    });

    // Xóa sản phẩm khỏi giỏ
    tr.querySelector('.remove-btn').addEventListener('click', () => {
      cart = cart.filter(ci => ci.id !== item.id);
      saveCart(cart);
      renderCart();
      updateCartIconCount();
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  cartContainer.appendChild(table);

  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-total';
  totalDiv.textContent = `Tổng cộng: ${totalPrice.toLocaleString('vi-VN')} đ`;
  cartContainer.appendChild(totalDiv);

  // Nút đặt hàng và trở về
  const btnDiv = document.createElement('div');
  btnDiv.className = 'cart-buttons';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn-back';
  backBtn.textContent = '← Tiếp tục mua hàng';
  backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  const orderBtn = document.createElement('button');
  orderBtn.className = 'btn-order';
  orderBtn.textContent = 'Đặt hàng';
  orderBtn.addEventListener('click', () => {
    openOrderModal();
  });

  btnDiv.appendChild(backBtn);
  btnDiv.appendChild(orderBtn);

  cartContainer.appendChild(btnDiv);
}

// ======== MỞ FORM ĐẶT HÀNG (cart.html) ========
function openOrderModal() {
  const modal = document.getElementById('order-modal');
  if (!modal) return;

  modal.style.display = 'flex';
}

// ======== ĐÓNG FORM ĐẶT HÀNG (cart.html) ========
function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  if (!modal) return;

  modal.style.display = 'none';
}

// ======== XỬ LÝ ĐẶT HÀNG (cart.html) ========
function submitOrder() {
  const nameInput = document.getElementById('customer-name');
  const phoneInput = document.getElementById('customer-phone');
  const addressInput = document.getElementById('customer-address');
  const noteInput = document.getElementById('customer-note');

  if (!nameInput.value.trim() || !phoneInput.value.trim() || !addressInput.value.trim()) {
    alert('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
    return;
  }

  // Ở đây bạn có thể gọi API gửi đơn hàng hoặc xử lý theo nhu cầu
  // Hiện tại mình sẽ giả lập thành công

  closeOrderModal();

  // Xóa giỏ hàng
  cart = [];
  saveCart(cart);
  renderCart();
  updateCartIconCount();

  showOrderResultNotification(true, 'Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
}

// ======== HIỂN THỊ THÔNG BÁO ĐẶT HÀNG ========
function showOrderResultNotification(success, message) {
  const notif = document.getElementById('order-result-notification');
  if (!notif) return;

  notif.textContent = message;
  notif.classList.toggle('error', !success);
  notif.style.opacity = '1';
  notif.style.pointerEvents = 'auto';

  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.pointerEvents = 'none';
  }, 3000);
}

// ======== KHỞI TẠO CHUNG ========
function init() {
  updateCartIconCount();

  // Nếu có phần danh mục sản phẩm (index.html)
  if (document.querySelector('#taphoblock')) {
    renderCategories();
  }

  // Nếu có phần lưới sản phẩm (index.html)
  if (document.querySelector('#product-grid')) {
    renderProducts();
  }

  // Nếu đang ở trang chi tiết sản phẩm
  if (window.location.pathname.includes('product-detail.html')) {
    renderProductDetail();
  }

  // Nếu đang ở trang giỏ hàng
  if (document.querySelector('.cart-container')) {
    renderCart();

    // Thêm sự kiện cho form đặt hàng
    const orderModal = document.getElementById('order-modal');
    if (orderModal) {
      orderModal.querySelector('.btn-cancel').addEventListener('click', closeOrderModal);
      orderModal.querySelector('.btn-submit').addEventListener('click', submitOrder);
    }
  }
}

document.addEventListener('DOMContentLoaded', init);

// Biến lưu giỏ hàng trong localStorage
const CART_KEY = 'lochoai_cart';

// Lấy giỏ hàng từ localStorage
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Thông báo hiện chính giữa màn hình, tự tắt sau 1s
function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.remove();
  }, 1000);
}

// Thêm sản phẩm vào giỏ
function addToCart(product) {
  let cart = getCart();
  // Kiểm tra sản phẩm đã có trong giỏ chưa
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showNotification(`Đã thêm "${product.name}" vào giỏ hàng`);
}

// Hiển thị chi tiết sản phẩm (khi click vào sản phẩm)
function viewProduct(card) {
  // Lấy thông tin từ card
  const name = card.querySelector('h3').textContent;
  const priceText = card.querySelector('.price').textContent;
  const price = parseInt(priceText.replace(/[^\d]/g, ''));
  const imgSrc = card.querySelector('img').src;

  // Tạo overlay hiển thị chi tiết
  const overlay = document.createElement('div');
  overlay.className = 'product-overlay';

  overlay.innerHTML = `
    <div class="product-detail">
      <button class="close-detail">&times;</button>
      <img src="${imgSrc}" alt="${name}" />
      <h2>${name}</h2>
      <p class="price">${priceText}</p>
      <p>Mô tả chi tiết sản phẩm đang cập nhật...</p>
      <div class="product-buttons">
        <button id="detail-add-to-cart">Thêm vào giỏ</button>
        <button id="detail-buy-now">Mua ngay</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('.close-detail').onclick = () => {
    overlay.remove();
  };

  overlay.querySelector('#detail-add-to-cart').onclick = (e) => {
    e.stopPropagation();
    addToCart({ name, price, imgSrc });
  };

  overlay.querySelector('#detail-buy-now').onclick = (e) => {
    e.stopPropagation();
    addToCart({ name, price, imgSrc });
    window.location.href = 'cart.html';
  };
}

// Gán sự kiện cho nút thêm vào giỏ và mua ngay trên index.html
function bindProductButtons() {
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    // Ngăn chặn click trên card trừ nút
    card.onclick = (e) => {
      if (!e.target.classList.contains('add-to-cart') && !e.target.classList.contains('buy-now')) {
        viewProduct(card);
      }
    };

    card.querySelector('.add-to-cart').onclick = (e) => {
      e.stopPropagation();
      const name = card.querySelector('h3').textContent;
      const priceText = card.querySelector('.price').textContent;
      const price = parseInt(priceText.replace(/[^\d]/g, ''));
      const imgSrc = card.querySelector('img').src;
      addToCart({ name, price, imgSrc });
    };

    card.querySelector('.buy-now').onclick = (e) => {
      e.stopPropagation();
      const name = card.querySelector('h3').textContent;
      const priceText = card.querySelector('.price').textContent;
      const price = parseInt(priceText.replace(/[^\d]/g, ''));
      const imgSrc = card.querySelector('img').src;
      addToCart({ name, price, imgSrc });
      window.location.href = 'cart.html';
    };
  });
}

// Khởi tạo khi trang load
window.onload = () => {
  bindProductButtons();
};

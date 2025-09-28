// Dữ liệu sản phẩm mẫu
const products = [
  {id: 1, name: "Nước suối Lavie 500ml", category: "đồ uống", price: 5000, image: "images/nuoc-suoi-lavie.png"},
  {id: 2, name: "Nước tăng lực Redbull", category: "đồ uống", price: 12000, image: "images/nuoc-tang-luc-redbull.png"},
  {id: 3, name: "Mì tôm Hảo Hảo", category: "đồ khô", price: 5000, image: "images/mi-tom-hao-hao.png"},
  {id: 4, name: "Kẹo dẻo Haribo", category: "bánh kẹo", price: 30000, image: "images/keo-deo-haribo.png"},
  {id: 5, name: "Bia Hà Nội", category: "rượu bia", price: 15000, image: "images/bia-ha-noi.png"},
  {id: 6, name: "Dầu gội Clear", category: "gội rửa", price: 70000, image: "images/dau-goi-clear.png"}
];

// Format giá tiền
function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' VND';
}

// Hiển thị sản phẩm trên trang index.html
function renderProducts(category = 'all') {
  const productsEl = document.getElementById('products');
  if (!productsEl) return; 

  productsEl.innerHTML = '';

  let filtered = category === 'all' ? products : products.filter(p => p.category === category);

  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-name">${product.name}</div>
      <div class="product-price">${formatPrice(product.price)}</div>
      <button class="btn-add" data-id="${product.id}">Thêm vào giỏ</button>
    `;

    productsEl.appendChild(div);
  });

  // Thêm sự kiện cho nút thêm vào giỏ hàng
  document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      const product = products.find(p => p.id == productId);
      addToCart(product);
    });
  });
}

// Thêm sản phẩm vào giỏ
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Sản phẩm đã được thêm vào giỏ!');
  renderCart();
}

// Hiển thị giỏ hàng
function renderCart() {
  const cartList = document.getElementById('cart-list');
  const totalPriceEl = document.getElementById('total-price');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartList.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = `<tr><td colspan="5" style="text-align:center;">Giỏ hàng hiện tại trống. Vui lòng thêm sản phẩm!</td></tr>`;
    totalPriceEl.textContent = '0 VND';
    return;
  }

  cart.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}" /></td>
      <td>${formatPrice(item.price)}</td>
      <td>${formatPrice(item.price * item.quantity)}</td>
      <td><button class="btn-remove" data-id="${item.id}">Xóa</button></td>
    `;
    cartList.appendChild(tr);
    total += item.price * item.quantity;
  });

  totalPriceEl.textContent = formatPrice(total);
}

// Cập nhật số lượng và tính lại giỏ
document.addEventListener('change', (e) => {
  if (e.target.classList.contains('quantity-input')) {
    const id = e.target.getAttribute('data-id');
    const quantity = parseInt(e.target.value);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === parseInt(id));
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  }
});

// Xóa sản phẩm khỏi giỏ
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-remove')) {
    const id = e.target.getAttribute('data-id');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id != id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
});

// Gửi đơn hàng (vẫn cần Telegram API để gửi đơn)
document.getElementById('btn-order').addEventListener('click', async () => {
  const fullname = document.getElementById('fullname').value;
  const address = document.getElementById('address').value;
  const phone = document.getElementById('phone').value;

  if (!fullname || !address || !phone) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  let message = `🛒Đơn hàng mới từ cửa hàng LỘC HOÀI\n\nKhách hàng:\nHọ tên: ${fullname}\nĐịa chỉ: ${address}\nSĐT: ${phone}\n\nSản phẩm:\n`;

  cart.forEach(item => {
    message += `${item.name} - ${item.quantity} x ${formatPrice(item.price)}\n`;
  });

  message += `\nTổng tiền: ${formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}`;

  // Gửi đơn hàng qua Telegram API
  const response = await fetch(`https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage`, {
    method: 'POST',
    body: JSON.stringify({
      chat_id: 'YOUR_CHAT_ID',
      text: message
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    alert("Đơn hàng đã được gửi!");
    localStorage.removeItem('cart');
    renderCart();
  } else {
    alert("Lỗi khi gửi đơn hàng!");
  }
});

// Gọi render sản phẩm khi trang tải
renderProducts();

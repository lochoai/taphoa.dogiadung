// Dữ liệu sản phẩm mẫu
const products = [
  {id: 1, name: "Nước suối Lavie 500ml", category: "đồ uống", price: 5000, image:"https://cf.shopee.vn/file/1f5743d8b97a1ca5706868a0c3e9b8d2"},
  {id: 2, name: "Nước tăng lực redbul", category: "đồ uống", price: 12000, image:"https://cf.shopee.vn/file/1f5743d8b97a1ca5706868a0c3e9b8d2"},
  {id: 3, name: "Mì tôm Hảo Hảo", category: "đồ khô", price: 5000, image:"https://product.hstatic.net/200000335103/product/mi_haohao_6a31df2e-6227-4df0-b06b-98b74870e871.png"},
  {id: 4, name: "Kẹo dẻo Haribo", category: "bánh kẹo", price: 30000, image:"https://cdn.lazada.vn/p/8e0e6f6e3e92a0ef775ee5c26d9a8e6a.jpg"},
  {id: 5, name: "Bia Hà Nội", category: "rượu bia", price: 15000, image:"https://cdn.tgdd.vn/Products/Images/3135/207603/bia-ha-noi-vo-330ml-202009261041011626_600x600.jpg"},
  {id: 6, name: "Thuốc lá 555", category: "thuốc lá", price: 120000, image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Cigarettes_LS_Marble.jpg/220px-Cigarettes_LS_Marble.jpg"},
  {id: 7, name: "Dầu gội Clear", category: "gội rửa", price: 70000, image:"https://cdn.tgdd.vn/Products/Images/30688/279002/dau-goi-clear-330ml-202010160857048817_600x600.jpg"},
  {id: 8, name: "Bóng đèn Philips", category: "đồ điện", price: 40000, image:"https://cdn.tgdd.vn/Products/Images/2321/232173/bong-den-led-Philips-5W-2-600x600.jpg"},
  {id: 9, name: "Nồi inox", category: "đồ bếp", price: 300000, image:"https://cdn.tgdd.vn/Products/Images/5161/263327/noi-inox-16cm-sunhouse-sh9948-1-600x600.jpg"},
  {id: 10, name: "Quạt điện Asia", category: "gia dụng", price: 600000, image:"https://cdn.tgdd.vn/Products/Images/7247/271642/quat-dien-asia-1608a-1-600x600.jpg"},
];

// Format giá tiền
function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' VND';
}

// Hiển thị sản phẩm theo danh mục
function renderProducts(category = 'all') {
  const productsEl = document.getElementById('products');
  if (!productsEl) return; // chỉ chạy trên trang index

  productsEl.innerHTML = '';

  let filtered = category === 'all' ? products : products.filter(p => p.category === category);

  // Thay đổi số cột theo danh mục
  if(category === 'all') {
    productsEl.classList.remove('category');
    productsEl.classList.add('home');
  } else {
    productsEl.classList.remove('home');
    productsEl.classList.add('category');
  }

  if(filtered.length === 0) {
    productsEl.innerHTML = '<p>Không có sản phẩm nào trong mục này.</p>';
    return;
  }

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

  // Gán sự kiện nút thêm vào giỏ
  document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.getAttribute('data-id'));
      const product = products.find(p => p.id === id);
      if(product) addToCart(product);
    });
  });

  // Gán sự kiện cho nút danh mục
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.getAttribute('data-category'));
    });
  });
}

// Thêm sản phẩm vào giỏ, lưu localStorage
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Đã thêm ${product.name} vào giỏ hàng!`);
}

// Hiển thị giỏ hàng trên trang cart.html
function renderCart() {
  const cartList = document.getElementById('cart-list');
  const totalPriceEl = document.getElementById('total-price');
  if (!cartList || !totalPriceEl) return; // chỉ chạy trên cart.html

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartList.innerHTML = '';

  if(cart.length === 0) {
    cartList.innerHTML = '<li>Giỏ hàng trống.</li>';
    totalPriceEl.textContent = 'Tổng tiền: 0 VND';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - ${formatPrice(item.price)}
      <button data-index="${index}">Xóa</button>
    `;
    cartList.appendChild(li);
  });

  totalPriceEl.textContent = 'Tổng tiền: ' + formatPrice(total);

  // Xóa sản phẩm khỏi giỏ hàng
  cartList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });
  });
}

// Xử lý đặt hàng (gửi Telegram API)
function handleOrder() {
  const orderForm = document.getElementById('order-form');
  const orderMessage = document.getElementById('order-message');
  const orderSummary = document.getElementById('order-summary');

  if (!orderForm) return; // chỉ chạy trên cart.html

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Kiểm tra giỏ hàng không rỗng
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(cart.length === 0) {
      orderMessage.style.color = 'red';
      orderMessage.textContent = 'Giỏ hàng của bạn đang trống, vui lòng thêm sản phẩm.';
      return;
    }

    // Lấy thông tin form
    const fullname = orderForm.fullname.value.trim();
    const address = orderForm.address.value.trim();
    const phone = orderForm.phone.value.trim();

    if(!fullname || !address || !phone) {
      orderMessage.style.color = 'red';
      orderMessage.textContent = 'Vui lòng điền đầy đủ thông tin đặt hàng.';
      return;
    }

    // Tính tổng giá
    let total = cart.reduce((sum, item) => sum + item.price, 0);

    // Chuẩn bị tin nhắn gửi Telegram
    const BOT_TOKEN = '7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8';
    const CHAT_ID = '7774024453';

    let message = `Đơn hàng mới từ cửa hàng LỘC HOÀI\n\n`;
    message += `Khách hàng:\nHọ tên: ${fullname}\nĐịa chỉ: ${address}\nSĐT: ${phone}\n\n`;
    message += `Sản phẩm:\n`;
    cart.forEach((item, i) => {
      message += `${i+1}. ${item.name} - ${formatPrice(item.price)}\n`;
    });
    message += `\nTổng tiền: ${formatPrice(total)}`;

    // Gửi request đến Telegram API
    try {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const params = {
        chat_id: CHAT_ID,
        text: message
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params)
      });

      const data = await res.json();
      if(data.ok) {
        orderMessage.style.color = 'green';
        orderMessage.textContent = 'Đặt hàng thành công! Cảm ơn bạn.';
        orderForm.reset();
        localStorage.removeItem('cart');
        renderCart();

        // Hiển thị tóm tắt đơn hàng
        orderSummary.style.display = 'block';
        orderSummary.innerHTML = `<h3>Thông tin đơn hàng của bạn:</h3>
          <p><strong>Họ tên:</strong> ${fullname}</p>
          <p><strong>Địa chỉ:</strong> ${address}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          <p><strong>Tổng tiền:</strong> ${formatPrice(total)}</p>
          <p><strong>Sản phẩm:</strong></p>
          <ul>${cart.map(item => `<li>${item.name} - ${formatPrice(item.price)}</li>`).join('')}</ul>
        `;
      } else {
        orderMessage.style.color = 'red';
        orderMessage.textContent = 'Có lỗi khi gửi đơn hàng, vui lòng thử lại.';
      }
    } catch (err) {
      orderMessage.style.color = 'red';
      orderMessage.textContent = 'Có lỗi khi gửi đơn hàng, vui lòng thử lại.';
      console.error(err);
    }
  });
}

// Khởi tạo trang cart và order
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  handleOrder();
});

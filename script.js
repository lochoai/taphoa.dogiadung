// Khởi tạo trang cart và order
document.addEventListener('DOMContentLoaded', () => {
  // Kiểm tra nếu trang là index.html hoặc cart.html
  if (document.getElementById('products')) {
    renderProducts('all'); // Render sản phẩm nếu là trang index
  }

  if (document.getElementById('cart-list')) {
    renderCart(); // Hiển thị giỏ hàng nếu là trang cart
    handleOrder(); // Xử lý đơn hàng
  }
});

// Hàm hiển thị giỏ hàng
function renderCart() {
  const cartList = document.getElementById('cart-list');
  const totalPriceEl = document.getElementById('total-price');
  if (!cartList || !totalPriceEl) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartList.innerHTML = ''; // Xóa nội dung giỏ hàng trước khi render

  if (cart.length === 0) {
    cartList.innerHTML = '<li>Giỏ hàng trống.</li>';
    totalPriceEl.textContent = 'Tổng tiền: 0 VND';
    return;
  }

  let total = 0;
  
  // Duyệt qua các sản phẩm trong giỏ hàng và hiển thị chúng
  cart.forEach((item, index) => {
    // Tìm sản phẩm từ mảng products
    const product = products.find(p => p.id === item.id);
    
    if (!product) {
      console.error(`Không tìm thấy sản phẩm với id ${item.id}`);
      return;
    }

    total += product.price * item.quantity;

    const li = document.createElement('li');
    li.innerHTML = `
      ${product.name} - ${formatPrice(product.price)} x ${item.quantity}
      <button data-index="${index}">Xóa</button>
    `;
    cartList.appendChild(li);
  });

  totalPriceEl.textContent = 'Tổng tiền: ' + formatPrice(total);

  // Xử lý sự kiện xóa sản phẩm khỏi giỏ
  cartList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      cart.splice(idx, 1); // Xóa sản phẩm khỏi giỏ
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart(); // Render lại giỏ hàng sau khi xóa
    });
  });
}

// Hàm xử lý đặt hàng
function handleOrder() {
  const orderForm = document.getElementById('order-form');
  const orderMessage = document.getElementById('order-message');
  const orderSummary = document.getElementById('order-summary');
  
  if (!orderForm) return;

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Kiểm tra giỏ hàng không rỗng
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      orderMessage.style.color = 'red';
      orderMessage.textContent = 'Giỏ hàng của bạn đang trống, vui lòng thêm sản phẩm.';
      return;
    }

    // Lấy thông tin từ form
    const fullname = orderForm.fullname.value.trim();
    const address = orderForm.address.value.trim();
    const phone = orderForm.phone.value.trim();

    if (!fullname || !address || !phone) {
      orderMessage.style.color = 'red';
      orderMessage.textContent = 'Vui lòng điền đầy đủ thông tin đặt hàng.';
      return;
    }

    // Tính tổng tiền
    let total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    // Gửi đơn hàng qua Telegram API
    const BOT_TOKEN = '7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8';
    const CHAT_ID = '7774024453';

    let message = `🛒 Đơn hàng mới từ cửa hàng LỘC HOÀI\n\n`;
    message += `Khách hàng:\nHọ tên: ${fullname}\nĐịa chỉ: ${address}\nSĐT: ${phone}\n\n`;
    message += `Sản phẩm:\n`;
    cart.forEach((item, i) => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        message += `${i + 1}. ${product.name} - ${formatPrice(product.price)} x ${item.quantity}\n`;
      }
    });
    message += `\nTổng tiền: ${formatPrice(total)}`;

    // Gửi request tới Telegram
    try {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const params = { chat_id: CHAT_ID, text: message };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await res.json();
      if (data.ok) {
        orderMessage.style.color = 'green';
        orderMessage.textContent = 'Đặt hàng thành công! Cảm ơn bạn.';
        orderForm.reset();
        localStorage.removeItem('cart');
        renderCart();
        
        // Hiển thị tóm tắt đơn hàng
        orderSummary.style.display = 'block';
        orderSummary.innerHTML = `
          <h3>Thông tin đơn hàng của bạn:</h3>
          <p><strong>Họ tên:</strong> ${fullname}</p>
          <p><strong>Địa chỉ:</strong> ${address}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          <p><strong>Tổng tiền:</strong> ${formatPrice(total)}</p>
          <p><strong>Sản phẩm:</strong></p>
          <ul>${cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return `<li>${product.name} - ${formatPrice(product.price)} x ${item.quantity}</li>`;
          }).join('')}</ul>
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

<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Giỏ hàng - Cửa hàng LỘC HOÀI</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <header class="header">
    <div class="logo">
      <h1>🛒 GIỎ HÀNG - <span class="highlight">LỘC HOÀI</span></h1>
    </div>
    <div class="contact">
      <a href="index.html">
        <img src="img/cart.gif" alt="Trở về" class="icon" title="Trang chủ" />
      </a>
    </div>
  </header>

  <main class="main-content">
    <h2>Danh sách sản phẩm trong giỏ</h2>
    <div id="cart-items"></div>

    <div class="cart-summary">
      <p><strong>Tạm tính:</strong> <span id="subtotal">0đ</span></p>
      <p><strong>Phí ship:</strong> <span id="shipping">0đ</span></p>
      <p><strong>Tổng thanh toán:</strong> <span id="total">0đ</span></p>
    </div>

    <h3>Thông tin khách hàng</h3>
    <form id="order-form">
      <label>Họ tên:</label>
      <input type="text" id="name" required />

      <label>Số điện thoại:</label>
      <input type="tel" id="phone" required />

      <label>Địa chỉ:</label>
      <textarea id="address" required></textarea>

      <label>Ghi chú (tuỳ chọn):</label>
      <textarea id="note"></textarea>

      <button type="submit" id="order-btn">📦 Đặt hàng</button>
    </form>

    <div id="message"></div>
  </main>

  <footer class="footer">
    <p>&copy; 2025 Cửa hàng tạp hóa LỘC HOÀI. Đơn hàng được gửi qua Telegram.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>

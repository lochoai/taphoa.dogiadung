# Cửa hàng LỘC HOÀI - Trang web bán hàng tạp hóa và đồ gia dụng

## Mô tả dự án
Trang web bán hàng trực tuyến dành cho cửa hàng tạp hóa và đồ gia dụng "LỘC HOÀI". Giao diện được thiết kế thân thiện, tối ưu trên cả điện thoại và máy tính.

## Công nghệ sử dụng
- HTML5, CSS3, JavaScript (Vanilla)
- Sử dụng Telegram Bot API để gửi đơn hàng qua Telegram
- Lưu trữ giỏ hàng bằng LocalStorage để giữ trạng thái khi khách thoát trang

## Các tệp chính
- `index.html`: Trang chủ, hiển thị sản phẩm, danh mục
- `cart.html`: Trang giỏ hàng, đặt hàng
- `style.css`: File CSS chứa toàn bộ style của trang web
- `script.js`: File JavaScript xử lý logic giỏ hàng, giao tiếp Telegram API
- `images/`: Thư mục chứa hình ảnh sản phẩm, biểu tượng

## Cách chạy
1. Mở `index.html` trên trình duyệt (tốt nhất dùng máy chủ local như Live Server của VSCode để tránh lỗi CORS)
2. Truy cập và tương tác với trang web, thêm sản phẩm vào giỏ hàng.
3. Đặt hàng tại trang giỏ hàng `cart.html`
4. Khi đặt hàng thành công, thông tin đơn sẽ gửi về Telegram qua Bot API.

## Thông tin API Telegram Bot
- Bot Token: 7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8
- CHAT_ID nhận đơn: 7774024453

## Lưu ý
- Vui lòng chuẩn bị ảnh sản phẩm trong thư mục `images/`
- Đảm bảo kết nối internet để gửi đơn qua Telegram API
- Giỏ hàng được lưu trữ tạm thời trên LocalStorage của trình duyệt.

---

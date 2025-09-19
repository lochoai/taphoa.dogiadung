# Trang web cửa hàng LỘC HOÀI

## Cấu trúc file

- `index.html`: Trang chủ, hiển thị sản phẩm, chọn danh mục, thêm sản phẩm vào giỏ hàng
- `cart.html`: Trang giỏ hàng, xem sản phẩm đã chọn, đặt hàng
- `style.css`: File style CSS cho trang web
- `script.js`: File JavaScript dùng chung cho index và cart

## Hướng dẫn sử dụng

1. Mở `index.html` trên trình duyệt để xem sản phẩm và thêm vào giỏ hàng.
2. Click vào "Giỏ hàng" trên thanh menu để vào trang `cart.html` xem giỏ hàng.
3. Ở trang giỏ hàng, bạn có thể xóa sản phẩm khỏi giỏ.
4. Điền đầy đủ thông tin đặt hàng (họ tên, địa chỉ, số điện thoại).
5. Nhấn nút "Đặt hàng" để gửi đơn qua Telegram.
6. Sau khi đặt thành công, giỏ hàng sẽ được làm trống và hiện thông báo.

## Lưu ý

- Giỏ hàng lưu trên `localStorage`, nếu xóa cache trình duyệt sẽ mất giỏ hàng.
- Cần có internet để gửi đơn qua Telegram API.
- Màu sắc chủ đạo: xanh lá (#8BC34A), vàng (#FFEB3B), đỏ nhạt (#FFCDD2), xanh dương (#2196F3).

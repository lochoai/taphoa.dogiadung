# Cửa hàng “LỘC HOÀI”

Trang web bán hàng tạp hóa và đồ gia dụng, với các chức năng:

- Hiển thị sản phẩm theo 2 mục lớn: TẠP HÓA & GIA DỤNG
- Các mục nhỏ (dưới mục lớn) như: gia vị, bánh kẹo, đồ uống, đồ điện, đồ bếp, chén bát, đồ khô,...
- Giỏ hàng: thêm sản phẩm, sửa số lượng, xoá, xem tổng tiền & phí vận chuyển
- Đặt hàng: nhập họ tên, sđt, địa chỉ → gửi đơn qua Telegram bot
- Mã đơn hàng ngẫu nhiên, thông báo đặt hàng thành công / thất bại

---

## Yêu cầu

- Bot Token: `7986532916:AAGPbxtqJHILVuHBYh0fwsKU62a4jEJ8Jp8`
- Chat ID của bạn: `7774024453`
- Phí vận chuyển: **20.000 VND** cho đơn từ 1 đến 199.999 VND
- Giao diện màu sáng: xanh lá, vàng nhạt, đỏ
- Responsive: máy tính & điện thoại

---

## Cấu trúc thư mục


---

## Hướng dẫn chạy

1. Clone repo về máy hoặc tạo project trên GitHub Pages (nếu muốn public).
2. Mở `index.html` để xem trang chủ.
3. Khi khách chọn “Mua ngay” hoặc “Đặt hàng” → sẽ điều hướng tới `cart.html`.
4. Bot Telegram sẽ được gọi qua fetch POST tới `https://api.telegram.org/bot<BOT_TOKEN>/sendMessage` với `chat_id` và thông điệp đơn hàng.
5. Giỏ hàng lưu trong `localStorage`, nên khi người dùng thoát rồi vào lại vẫn giữ sản phẩm đã chọn.

---

## Các điểm có thể nâng cấp

- Thêm ảnh sản phẩm thật
- Thiết kế icon đẹp hơn cho các biểu tượng gọi điện, FB, Zalo, Telegram, giỏ hàng,...
- Xác thực đầu vào (ví dụ: số điện thoại đúng định dạng, địa chỉ không để trống)
- Thêm thanh tìm sản phẩm nếu muốn

---

## Liên hệ người lập

- Tên: Cửa hàng LỘC HOÀI  
- SĐT: 0372057834  
- Facebook: @pro.huuloc.1  
- Telegram: 7774024453  
- Zalo: chưa cập nhật  


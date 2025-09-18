// --- CẤU HÌNH TELEGRAM ---
const BOT_TOKEN = "7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8";
const CHAT_ID = "7774024453";

// --- HÀNG HÓA / GIỎ HÀNG ---
let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];

function themVaoGio(ten, gia) {
  gioHang.push({ ten, gia });
  localStorage.setItem("gioHang", JSON.stringify(gioHang));
  alert(`✅ Đã thêm "${ten}" vào giỏ hàng!`);
}

// --- HIỂN THỊ GIỎ HÀNG ---
function hienThiGioHang() {
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");

  if (!cartItemsEl) return;

  cartItemsEl.innerHTML = "";

  if (gioHang.length === 0) {
    cartItemsEl.innerHTML = "<p>Giỏ hàng đang trống.</p>";
    subtotalEl.textContent = "0đ";
    shippingEl.textContent = "0đ";
    totalEl.textContent = "0đ";
    return;
  }

  let subtotal = 0;

  gioHang.forEach((item, index) => {
    subtotal += item.gia;

    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");

    itemEl.innerHTML = `
      <p>${item.ten} - ${item.gia.toLocaleString()}đ</p>
      <button onclick="xoaSanPham(${index})">❌ Xoá</button>
    `;

    cartItemsEl.appendChild(itemEl);
  });

  // Tính phí ship
  let ship = subtotal < 200000 ? 20000 : 0;
  let total = subtotal + ship;

  subtotalEl.textContent = `${subtotal.toLocaleString()}đ`;
  shippingEl.textContent = `${ship.toLocaleString()}đ`;
  totalEl.textContent = `${total.toLocaleString()}đ`;
}

// --- XOÁ SẢN PHẨM ---
function xoaSanPham(index) {
  gioHang.splice(index, 1);
  localStorage.setItem("gioHang", JSON.stringify(gioHang));
  hienThiGioHang();
}

// --- GỬI ĐƠN HÀNG QUA TELEGRAM ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (gioHang.length === 0) {
        alert("❗ Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt.");
        return;
      }

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const address = document.getElementById("address").value.trim();
      const note = document.getElementById("note").value.trim();

      // Tính tổng và ship
      const subtotal = gioHang.reduce((sum, item) => sum + item.gia, 0);
      const ship = subtotal < 200000 ? 20000 : 0;
      const total = subtotal + ship;

      let text = `🛒 *ĐƠN HÀNG MỚI* 🛒\n`;
      text += `👤 *Khách:* ${name}\n📞 *SĐT:* ${phone}\n🏠 *Địa chỉ:* ${address}\n`;
      if (note) text += `📝 *Ghi chú:* ${note}\n`;
      text += `\n📦 *Sản phẩm:*\n`;

      gioHang.forEach((item, i) => {
        text += `- ${item.ten} (${item.gia.toLocaleString()}đ)\n`;
      });

      text += `\n💵 *Tạm tính:* ${subtotal.toLocaleString()}đ`;
      text += `\n🚚 *Phí ship:* ${ship.toLocaleString()}đ`;
      text += `\n💰 *TỔNG:* ${total.toLocaleString()}đ`;

      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text,
            parse_mode: "Markdown",
          }),
        });

        if (res.ok) {
          document.getElementById("message").innerHTML = `<p style="color:green;">✅ Đơn hàng đã được gửi thành công!</p>`;
          gioHang = [];
          localStorage.removeItem("gioHang");
          form.reset();
          hienThiGioHang();
        } else {
          throw new Error("Lỗi gửi đơn hàng.");
        }
      } catch (err) {
        document.getElementById("message").innerHTML = `<p style="color:red;">❌ Gửi đơn thất bại. Vui lòng thử lại sau.</p>`;
      }
    });
  }

  hienThiGioHang(); // Hiển thị giỏ hàng khi vào trang cart.html
});

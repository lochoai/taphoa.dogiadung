const TELEGRAM_BOT_TOKEN = "7986532916:AAGPbxtqJHILVuHBYb0fwsKU62a4jEJ8Jp8";
const TELEGRAM_CHAT_ID = "7774024453";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function $(selector) {
  return document.querySelector(selector);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const container = $("#cart-items");
  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = "<p>Giỏ hàng trống.</p>";
    $("#shipping-fee").textContent = "0 ₫";
    $("#total-price").textContent = "0 ₫";
    return;
  }
  cart.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>${item.name}</div>
      <div>Số lượng: 
        <button class="qty-btn" data-idx="${idx}" data-action="minus">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-idx="${idx}" data-action="plus">+</button>
      </div>
      <div>Giá: ${(item.price * item.qty).toLocaleString()} ₫</div>
    `;
    container.appendChild(div);
  });

  updateSummary();
  attachQtyEvents();
}

function updateSummary() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = total > 0 && total < 199999 ? 20000 : 0;
  $("#shipping-fee").textContent = shipping.toLocaleString() + " ₫";
  $("#total-price").textContent = (total + shipping).toLocaleString() + " ₫";
}

function attachQtyEvents() {
  const buttons = document.querySelectorAll(".qty-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const action = btn.dataset.action;
      if (action === "minus") {
        if (cart[idx].qty > 1) {
          cart[idx].qty--;
        } else {
          cart.splice(idx, 1);
        }
      } else {
        cart[idx].qty++;
      }
      saveCart();
      renderCart();
    });
  });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

function generateOrderCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  code += Math.floor(1000000 + Math.random() * 9000000).toString();
  return code;
}

function sendOrderToTelegram(orderData) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const text = `
📦 ĐƠN HÀNG MỚI: ${orderData.orderCode}
🕒 Thời gian: ${orderData.time}
👤 Tên: ${orderData.name}
📞 SĐT: ${orderData.phone}
🏠 Địa chỉ: ${orderData.address}

🛒 Sản phẩm:
${orderData.products
  .map((p) => `- ${p.name} x ${p.qty}`)
  .join("\n")}

🚚 Phí ship: ${orderData.shipping.toLocaleString()}₫
💰 Tổng cộng: ${orderData.total.toLocaleString()} đ
`;

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
  }).then((res) => res.json());
}

function openOrderModal() {
  $("#order-modal").classList.remove("hidden");
}

function closeOrderModal() {
  $("#order-modal").classList.add("hidden");
}

function resetCart() {
  cart = [];
  saveCart();
  renderCart();
  updateCartCountOnMain();
}

function updateCartCountOnMain() {
  // Cross page communication via localStorage
  localStorage.setItem("cart-update", Date.now());
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  $("#back-to-products").addEventListener("click", () => {
    window.history.back();
  });

  $("#btn-place-order").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    openOrderModal();
  });

  $("#cancel-order").addEventListener("click", () => {
    closeOrderModal();
  });

  $("#confirm-order").addEventListener("click", async () => {
    const name = $("#customer-name").value.trim();
    const phone = $("#customer-phone").value.trim();
    const address = $("#customer-address").value.trim();

    if (!name || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = total > 0 && total < 199999 ? 20000 : 0;
    const orderCode = generateOrderCode();
    const now = new Date();
    const timeString = now.toLocaleTimeString("vi-VN") + " - " + now.toLocaleDateString("vi-VN");

    const orderData = {
      orderCode,
      time: timeString,
      name,
      phone,
      address,
      products: cart,
      shipping,
      total: total + shipping,
    };

    try {
      const res = await sendOrderToTelegram(orderData);
      if (res.ok) {
        showToast("Đặt hàng thành công!");
        closeOrderModal();
        resetCart();
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        showToast("Đặt hàng không thành công!");
      }
    } catch (error) {
      showToast("Lỗi kết nối. Vui lòng thử lại!");
    }
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "cart-update") {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
      renderCart();
    }
  });
});

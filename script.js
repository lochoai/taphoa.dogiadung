let cart = [];

// Khi trang tải lên, lấy giỏ hàng từ localStorage (nếu có)
window.onload = function () {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
};

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    updateCartDisplay();
    showCustomAlert(`${name} đã được thêm vào giỏ hàng!`);
}

function removeFromCart(index) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        cart.splice(index, 1);
        saveCart();
        updateCartDisplay();
        showCustomAlert("Sản phẩm đã được xóa khỏi giỏ hàng.");
    }
}

// Hàm lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.price.toLocaleString()} đ x ${item.quantity}`;

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Xóa";
        btnDelete.style.marginLeft = "10px";
        btnDelete.onclick = () => removeFromCart(index);

        li.appendChild(btnDelete);
        cartItems.appendChild(li);

        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toLocaleString();
}

// ✅ Thông báo nổi ở giữa màn hình
function showCustomAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    if (!alertBox) return;

    alertBox.textContent = `✅ ${message}`;
    alertBox.classList.add("show");

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 2000);
}

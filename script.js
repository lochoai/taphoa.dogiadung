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

let deleteIndex = null;

function removeFromCart(index) {
    deleteIndex = index;
    document.getElementById("delete-confirm").style.display = "flex";
}

function confirmDelete(confirm) {
    document.getElementById("delete-confirm").style.display = "none";
    if (confirm && deleteIndex !== null) {
        cart.splice(deleteIndex, 1);
        saveCart();
        updateCartDisplay();
        showCustomAlert("Sản phẩm đã được xóa khỏi giỏ hàng.");
    }
    deleteIndex = null;
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

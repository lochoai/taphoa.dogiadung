let cart = [];

// Khi trang tải lên, lấy giỏ hàng từ localStorage (nếu có)
window.onload = function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    updateCartDisplay();
    showCustomAlert(`${name} đã được thêm vào giỏ hàng!`, "success");
}
function removeFromCart(index) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        cart.splice(index, 1);
        saveCart();
        updateCartDisplay();
        showCustomAlert("Sản phẩm đã được xóa khỏi giỏ hàng.", "success");
    }
}
// Hàm lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

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
function showCustomAlert(message, type = 'success') {
    const alertBox = document.getElementById("custom-alert");
    alertBox.textContent = message;

    if (type === 'success') {
        alertBox.style.backgroundColor = '#2ecc71'; // xanh lá
    } else if (type === 'error') {
        alertBox.style.backgroundColor = '#e74c3c'; // đỏ
    } else {
        alertBox.style.backgroundColor = '#3498db'; // xanh dương
    }

    alertBox.classList.add("show");
    alertBox.classList.remove("hide");

    setTimeout(() => {
        alertBox.classList.remove("show");
        alertBox.classList.add("hide");
    }, 1000);
}

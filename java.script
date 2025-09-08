let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartDisplay();
    alert(`${name} đã được thêm vào giỏ hàng!`);
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    // Xóa danh sách cũ
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.price.toLocaleString()} đ`;
        cartItems.appendChild(li);
        total += item.price;
    });

    cartTotal.textContent = total.toLocaleString();
}

let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartDisplay();
    alert(`${name} đã được thêm vào giỏ hàng!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.price.toLocaleString()} đ`;

        // Tạo nút xóa
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Xóa";
        btnDelete.style.marginLeft = "10px";
        btnDelete.onclick = () => removeFromCart(index);

        li.appendChild(btnDelete);
        cartItems.appendChild(li);

        total += item.price;
    });

    cartTotal.textContent = total.toLocaleString();
}

const products = [
    { id: 1, name: "Máy Xay Sinh Tố", price: 350000, image: "product1.jpg" },
    { id: 2, name: "Nồi Cơm Điện", price: 500000, image: "product2.jpg" },
    { id: 3, name: "Quạt Máy", price: 150000, image: "product3.jpg" },
];

const cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts() {
    const productList = document.getElementById("product-list");
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Giá: ${product.price.toLocaleString()} VND</p>
            <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        `;
        productList.appendChild(productDiv);
    });
}

function renderCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = ""; // Clear existing cart items
    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Giá: ${item.price.toLocaleString()} VND</p>
            <button onclick="removeFromCart(${item.id})">Xóa</button>
        `;
        cartList.appendChild(itemDiv);
    });
    updateCheckout();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Sản phẩm đã được thêm vào giỏ!");
    }
}

function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart.splice(productIndex, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

function updateCheckout() {
    const checkoutBtn = document.getElementById("checkout-btn");
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
    }
}

document.getElementById("checkout-btn")?.addEventListener("click", () => {
    alert("Đơn hàng của bạn đã được gửi!");
    localStorage.removeItem("cart");
    renderCart();
});

if (window.location.pathname.includes("index.html")) {
    renderProducts();
} else if (window.location.pathname.includes("cart.html")) {
    renderCart();
}

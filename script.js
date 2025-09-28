// Danh sách sản phẩm mẫu
const products = [
    { id: 1, name: "Gia Vị 1", category: "gia-vi", price: 10, image: "https://via.placeholder.com/200" },
    { id: 2, name: "Gia Vị 2", category: "gia-vi", price: 15, image: "https://via.placeholder.com/200" },
    { id: 3, name: "Đồ Uống 1", category: "do-uong", price: 20, image: "https://via.placeholder.com/200" },
    { id: 4, name: "Đồ Uống 2", category: "do-uong", price: 25, image: "https://via.placeholder.com/200" },
    { id: 5, name: "Đồ Khô 1", category: "do-kho", price: 30, image: "https://via.placeholder.com/200" },
    { id: 6, name: "Đồ Khô 2", category: "do-kho", price: 35, image: "https://via.placeholder.com/200" }
];

// Hàm thêm sản phẩm vào danh mục
function displayProducts() {
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>${product.price} VNĐ</p>
            <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        `;

        // Thêm sản phẩm vào đúng danh mục
        const categoryElement = document.getElementById(product.category);
        categoryElement.querySelector(".product-list").appendChild(productElement);
    });
}

// Giỏ hàng
let cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
}

// Cập nhật giỏ hàng
function updateCart() {
    const cartIcon = document.querySelector(".cart-icon");
    cartIcon.textContent = `Giỏ hàng (${cart.length})`;
}

displayProducts();

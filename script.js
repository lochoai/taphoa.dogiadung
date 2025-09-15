// Dữ liệu sản phẩm mẫu
const products = [
  { id: 1, name: "Nồi cơm điện Sunhouse", price: 350000, category: "do-dien", image: "images/nồi điện sunhause.jfif", description: "Nồi cơm điện tiện lợi, dung tích 1.8L, tiết kiệm điện." },
  { id: 2, name: "Nước mắm Nam Ngư", price: 25000, category: "gia-vi", image: "images/nước mắm nam ngư.jfif", description: "Nước mắm truyền thống, hương vị đậm đà." },
  { id: 3, name: "Bánh mì sandwich", price: 15000, category: "thuc-pham", image: "images/bánh mì sandwich.jpg", description: "Bánh mì tươi ngon, thơm giòn." },
  { id: 4, name: "Bếp điện từ", price: 1200000, category: "do-dien", image: "images/bếp điện từ.jfif", description: "Bếp điện từ công suất lớn, an toàn và tiện lợi." },
  { id: 5, name: "Gia vị tổng hợp", price: 40000, category: "gia-vi", image: "images/gia vị tổng hợp.jpg", description: "Bộ gia vị đa dạng cho mọi món ăn." },
  { id: 6, name: "Trái cây tươi", price: 50000, category: "thuc-pham", image: "images/trái cây tươi.jpg", description: "Hỗn hợp trái cây tươi ngon và sạch." }
];

// Hiển thị sản phẩm theo danh mục (mặc định all)
let currentCategory = 'all';

function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  const filteredProducts = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);

  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <div class="product-name" onclick="viewProduct(${product.id})">${product.name}</div>
      <div class="product-actions">
        <button class="add-cart-btn" onclick="addToCart(${product.id}); event.stopPropagation();">Thêm giỏ hàng</button>
        <button class="order-btn" onclick="orderNow(${product.id}); event.stopPropagation();">Đặt hàng</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function filterCategory(category) {
  currentCategory = category;
  renderProducts();
}

// Hiển thị modal chi tiết sản phẩm
function viewProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById("modal-image").src = product.image;
  document.getElementById("modal-image").alt = product.name;
  document.getElementById("modal-name").textContent = product.name;
  document.getElementById("modal-description").textContent = product.description || "Mô tả sản phẩm sẽ được cập nhật sau.";

  document.getElementById("product-modal").classList.remove("hidden");

  // Xử lý nút Thêm giỏ hàng modal
  document.getElementById("modal-add-cart").onclick = () => {
    addToCart(product.id);
    alert(`${product.name} đã được thêm vào giỏ hàng.`);
  };

  // Xử lý nút Đặt hàng modal
  document.getElementById("modal-order-now").onclick = () => {
    addToCart(product.id);
    alert("Đặt hàng thành công!");
    document.getElementById("product-modal").classList.add("hidden");
    window.location.href = "index.html"; // Quay về trang chủ
  };

  // Xử lý đánh giá
  const reviewTextarea = document.getElementById("review-text");
  const reviewMessage = document.getElementById("review-message");
  reviewTextarea.value = "";
  reviewMessage.textContent = "";

  document.getElementById("submit-review").onclick = () => {
    const review = reviewTextarea.value.trim();
    if (review.length === 0) {
      reviewMessage.style.color = "red";
      reviewMessage.textContent = "Vui lòng nhập đánh giá.";
      return;
    }
    const reviewsKey = `reviews_product_${product.id}`;
    const existingReviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
    existingReviews.push(review);
    localStorage.setItem(reviewsKey, JSON.stringify(existingReviews));
    reviewTextarea.value = "";
    reviewMessage.style.color = "green";
    reviewMessage.textContent = "Cảm ơn bạn đã đánh giá!";
  };
}

// Đóng modal khi nhấn nút mũi tên
document.getElementById("modal-close-btn").addEventListener("click", () => {
  document.getElementById("product-modal").classList.add("hidden");
});

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// Đặt hàng trực tiếp từ nút Đặt hàng trên sản phẩm (giống modal)
function orderNow(productId) {
  addToCart(productId);
  alert("Đặt hàng thành công!");
  window.location.href = "index.html"; // Quay về trang chủ
}

// Cập nhật hiển thị giỏ hàng ở trang chính
function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartBody = document.getElementById("cart-body");
  const cartSummary = document.getElementById("cart-summary");
  cartBody.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.name}</td>
      <td>${item.quantity}</td>
      <td>${product.price.toLocaleString()} VND</td>
      <td>${(product.price * item.quantity).toLocaleString()} VND</td>
    `;

    cartBody.appendChild(row);
    total += product.price * item.quantity;
  });

  cartSummary.textContent = `Tổng: ${total.toLocaleString()} VND`;
}

document.getElementById("order-main-btn").addEventListener("click", () => {
  alert("Đặt hàng từ giỏ thành công!");
  localStorage.removeItem("cart");
  updateCartUI();
});

// Khởi tạo trang
renderProducts();
updateCartUI();

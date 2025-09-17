const tapHoa = {
  "tất cả": [
    { name: "Nước mắm Nam Ngư", price: 25000, image: "https://via.placeholder.com/150" },
    { name: "Coca-Cola", price: 10000, image: "https://via.placeholder.com/150" }
  ],
  "bánh kẹo": [
    { name: "Bánh quy Oreo", price: 15000, image: "https://via.placeholder.com/150" }
  ]
};

const giaDung = {
  "tất cả": [
    { name: "Nồi cơm điện Sunhouse", price: 800000, image: "https://via.placeholder.com/150" }
  ],
  "đồ bếp": [
    { name: "Chảo chống dính", price: 200000, image: "https://via.placeholder.com/150" }
  ]
};

let currentCategory = 'tap-hoa';

function switchCategory(cat) {
  currentCategory = cat;
  const subs = cat === 'tap-hoa' ? Object.keys(tapHoa) : Object.keys(giaDung);
  const subCatEl = document.getElementById('sub-categories');
  subCatEl.innerHTML = '';
  subs.forEach(sub => {
    const btn = document.createElement('button');
    btn.textContent = sub;
    btn.onclick = () => renderProducts(sub);
    subCatEl.appendChild(btn);
  });
  renderProducts('tất cả');
}

function renderProducts(sub) {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  const products = currentCategory === 'tap-hoa' ? tapHoa[sub] : giaDung[sub];
  products.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" />
      <h4>${prod.name}</h4>
      <p>${prod.price.toLocaleString()}₫</p>
      <button class="btn-add" onclick="addToCart('${prod.name}', ${prod.price})">Thêm</button>
      <button class="btn-buy" onclick="goToCart('${prod.name}', ${prod.price})">Mua</button>
    `;
    list.appendChild(card);
  });
}

function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const index = cart.findIndex(item => item.name === name);
  if (index > -1) {
    cart[index].qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showMessage(`${name} đã thêm vào giỏ hàng`);
}

function goToCart(name, price) {
  addToCart(name, price);
  window.location.href = 'cart.html';
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  document.getElementById('cart-count').textContent = count;
}

function showMessage(msg) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.position = 'fixed';
  div.style.top = '50%';
  div.style.left = '50%';
  div.style.transform = 'translate(-50%, -50%)';
  div.style.background = '#000';
  div.style.color = '#fff';
  div.style.padding = '10px 20px';
  div.style.borderRadius = '5px';
  div.style.zIndex = 9999;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1000);
}

window.onload = function () {
  updateCartCount();
  if (document.getElementById('sub-categories')) {
    switchCategory('tap-hoa');
  }
};

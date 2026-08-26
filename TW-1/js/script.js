const products = [
  { id: 1, name: "Street Runner", price: 2499, color: "Black", category: "black", rating: 4.8, reviews: 124, badge: "Bestseller", image: "https://images.pexels.com/photos/4932920/pexels-photo-4932920.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 2, name: "Urban White", price: 2799, color: "White", category: "white", rating: 4.7, reviews: 98, badge: "New", image: "https://images.pexels.com/photos/12739984/pexels-photo-12739984.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 3, name: "Campus Classic", price: 1999, color: "Blue", category: "blue", rating: 4.9, reviews: 167, badge: "Student pick", image: "https://images.pexels.com/photos/1461538/pexels-photo-1461538.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 4, name: "Daily Flex", price: 2299, color: "Red", category: "red", rating: 4.6, reviews: 73, badge: "", image: "https://images.pexels.com/photos/10566011/pexels-photo-10566011.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 5, name: "Sport Edge", price: 3199, color: "White", category: "white", rating: 4.8, reviews: 88, badge: "Performance", image: "https://images.pexels.com/photos/6748354/pexels-photo-6748354.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 6, name: "Retro Walk", price: 2899, color: "Red & White", category: "red", rating: 4.7, reviews: 61, badge: "Limited", image: "https://images.pexels.com/photos/6237590/pexels-photo-6237590.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 7, name: "Midnight Low", price: 2399, color: "Black", category: "black", rating: 4.6, reviews: 82, badge: "New", image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 8, name: "Cloud Court", price: 2999, color: "White", category: "white", rating: 4.9, reviews: 143, badge: "Bestseller", image: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 9, name: "Ocean Pace", price: 2599, color: "Blue", category: "blue", rating: 4.7, reviews: 91, badge: "", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 10, name: "Crimson Street", price: 2699, color: "Red", category: "red", rating: 4.5, reviews: 56, badge: "Limited", image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 11, name: "Night Shift", price: 3399, color: "Black", category: "black", rating: 4.8, reviews: 74, badge: "Premium", image: "https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 12, name: "Clean Canvas", price: 2199, color: "White", category: "white", rating: 4.6, reviews: 109, badge: "Student pick", image: "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900" },
  { id: 13, name: "Blue Horizon", price: 3099, color: "Blue", category: "blue", rating: 4.8, reviews: 65, badge: "Fresh drop", image: "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 14, name: "Street Flame", price: 2499, color: "Red", category: "red", rating: 4.7, reviews: 87, badge: "", image: "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 15, name: "Core Black", price: 2799, color: "Black", category: "black", rating: 4.9, reviews: 132, badge: "Top rated", image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 16, name: "Mono White", price: 2499, color: "White", category: "white", rating: 4.7, reviews: 96, badge: "", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 17, name: "Sky Runner", price: 2899, color: "Blue", category: "blue", rating: 4.6, reviews: 52, badge: "New", image: "https://images.pexels.com/photos/1456704/pexels-photo-1456704.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 18, name: "Redline Trainer", price: 3299, color: "Red", category: "red", rating: 4.8, reviews: 71, badge: "Performance", image: "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=900" }
];

const FREE_SHIPPING = 2999;
const CART_KEY = "soleStreetCart";
let cart = [];
let activeFilter = "all";
let searchTerm = "";
let sortMode = "featured";

function money(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    cart = Array.isArray(saved)
      ? saved
          .filter(item => item && Number.isFinite(Number(item.id)) && Number(item.qty) > 0)
          .map(item => ({
            ...item,
            id: Number(item.id),
            qty: Number(item.qty)
          }))
      : [];
  } catch {
    cart = [];
  }
}


function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
}

function getProduct(id) {
  return products.find(p => p.id === Number(id));
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const p = getProduct(item.id);
    return total + (p ? p.price * item.qty : 0);
  }, 0);
}

function showToast(text) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function addToCart(id) {
  const product = getProduct(id);
  if (!product) return;

  const item = cart.find(entry => entry.id === product.id);
  if (item) item.qty += 1;
  else cart.push({ id: product.id, qty: 1 });

  saveCart();
  renderCart();
  renderCartSummary();
  renderShippingProgress();
  renderPaymentSummary();
  showToast(`${product.name} added to your bag`);
}


function changeQty(id, amount) {
  const item = cart.find(entry => entry.id === Number(id));
  if (!item) return;

  item.qty += Number(amount);
  if (item.qty <= 0) cart = cart.filter(entry => entry.id !== Number(id));

  saveCart();
  renderCart();
  renderCartSummary();
  renderShippingProgress();
  renderPaymentSummary();
}


function removeFromCart(id) {
  const product = getProduct(id);
  cart = cart.filter(entry => entry.id !== Number(id));

  saveCart();
  renderCart();
  renderCartSummary();
  renderShippingProgress();
  renderPaymentSummary();

  if (product) showToast(`${product.name} removed`);
}


function renderProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  let visible = [...products];
  const query = String(searchTerm || "").trim().toLowerCase();

  if (query) visible = visible.filter(product =>
    `${product.name} ${product.color} ${product.badge || ""}`.toLowerCase().includes(query)
  );

  if (activeFilter !== "all") visible = visible.filter(product => product.category === activeFilter);
  if (sortMode === "low") visible.sort((a, b) => a.price - b.price);
  if (sortMode === "high") visible.sort((a, b) => b.price - a.price);
  if (sortMode === "name") visible.sort((a, b) => a.name.localeCompare(b.name));

  list.innerHTML = visible.map(product => `
    <article class="product-card">
      <button class="product-image-wrap product-gallery-trigger" type="button"
        onclick="openProductGallery(${product.id})" aria-label="Quick view ${product.name}">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <span class="gallery-hint">QUICK VIEW</span>
        <img class="product-main-image" src="${product.image}" alt="${product.name}" loading="lazy">
      </button>
      <div class="product-info">
        <div class="product-meta">
          <span>${product.color}</span>
          <span>★ ${product.rating} <span class="review-count">(${product.reviews})</span></span>
        </div>
        <h3>${product.name}</h3>
        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" type="button" onclick="addToCart(${product.id})">Add to bag</button>
        </div>
      </div>
    </article>
  `).join("");

  const empty = document.getElementById("no-products");
  if (empty) empty.classList.toggle("hidden", visible.length > 0);
}


function clearProductFilters() {
  searchTerm = "";
  activeFilter = "all";
  sortMode = "featured";

  const search = document.getElementById("product-search");
  if (search) search.value = "";

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", (btn.dataset.filter || "all") === "all");
  });

  const sort = document.getElementById("sort-products");
  if (sort) sort.value = "featured";

  renderProducts();
}


function resetProductFilters() {
  activeFilter = "all";
  searchTerm = "";
  sortMode = "featured";

  const search = document.getElementById("product-search");
  if (search) search.value = "";

  const sort = document.getElementById("sort-products");
  if (sort) sort.value = "featured";

  document.querySelectorAll(".filter-btn").forEach(button =>
    button.classList.toggle("active", button.dataset.filter === "all")
  );

  renderProducts();
}


function setupFilters() {
  const search = document.getElementById("product-search");
  if (search && !search.dataset.bound) {
    search.dataset.bound = "true";
    search.addEventListener("input", e => {
      searchTerm = e.target.value;
      renderProducts();
    });
  }

  document.querySelectorAll(".filter-btn").forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter || "all";
      document.querySelectorAll(".filter-btn").forEach(b =>
        b.classList.toggle("active", b === btn)
      );
      renderProducts();
    });
  });

  const sort = document.getElementById("sort-products");
  if (sort && !sort.dataset.bound) {
    sort.dataset.bound = "true";
    sort.addEventListener("change", e => {
      sortMode = e.target.value;
      renderProducts();
    });
  }
}


function renderShippingProgress() {
  const el = document.getElementById("shipping-progress");
  if (!el) return;
  const total = getCartTotal();
  if (!total) {
    el.innerHTML = `<div class="progress-copy"><strong>Free delivery on orders over ₹2,999</strong><span>Add a pair to get started.</span></div><div class="progress-track"><i style="width:0%"></i></div>`;
    return;
  }
  const remaining = FREE_SHIPPING - total;
  const percent = Math.min(100, (total / FREE_SHIPPING) * 100);
  el.innerHTML = remaining > 0
    ? `<div class="progress-copy"><strong>Add ${money(remaining)} more for free delivery.</strong><span>You're ${Math.round(percent)}% of the way there.</span></div><div class="progress-track"><i style="width:${percent}%"></i></div>`
    : `<div class="progress-copy"><strong>🎉 You've unlocked free delivery.</strong><span>Your order qualifies for complimentary shipping.</span></div><div class="progress-track"><i style="width:100%"></i></div>`;
}

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">○</div>
        <h2>Your bag is empty.</h2>
        <p>Add a pair and it will appear here.</p>
        <a class="btn" href="products.html">Shop sneakers →</a>
      </div>`;
    return;
  }

  container.innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    return `
      <article class="cart-item">
        <div class="mini-shoe">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="cart-item-info">
          <span class="eyebrow">${product.color}</span>
          <h3>${product.name}</h3>
          <p>${money(product.price)}</p>
          <div class="cart-controls">
            <button type="button" aria-label="Decrease quantity" onclick="changeQty(${product.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button type="button" aria-label="Increase quantity" onclick="changeQty(${product.id}, 1)">+</button>
          </div>
          <button class="remove-item" type="button" onclick="removeFromCart(${product.id})">Remove</button>
        </div>
        <strong class="cart-item-total">${money(product.price * item.qty)}</strong>
      </article>`;
  }).join("");
}


function renderCartSummary() {
  const summary = document.getElementById("cart-summary");
  if (!summary) return;

  if (!cart.length) {
    summary.innerHTML = `
      <div class="summary-top">
        <span class="eyebrow">YOUR BAG</span>
        <h2>Ready when you are.</h2>
      </div>
      <p class="summary-note">Your selected sneakers will appear here.</p>`;
    return;
  }

  const subtotal = getCartTotal();
  const delivery = subtotal >= FREE_SHIPPING ? 0 : 149;
  const total = subtotal + delivery;

  summary.innerHTML = `
    <div class="summary-top"><span class="eyebrow">YOUR BAG</span><h2>Order summary</h2></div>
    ${cart.map(item => {
      const product = getProduct(item.id);
      return `<div class="summary-product">
        <img src="${product.image}" alt="${product.name}">
        <div><strong>${product.name}</strong><span>${item.qty} × ${money(product.price)}</span></div>
        <b>${money(product.price * item.qty)}</b>
      </div>`;
    }).join("")}
    <div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="summary-row"><span>Delivery</span><span>${delivery ? money(delivery) : "Free"}</span></div>
    <div class="summary-row total"><span>Total</span><span>${money(total)}</span></div>
    <a class="btn full-btn" href="payment.html">Continue to checkout →</a>`;
}

function renderPaymentSummary() {
  const summary = document.getElementById("payment-summary");
  if (!summary) return;
  if (!cart.length) {
    summary.innerHTML = `<h2>Your bag is empty.</h2><p>Add sneakers before checking out.</p><a class="btn" href="products.html">Shop sneakers</a>`;
    return;
  }
  const total = getCartTotal();
  const delivery = total >= FREE_SHIPPING ? 0 : 149;
  summary.innerHTML = `<div class="summary-top"><span class="eyebrow">YOUR ORDER</span><h2>Almost yours.</h2></div>
    ${cart.map(item => { const p = getProduct(item.id); return `<div class="summary-product"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><span>${item.qty} × ${money(p.price)}</span></div><b>${money(p.price * item.qty)}</b></div>`; }).join("")}
    <div class="summary-row"><span>Delivery</span><span>${delivery ? money(delivery) : "Free"}</span></div>
    <div class="summary-row total"><span>Total</span><span>${money(total + delivery)}</span></div>
    <p class="summary-note">🔒 Front-end academic demo. Do not enter real card details.</p>`;
}


function setupNewsletter() {
  const form = document.getElementById("newsletter-form");
  const message = document.getElementById("newsletter-message");
  if (!form || !message || form.dataset.bound) return;

  form.dataset.bound = "true";
  form.addEventListener("submit", event => {
    event.preventDefault();
    message.textContent = "Thanks — you're on the list for this demo.";
    form.reset();
  });
}

function setupPayment() {
  const form = document.getElementById("payment-form");
  if (!form || form.dataset.bound) return;

  form.dataset.bound = "true";
  form.addEventListener("submit", validatePayment);
}

function validatePayment(event) {
  event.preventDefault();
  const message = document.getElementById("payment-message");
  if (!message) return;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const card = document.getElementById("card").value.replace(/\s/g, "").trim();
  const expiry = document.getElementById("expiry").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  message.className = "message";
  message.textContent = "";

  if (!cart.length) return message.textContent = "Your bag is empty. Add a product first.";
  if (name.length < 3) return message.textContent = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return message.textContent = "Please enter a valid email address.";
  if (!/^\d{10}$/.test(phone)) return message.textContent = "Phone number must contain 10 digits.";
  if (address.length < 10) return message.textContent = "Please enter a complete delivery address.";
  if (!/^\d{16}$/.test(card)) return message.textContent = "Card number must contain 16 digits.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return message.textContent = "Expiry must use MM/YY format.";
  if (!/^\d{3}$/.test(cvv)) return message.textContent = "CVV must contain 3 digits.";

  message.classList.add("success");
  message.textContent = "Order placed successfully! Your demo order has been confirmed.";
  cart = [];
  saveCart();
  event.target.reset();
  renderPaymentSummary();
  renderShippingProgress();
}

function openProductGallery(id) {
  const product = getProduct(Number(id));
  if (!product) return;

  let modal = document.getElementById("product-gallery-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "product-gallery-modal";
    modal.className = "gallery-modal";
    modal.innerHTML = `
      <div class="gallery-backdrop" onclick="closeProductGallery()"></div>
      <div class="gallery-dialog simple-product-modal" role="dialog" aria-modal="true" aria-label="Product details">
        <button class="gallery-close" type="button" aria-label="Close product details" onclick="closeProductGallery()">×</button>
        <div class="simple-product-image">
          <img id="gallery-main" src="" alt="">
        </div>
        <div class="simple-product-info">
          <span id="gallery-color" class="eyebrow"></span>
          <h2 id="gallery-title"></h2>
          <p id="gallery-rating"></p>
          <strong id="gallery-price"></strong>
          <button id="gallery-add" class="btn full-btn" type="button">Add to bag →</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  window.currentGallery = { product };
  renderGallery();
  modal.classList.add("open");
  document.body.classList.add("modal-open");
}

function renderGallery() {
  const state = window.currentGallery;
  if (!state) return;

  const product = state.product;
  const main = document.getElementById("gallery-main");
  const title = document.getElementById("gallery-title");
  const color = document.getElementById("gallery-color");
  const rating = document.getElementById("gallery-rating");
  const price = document.getElementById("gallery-price");
  const add = document.getElementById("gallery-add");

  main.src = product.image;
  main.alt = product.name;
  title.textContent = product.name;
  color.textContent = `${product.color} • SOLE STREET`;
  rating.textContent = `★★★★★ ${product.rating}  •  ${product.reviews} reviews`;
  price.textContent = money(product.price);

  add.onclick = () => {
    addToCart(product.id);
    closeProductGallery();
  };
}

function closeProductGallery() {
  const modal = document.getElementById("product-gallery-modal");
  if (modal) modal.classList.remove("open");
  document.body.classList.remove("modal-open");
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeProductGallery();
});

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  updateCartCount();
  setupNavigation();
  setupNewsletter();

  if (document.getElementById("product-list")) {
    const params = new URLSearchParams(window.location.search);
    const urlSort = params.get("sort");
    if (urlSort === "low" || urlSort === "high" || urlSort === "name") sortMode = urlSort;

    renderProducts();
    setupFilters();

    const sort = document.getElementById("sort-products");
    if (sort) sort.value = sortMode;
  }

  if (document.getElementById("cart-items")) {
    renderCart();
    renderCartSummary();
    renderShippingProgress();
  }

  if (document.getElementById("payment-summary")) {
    renderPaymentSummary();
    setupPayment();
  }
});

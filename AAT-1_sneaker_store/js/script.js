const products = [
  { id: 1, name: "Street Runner", price: 2499, color: "Black", emoji: "👟" },
  { id: 2, name: "Urban White", price: 2799, color: "White", emoji: "👟" },
  { id: 3, name: "Campus Classic", price: 1999, color: "Blue", emoji: "👟" },
  { id: 4, name: "Daily Flex", price: 2299, color: "Grey", emoji: "👟" },
  { id: 5, name: "Sport Edge", price: 3199, color: "Red", emoji: "👟" },
  { id: 6, name: "Retro Walk", price: 2899, color: "Green", emoji: "👟" }
];

let cart = [];

try {
  const savedCart = localStorage.getItem("sneakerCart");
  cart = savedCart ? JSON.parse(savedCart) : [];
  if (!Array.isArray(cart)) cart = [];
} catch (error) {
  console.log("Could not load cart:", error);
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem("sneakerCart", JSON.stringify(cart));
  } catch (error) {
    console.log("Could not save cart:", error);
  }
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
}

function addToCart(id) {
  id = Number(id);
  const existing = cart.find(item => Number(item.id) === id);

  if (existing) {
    existing.qty = Number(existing.qty) + 1;
  } else {
    cart.push({ id: id, qty: 1 });
  }

  saveCart();
  alert("Sneaker added to cart!");
}

function renderProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  list.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="shoe-img">${p.emoji}</div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.color} | Everyday sneaker</p>
        <p class="price">₹${p.price.toLocaleString("en-IN")}</p>
        <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </article>
  `).join("");
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = products.find(p => p.id === Number(item.id));
    return total + product.price * item.qty;
  }, 0);
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  if (!container || !summary) return;

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty"><h2>Your cart is empty</h2><p>Add some sneakers to continue.</p><br><a class="btn" href="products.html">View Products</a></div>`;
    summary.innerHTML = "";
    return;
  }

  container.innerHTML = cart.map(item => {
    const p = products.find(product => product.id === Number(item.id));
    return `
      <div class="cart-item">
        <div class="mini-shoe">${p.emoji}</div>
        <div class="cart-item-info">
          <h3>${p.name}</h3>
          <p>₹${p.price.toLocaleString("en-IN")} each</p>
          <div class="qty">
            <button onclick="changeQty(${p.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${p.id}, 1)">+</button>
          </div>
          <button class="remove" onclick="removeItem(${p.id})">Remove</button>
        </div>
        <b>₹${(p.price * item.qty).toLocaleString("en-IN")}</b>
      </div>
    `;
  }).join("");

  const total = getCartTotal();
  summary.innerHTML = `
    <h2>Order Summary</h2>
    <div class="summary-row"><span>Subtotal</span><span>₹${total.toLocaleString("en-IN")}</span></div>
    <div class="summary-row"><span>Delivery</span><span>Free</span></div>
    <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString("en-IN")}</span></div>
    <a class="btn" href="payment.html">Proceed to Payment</a>
  `;
}

function changeQty(id, amount) {
  id = Number(id);
  const item = cart.find(i => Number(i.id) === id);
  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function removeItem(id) {
  id = Number(id);
  cart = cart.filter(i => Number(i.id) !== id);
  saveCart();
  renderCart();
}

function renderPaymentSummary() {
  const summary = document.getElementById("payment-summary");
  if (!summary) return;

  if (cart.length === 0) {
    summary.innerHTML = `<h2>No Items</h2><p>Your cart is empty.</p><a class="btn" href="products.html">Shop Now</a>`;
    return;
  }

  const total = getCartTotal();
  summary.innerHTML = `
    <h2>Your Order</h2>
    ${cart.map(item => {
      const p = products.find(product => product.id === Number(item.id));
      return `<div class="summary-row"><span>${p.name} × ${item.qty}</span><span>₹${(p.price * item.qty).toLocaleString("en-IN")}</span></div>`;
    }).join("")}
    <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString("en-IN")}</span></div>
  `;
}

function validatePayment(event) {
  event.preventDefault();
  const message = document.getElementById("payment-message");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const card = document.getElementById("card").value.trim();
  const expiry = document.getElementById("expiry").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

  if (cart.length === 0) {
    message.textContent = "Your cart is empty.";
    return;
  }
  if (name.length < 3) { message.textContent = "Please enter your full name."; return; }
  if (!emailPattern.test(email)) { message.textContent = "Please enter a valid email address."; return; }
  if (!/^\d{10}$/.test(phone)) { message.textContent = "Phone number must contain 10 digits."; return; }
  if (address.length < 10) { message.textContent = "Please enter a complete delivery address."; return; }
  if (!/^\d{16}$/.test(card)) { message.textContent = "Card number must contain 16 digits."; return; }
  if (!expiryPattern.test(expiry)) { message.textContent = "Expiry must be in MM/YY format."; return; }
  if (!/^\d{3}$/.test(cvv)) { message.textContent = "CVV must contain 3 digits."; return; }

  message.classList.add("success");
  message.textContent = "Order placed successfully! Thank you for shopping.";
  cart = [];
  saveCart();
  event.target.reset();
  renderPaymentSummary();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProducts();
  renderCart();
  renderPaymentSummary();

  const form = document.getElementById("payment-form");
  if (form) form.addEventListener("submit", validatePayment);
});

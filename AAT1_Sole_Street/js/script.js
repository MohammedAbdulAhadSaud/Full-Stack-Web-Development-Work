const products = [
  { id: 1, name: "Street Runner", price: 2499, color: "Black", image: "https://images.pexels.com/photos/4932920/pexels-photo-4932920.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 2, name: "Urban White", price: 2799, color: "White", image: "https://images.pexels.com/photos/12739984/pexels-photo-12739984.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 3, name: "Campus Classic", price: 1999, color: "Blue", image: "https://images.pexels.com/photos/1461538/pexels-photo-1461538.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 4, name: "Daily Flex", price: 2299, color: "Red", image: "https://images.pexels.com/photos/10566011/pexels-photo-10566011.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 5, name: "Sport Edge", price: 3199, color: "White", image: "https://images.pexels.com/photos/6748354/pexels-photo-6748354.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: 6, name: "Retro Walk", price: 2899, color: "Red & White", image: "https://images.pexels.com/photos/6237590/pexels-photo-6237590.jpeg?auto=compress&cs=tinysrgb&w=900" }
];





function renderProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  list.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="shoe-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.color} | Everyday sneaker</p>
        <p class="price">₹${Number(product.price).toLocaleString("en-IN")}</p>
        <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </article>
  `).join("");
}

function loadCart() {
  try {
    const savedCart = localStorage.getItem("sneakerCart");
    if (!savedCart) return [];

    const parsed = JSON.parse(savedCart);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(item => ({
        id: Number(item.id),
        qty: Number(item.qty)
      }))
      .filter(item =>
        Number.isInteger(item.id) &&
        item.qty > 0 &&
        products.some(product => Number(product.id) === item.id)
      );
  } catch (error) {
    console.log("Could not load cart:", error);
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  try {
    localStorage.setItem("sneakerCart", JSON.stringify(cart));
  } catch (error) {
    console.log("Could not save cart:", error);
  }
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + Number(item.qty), 0);
  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = count;
  });
}

function getProduct(id) {
  return products.find(product => Number(product.id) === Number(id));
}

function addToCart(id) {
  id = Number(id);
  const product = getProduct(id);
  if (!product) return;

  const existing = cart.find(item => Number(item.id) === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: id, qty: 1 });
  }

  saveCart();
  alert((product.name || "Product") + " added to cart!");
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);
    if (!product) return total;
    return total + Number(product.price) * Number(item.qty);
  }, 0);
}

function changeQty(id, amount) {
  id = Number(id);

  const item = cart.find(cartItem => Number(cartItem.id) === id);
  if (!item) return;

  item.qty += Number(amount);

  if (item.qty <= 0) {
    cart = cart.filter(cartItem => Number(cartItem.id) !== id);
  }

  saveCart();
  renderCart();
  renderPaymentSummary();
}

function removeItem(id) {
  id = Number(id);
  cart = cart.filter(item => Number(item.id) !== id);

  saveCart();
  renderCart();
  renderPaymentSummary();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");

  if (!container || !summary) return;

  // Remove only invalid saved entries. Original products remain untouched.
  cart = cart.filter(item =>
    getProduct(item.id) && Number(item.qty) > 0
  );
  saveCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <h2>Your cart is empty</h2>
        <p>Add some sneakers to continue.</p>
        <br>
        <a class="btn" href="products.html">View Products</a>
      </div>
    `;
    summary.innerHTML = "";
    return;
  }

  container.innerHTML = cart.map(item => {
    const product = getProduct(item.id);

    // Use the original product image if the project has one.
    const visual = product.image
      ? `<img src="${product.image}" alt="${product.name}" style="max-width:90px;max-height:70px;object-fit:contain;">`
      : (product.img
        ? `<img src="${product.img}" alt="${product.name}" style="max-width:90px;max-height:70px;object-fit:contain;">`
        : (product.emoji || "👟"));

    return `
      <div class="cart-item">
        <div class="mini-shoe">${visual}</div>

        <div class="cart-item-info">
          <h3>${product.name}</h3>
          <p>₹${Number(product.price).toLocaleString("en-IN")} each</p>

          <div class="qty">
            <button onclick="changeQty(${Number(product.id)}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${Number(product.id)}, 1)">+</button>
          </div>

          <button class="remove" onclick="removeItem(${Number(product.id)})">
            Remove
          </button>
        </div>

        <b>₹${(Number(product.price) * Number(item.qty)).toLocaleString("en-IN")}</b>
      </div>
    `;
  }).join("");

  const total = getCartTotal();

  summary.innerHTML = `
    <h2>Order Summary</h2>
    <div class="summary-row">
      <span>Subtotal</span>
      <span>₹${total.toLocaleString("en-IN")}</span>
    </div>

    <div class="summary-row">
      <span>Delivery</span>
      <span>Free</span>
    </div>

    <div class="summary-row total">
      <span>Total</span>
      <span>₹${total.toLocaleString("en-IN")}</span>
    </div>

    <a class="btn" href="payment.html">Proceed to Payment</a>
  `;
}

function renderPaymentSummary() {
  const summary = document.getElementById("payment-summary");
  if (!summary) return;

  if (cart.length === 0) {
    summary.innerHTML = `
      <h2>No Items</h2>
      <p>Your cart is empty.</p>
      <a class="btn" href="products.html">Shop Now</a>
    `;
    return;
  }

  const total = getCartTotal();

  summary.innerHTML = `
    <h2>Your Order</h2>
    ${cart.map(item => {
      const product = getProduct(item.id);
      return `
        <div class="summary-row">
          <span>${product.name} × ${item.qty}</span>
          <span>₹${(Number(product.price) * Number(item.qty)).toLocaleString("en-IN")}</span>
        </div>
      `;
    }).join("")}
    <div class="summary-row total">
      <span>Total</span>
      <span>₹${total.toLocaleString("en-IN")}</span>
    </div>
  `;
}

function validatePayment(event) {
  event.preventDefault();

  const message = document.getElementById("payment-message");
  if (!message) return;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const card = document.getElementById("card").value.trim();
  const expiry = document.getElementById("expiry").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

  message.classList.remove("success");
  message.textContent = "";

  if (cart.length === 0) {
    message.textContent = "Your cart is empty.";
    return;
  }

  if (name.length < 3) {
    message.textContent = "Please enter your full name.";
    return;
  }

  if (!emailPattern.test(email)) {
    message.textContent = "Please enter a valid email address.";
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    message.textContent = "Phone number must contain 10 digits.";
    return;
  }

  if (address.length < 10) {
    message.textContent = "Please enter a complete delivery address.";
    return;
  }

  if (!/^\d{16}$/.test(card)) {
    message.textContent = "Card number must contain 16 digits.";
    return;
  }

  if (!expiryPattern.test(expiry)) {
    message.textContent = "Expiry must be in MM/YY format.";
    return;
  }

  if (!/^\d{3}$/.test(cvv)) {
    message.textContent = "CVV must contain 3 digits.";
    return;
  }

  message.classList.add("success");
  message.textContent = "Order placed successfully! Thank you for shopping.";

  cart = [];
  saveCart();

  event.target.reset();
  renderPaymentSummary();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  if (typeof renderProducts === "function") {
    renderProducts();
  }

  renderCart();
  renderPaymentSummary();

  const form = document.getElementById("payment-form");
  if (form) {
    form.addEventListener("submit", validatePayment);
  }
});

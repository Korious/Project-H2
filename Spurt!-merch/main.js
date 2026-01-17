// ====== Elements ======
const cartIcon = document.getElementById("cart");
const cartList = document.getElementById("cartList");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutForm = document.getElementById("checkoutForm");
const popup = document.getElementById("cartPopup");
const popupMessage = document.getElementById("popupMessage");
const closePopupBtn = document.querySelector(".close-popup");

// ====== Sheet2API endpoint ======
const SHEET2API_URL = "https://sheet2api.com/v1/6ifPMuBORP2y/demo-spreadsheet/Spurt%20Merch%20and%20Games";
// ====== Cart Storage ======
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ====== Helper Functions ======
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<li>Your cart is empty.</li>";
  } else {
    cart.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
      cartItemsContainer.appendChild(li);
      total += item.price * item.quantity;
    });
  }

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = "flex";
  setTimeout(() => popup.style.display = "none", 2000);
}

// ====== Add to Cart ======
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.item || "Item";
    const price = Number(button.dataset.price) || 0;

    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    renderCart();
    showPopup(`${name} added to cart!`);

    if (window.clarity) clarity("event", "add_to_cart", { item: name });
  });
});

// ====== Toggle Cart Panel ======
cartIcon.addEventListener("click", e => {
  e.preventDefault();
  cartList.style.display = cartList.style.display === "block" ? "none" : "block";
  renderCart();
});

// ====== Close Popup ======
closePopupBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// ====== Checkout Form Submission ======
checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();

  if (!name || !email) {
    alert("Please enter your name and email.");
    return;
  }

  // Prepare cart items as string
  const itemsString = cart.map(i => `${i.name} x${i.quantity}`).join(", ");
 const total = Number(
  cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
);

  // Send data to Sheet2API
  try {
    const response = await fetch(SHEET2API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: name,
        Email: email,
        Items: itemsString,
        Total: total
      })
    });

    if (!response.ok) throw new Error("Failed to submit pre-order");

    // Clarity tracking
    cart.forEach(item => clarity?.("event", "begin_checkout", { item: item.name }));
    clarity?.("event", "checkout_completed", { name, email });

    alert(`Thanks, ${name}! Your pre-order has been recorded.`);

    // Clear cart
    cart = [];
    saveCart();
    renderCart();
    checkoutForm.reset();
    cartList.style.display = "none";
  } catch (error) {
    console.error(error);
    alert("Sorry, there was an error recording your pre-order. Please try again later.");
  }
});

// ====== Initialise cart on page load ======
document.addEventListener("DOMContentLoaded", renderCart);
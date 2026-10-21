
const products = [
  {
    id: 1,
    name: "Butterscotch Latte",
    category: "Kopi",
    price: 28000,
    description: "Espresso, susu creamy, dan sentuhan butterscotch.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
    badge: "BEST SELLER"
  },
  {
    id: 2,
    name: "Caramel Macchiato",
    category: "Kopi",
    price: 30000,
    description: "Kopi espresso dengan susu dan saus karamel.",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=700&q=80",
    badge: "FAVORIT"
  },
  {
    id: 3,
    name: "Matcha Cloud",
    category: "Non-Kopi",
    price: 27000,
    description: "Matcha lembut dengan susu segar yang creamy.",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=700&q=80",
    badge: "MUST TRY"
  },
  {
    id: 4,
    name: "Strawberry Milk",
    category: "Non-Kopi",
    price: 24000,
    description: "Susu segar berpadu dengan rasa stroberi manis.",
    image: "https://images.unsplash.com/photo-1553787499-6f913324f6d5?auto=format&fit=crop&w=700&q=80",
    badge: "FRESH"
  },
  {
    id: 5,
    name: "Creamy Carbonara",
    category: "Makanan",
    price: 38000,
    description: "Pasta creamy dengan keju dan bumbu gurih.",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=700&q=80",
    badge: "COMFORT FOOD"
  },
  {
    id: 6,
    name: "Classic Croissant",
    category: "Camilan",
    price: 18000,
    description: "Pastry renyah berlapis dengan aroma butter.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80",
    badge: "FRESH BAKE"
  },
  {
    id: 7,
    name: "Chicken Rice Bowl",
    category: "Makanan",
    price: 32000,
    description: "Nasi hangat dengan ayam gurih dan saus spesial.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80",
    badge: "FAVORIT"
  },
  {
    id: 8,
    name: "Chocolate Brownies",
    category: "Camilan",
    price: 20000,
    description: "Brownies cokelat lembut dengan rasa yang kaya.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80",
    badge: "SWEET TREAT"
  },
  {
    id: 9,
    name: "Americano",
    category: "Kopi",
    price: 22000,
    description: "Espresso dengan air, simpel dan menyegarkan.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80",
    badge: "COFFEE CLASSIC"
  }
];

// GANTI dengan nomor WhatsApp kafe.
// Gunakan kode negara 62 tanpa tanda + atau angka 0 di depan.
const CAFE_WHATSAPP = "628818482175";

const rupiah = amount =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);

const menuGrid = document.getElementById("menuGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const categoryList = document.getElementById("categoryList");
const resultCount = document.getElementById("resultCount");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

let activeCategory = "Semua";
let cart = [];
let toastTimeout;

document.getElementById("year").textContent =
  new Date().getFullYear();

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderProducts() {
  const keyword = searchInput.value.trim().toLowerCase();

  let filtered = products.filter(product => {
    const matchesCategory =
      activeCategory === "Semua" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword);

    return matchesCategory && matchesSearch;
  });

  switch (sortSelect.value) {
    case "low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name, "id"));
      break;
  }

  resultCount.textContent =
    `Menampilkan ${filtered.length} dari ${products.length} menu`;

  if (filtered.length === 0) {
    menuGrid.innerHTML = `
      <div class="empty-state">
        <div>🔎</div>
        <h3>Menu tidak ditemukan</h3>
        <p>Coba kata kunci lain atau pilih kategori berbeda.</p>
      </div>`;
    return;
  }

  menuGrid.innerHTML = filtered.map(product => `
    <article class="menu-card">
      <div class="menu-photo-wrap">
        <img
          class="menu-photo"
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy">
        <span class="menu-category-label">
          ${escapeHTML(product.badge)}
        </span>
      </div>

      <div class="menu-content">
        <div class="menu-title-row">
          <h3 class="menu-title">${escapeHTML(product.name)}</h3>
          <span class="menu-price">${rupiah(product.price)}</span>
        </div>

        <p class="menu-description">
          ${escapeHTML(product.description)}
        </p>

        <button class="add-button" data-add="${product.id}">
          <span>+</span> Tambah ke keranjang
        </button>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("visible");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2300);
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} ditambahkan ♡`);
}

function changeQuantity(productId, change) {
  const item = cart.find(product => product.id === productId);
  if (!item) return;

  item.quantity += change;
  cart = cart.filter(product => product.quantity > 0);

  renderCart();
}

function renderCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = rupiah(totalPrice);
  checkoutButton.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div style="font-size:36px">🛍️</div>
        <p>Keranjangmu masih kosong.</p>
        Yuk, temukan menu favoritmu!
      </div>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h4>${escapeHTML(item.name)}</h4>
        <span class="cart-item-price">
          ${rupiah(item.price * item.quantity)}
        </span>

        <div class="quantity-controls">
          <button data-change="${item.id}" data-delta="-1"
            aria-label="Kurangi ${escapeHTML(item.name)}">−</button>
          <span>${item.quantity}</span>
          <button data-change="${item.id}" data-delta="1"
            aria-label="Tambah ${escapeHTML(item.name)}">+</button>
        </div>
      </div>
      <span style="font-size:11px;color:#8c8075">
        ${rupiah(item.price)} / item
      </span>
    </div>
  `).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.getElementById("openCart").focus();
}

// Filter kategori
categoryList.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  categoryList.querySelectorAll(".category").forEach(category => {
    category.classList.toggle("active", category === button);
  });

  renderProducts();
});

// Pencarian dan pengurutan
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

// Delegasi tombol tambah menu
menuGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

// Delegasi kontrol jumlah di keranjang
cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (!button) return;

  changeQuantity(
    Number(button.dataset.change),
    Number(button.dataset.delta)
  );
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) {
    closeCart();
  }

  // Shortcut "/" untuk langsung mencari menu.
  if (
    event.key === "/" &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
  ) {
    event.preventDefault();
    searchInput.focus();
  }
});

// Buat pesan WhatsApp dari keranjang.
checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) return;

  if (!/^62\d{8,15}$/.test(CAFE_WHATSAPP)) {
    showToast("628818482175");
    return;
  }

  const table = document.getElementById("tableNumber").value.trim();
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const lines = cart.map((item, index) =>
    `${index + 1}. ${item.name} x${item.quantity} = ${rupiah(item.price * item.quantity)}`
  );

  const message = [
    "Halo MenuFlex! Saya ingin memesan:",
    "",
    ...lines,
    "",
    `Nomor meja: ${table || "Belum ditentukan"}`,
    `Total: ${rupiah(total)}`,
    "",
    "Mohon konfirmasi ketersediaan dan pesanan saya. Terima kasih!"
  ].join("\n");

  const whatsappURL =
    `https://wa.me/${CAFE_WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

// Inisialisasi tampilan
renderProducts();
renderCart();

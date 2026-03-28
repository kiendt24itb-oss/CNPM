const products = [
  {
    id: 1,
    name: "Bánh Cheesecake Chanh Dây",
    price: "45.000đ",
    icon: "🍰",
    cat: "banh",
    label: "Tên sản phẩm",
  },
  {
    id: 2,
    name: "Cà Phê Sữa Đá",
    price: "45.000đ",
    icon: "☕",
    cat: "caphe",
    label: "Tên sản phẩm",
  },
  {
    id: 3,
    name: "Cà Phê Sữa Đá",
    price: "45.000đ",
    icon: "🥤",
    cat: "caphe",
    label: "Tên sản phẩm",
  },
  {
    id: 4,
    name: "Bánh Cheesecake Chanh Dây",
    price: "45.000đ",
    icon: "🍰",
    cat: "banh",
    label: "Tên sản phẩm",
  },
  {
    id: 5,
    name: "Cà Phê Trà",
    price: "45.000đ",
    icon: "🥤",
    cat: "tra",
    label: "Tên sản phẩm",
  },
  {
    id: 6,
    name: "Cà Phê Sữa",
    price: "45.000đ",
    icon: "🥤",
    cat: "caphe",
    label: "Tên sản phẩm",
  },
  {
    id: 7,
    name: "Trà Đào Cam Sả",
    price: "40.000đ",
    icon: "🍑",
    cat: "tra",
    label: "Tên sản phẩm",
  },
  {
    id: 8,
    name: "Cà Phê Đen",
    price: "35.000đ",
    icon: "☕",
    cat: "caphe",
    label: "Tên sản phẩm",
  },
  {
    id: 9,
    name: "Bánh Su Kem",
    price: "30.000đ",
    icon: "🧁",
    cat: "banh",
    label: "Tên sản phẩm",
  },
];

let currentCat = "all";
let searchTerm = "";

function renderMenu() {
  const grid = document.getElementById("menuGrid");
  const filtered = products.filter((p) => {
    const catMatch = currentCat === "all" || p.cat === currentCat;
    const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return catMatch && searchMatch;
  });

  grid.innerHTML = filtered
    .map(
      (p) => `
    <div class="card" id="card-${p.id}">
      <div class="card-header">
        <div class="card-icon">${p.icon}</div>
        <div class="card-info">
          <div class="card-label">${p.label}</div>
          <div class="card-name">${p.name}</div>
          <div class="card-price">${p.price}</div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-view" onclick="viewProduct(${p.id})">👁 Xem</button>
        <button class="btn-add" onclick="addToOrder(${p.id}, '${p.name}')">＋ Thêm vào đơn</button>
      </div>
    </div>
  `,
    )
    .join("");
}

function filterCat(cat, btn) {
  currentCat = cat;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderMenu();
}

function filterMenu(val) {
  searchTerm = val;
  renderMenu();
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function addToOrder(id, name) {
  showToast("✓ Đã thêm: " + name);
}

function viewProduct(id) {
  const p = products.find((x) => x.id === id);
  showToast("👁 Xem: " + p.name + " — " + p.price);
}

function newOrder() {
  showToast("📋 Đã tạo đơn hàng mới!");
}

function initMenuPage() {
  renderMenu();
}

window.initMenuPage = initMenuPage;
window.filterCat = filterCat;
window.filterMenu = filterMenu;
window.addToOrder = addToOrder;
window.viewProduct = viewProduct;
window.newOrder = newOrder;

// ===== DATA =====
const products = [
  {
    id: 1,
    name: "Bánh Cheesecake Chanh Dây",
    price: 45000,
    category: "Bánh",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Cà Phê Sữa Đá",
    price: 45000,
    category: "Cà phê",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Cà Phê Sữa Đá",
    price: 45000,
    category: "Cà phê",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Cà Phê Đen Đá",
    price: 45000,
    category: "Cà phê",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Cà Phê Sữa Đá",
    price: 45000,
    category: "Cà phê",
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=100&h=100&fit=crop",
  },
  {
    id: 6,
    name: "Bánh Cheesecake Chanh Dây",
    price: 45000,
    category: "Bánh",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop",
  },
  {
    id: 7,
    name: "Cà Phê Sữa Đá",
    price: 45000,
    category: "Cà phê",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop",
  },
  {
    id: 8,
    name: "Cà Phê Trà",
    price: 45000,
    category: "Cà phê",
    image:
      "https://images.unsplash.com/photo-1497636577773-f1231844b336?w=100&h=100&fit=crop",
  },
  {
    id: 9,
    name: "Cà Phê Sữa Đá",
    price: 45000,
    category: "Cà phê",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=100&h=100&fit=crop",
  },
  {
    id: 10,
    name: "Bánh Cheesecake Chanh Dây",
    price: 45000,
    category: "Bánh",
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=100&h=100&fit=crop",
  },
  {
    id: 11,
    name: "Cà Phê Sữa Đá",
    price: 45000,
    category: "Cà phê",
    image:
      "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=100&h=100&fit=crop",
  },
  {
    id: 12,
    name: "Cà Phê Trà Đá",
    price: 45000,
    category: "Trà",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop",
  },
  {
    id: 13,
    name: "Trà Đào",
    price: 45000,
    category: "Trà",
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=100&h=100&fit=crop",
  },
];

// ===== UTIL =====
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "đ";
}

// ===== RENDER =====
function renderProducts(productList) {
  const grid = document.getElementById("productGrid");
  if (!grid) return; // tránh lỗi khi DOM chưa có

  grid.innerHTML = "";

  productList.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-header">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <div class="product-label">Tên sản phẩm</div>
          <div class="product-name">${product.name}</div>
          <div class="product-price">${formatPrice(product.price)}</div>
        </div>
      </div>
      <div class="product-actions">
        <button class="btn-view" data-id="${product.id}">👁 Xem</button>
        <div class="action-row">
          <button class="btn-edit" data-id="${product.id}">✏️ Sửa</button>
          <button class="btn-delete" data-id="${product.id}">🗑️ Xoá</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  const total = document.getElementById("totalProducts");
  if (total) total.textContent = productList.length;
}

// ===== FILTER =====
function filterProducts() {
  const searchInput = document.getElementById("searchInput");
  const categoryEl = document.getElementById("selectedCategory");

  if (!searchInput || !categoryEl) return;

  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryEl.textContent;

  let filtered = products;

  if (category !== "Tất cả") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (searchTerm) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchTerm),
    );
  }

  renderProducts(filtered);
}

// ===== INIT (QUAN TRỌNG NHẤT) =====
function initMenu() {
  renderProducts(products);
}

// expose ra global để index.js gọi
window.initMenu = initMenu;
window.filterProducts = filterProducts;
window.toggleDropdown = function () {
  document.getElementById("dropdownMenu")?.classList.toggle("show");
};
window.selectCategory = function (category) {
  document.getElementById("selectedCategory").textContent = category;
  document.getElementById("dropdownMenu").classList.remove("show");
  filterProducts();
};
window.addProduct = function () {
  alert("Mở form thêm sản phẩm mới");
};

// ===== EVENT (KHÔNG BỊ NHÂN ĐÔI) =====
if (!window._menuInit) {
  document.addEventListener("click", (e) => {
    // dropdown close
    if (!e.target.closest(".dropdown-container")) {
      document.getElementById("dropdownMenu")?.classList.remove("show");
    }

    // button actions
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("btn-view")) {
      alert("Xem ID: " + id);
    }

    if (e.target.classList.contains("btn-edit")) {
      alert("Sửa ID: " + id);
    }

    if (e.target.classList.contains("btn-delete")) {
      if (confirm("Xoá?")) {
        alert("Đã xoá ID: " + id);
      }
    }
  });

  window._menuInit = true;
}

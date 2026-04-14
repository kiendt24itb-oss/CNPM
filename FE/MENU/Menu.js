// ===== CONFIG =====
const API_URL = "../../BE/api/menu.php";
let productStore = [];

// ===== UTIL =====
function formatPrice(price) {
  // Chuyển về số trước khi format nếu price là string
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return numericPrice.toLocaleString("vi-VN") + "đ";
}

// ===== RENDER =====
// Thay vì dùng biến 'products' fix cứng, ta sẽ dùng dữ liệu từ API
function renderProducts(productList) {
  productStore = productList; // 👈 thêm dòng này
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = "";

  // Nếu không có sản phẩm nào
  if (productList.length === 0) {
    grid.innerHTML =
      "<p style='text-align:center; grid-column: 1/-1;'>Không tìm thấy sản phẩm nào.</p>";
  }

  productList.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    // Mapping đúng tên cột từ Database: menu_id, name, price, image
    card.innerHTML = `
      <div class="product-header">
        <div class="product-image">
          <img src="../../assets/img/products/${product.image || "default.png"}" alt="${product.name}">
        </div>
        <div class="product-info">
          <div class="product-label">Tên sản phẩm</div>
          <div class="product-name">${product.name}</div>
          <div class="product-price">${formatPrice(product.price)}</div>
        </div>
      </div>
      <div class="product-actions">
        <button class="btn-view" data-id="${product.menu_id}">
          <i class="fa-regular fa-eye" data-id="${product.menu_id}"></i> Xem
        </button>
        <div class="action-row">
          <button class="btn-edit" data-id="${product.menu_id}">
            <i class="fa-solid fa-pen-to-square" data-id="${product.menu_id}"></i> Sửa
          </button>
          <button class="btn-delete" data-id="${product.menu_id}">
            <i class="fa-solid fa-trash-can" data-id="${product.menu_id}"></i> Xoá
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  const total = document.getElementById("totalProducts");
  if (total) total.textContent = productList.length;
}

// ===== API CALLS =====
async function fetchProducts(params = "") {
  try {
    const response = await fetch(`${API_URL}${params}`);
    const result = await response.json();
    if (result.success) {
      renderProducts(result.data);
    } else {
      console.error("Lỗi lấy dữ liệu:", result.message);
    }
  } catch (error) {
    console.error("Lỗi kết nối API:", error);
  }
}

// ===== FILTER & SEARCH (GỌI API) =====
function filterProducts() {
  const searchInput = document.getElementById("searchInput");
  const categoryEl = document.getElementById("selectedCategory");

  if (!searchInput || !categoryEl) return;

  const searchTerm = searchInput.value;
  const categoryId = categoryEl.getAttribute("data-id"); // Lưu ID category vào attribute này

  let queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("search", searchTerm);
  if (categoryId && categoryId !== "all")
    queryParams.append("category_id", categoryId);

  const queryString = queryParams.toString()
    ? "?" + queryParams.toString()
    : "";
  fetchProducts(queryString);
}

// Load danh mục cho Dropdown từ Database
async function loadCategories() {
  try {
    const response = await fetch(`${API_URL}?action=form-data`);
    const result = await response.json();
    const dropdown = document.getElementById("dropdownMenu");

    if (result.success && dropdown) {
      let html = `<a href="#" onclick="selectCategory('Tất cả', 'all')">Tất cả</a>`;
      result.categories.forEach((cat) => {
        html += `<a href="#" onclick="selectCategory('${cat.category_name}', '${cat.category_id}')">${cat.category_name}</a>`;
      });
      dropdown.innerHTML = html;
    }
  } catch (error) {
    console.error("Không thể load danh mục");
  }
}

// Cập nhật hàm chọn category để lưu cả ID
window.selectCategory = function (name, id) {
  const categoryEl = document.getElementById("selectedCategory");
  categoryEl.textContent = name;
  categoryEl.setAttribute("data-id", id);
  document.getElementById("dropdownMenu").classList.remove("show");
  filterProducts();
};

// ===== CÁC HÀM UI (GIỮ NGUYÊN) =====
window.initMenu = function () {
  console.log("Menu init with API");
  loadCategories();
  fetchProducts(); // Lấy tất cả lần đầu
};

window.openFormula = function () {
  const wrapper = document.getElementById("formulaWrapper");
  const content = document.getElementById("formulaContent");
  if (!wrapper || !content) return;
  content.innerHTML = `<iframe src="../MENU/FORMULA/Formula.html" style="width: 100%; height: 85vh; border: none; border-radius: 8px;"></iframe>`;
  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden";
};

window.closeFormula = function () {
  const wrapper = document.getElementById("formulaWrapper");
  if (wrapper) {
    wrapper.style.display = "none";
    document.getElementById("formulaContent").innerHTML = "";
    document.body.style.overflow = "auto";
  }
};

window.openAddProduct = function () {
  const wrapper = document.getElementById("addProductWrapper");
  const content = document.getElementById("addProductContent");
  if (!wrapper || !content) return;
  content.innerHTML = `<iframe src="../MENU/AddProduct/AddProduct.html" style="width: 100%; height: 85vh; border: none; border-radius: 15px;"></iframe>`;
  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden";
};

window.closeAddProduct = function () {
  const wrapper = document.getElementById("addProductWrapper");
  if (wrapper) {
    wrapper.style.display = "none";
    document.getElementById("addProductContent").innerHTML = "";
    document.body.style.overflow = "auto";
    fetchProducts(); // Load lại danh sách sau khi đóng modal (phòng trường hợp vừa thêm mới)
  }
};

window.addProduct = () => openAddProduct();
window.toggleDropdown = () =>
  document.getElementById("dropdownMenu")?.classList.toggle("show");

// ===== EVENT HANDLING =====
document.addEventListener("click", async (e) => {
  if (!e.target.closest(".dropdown-container")) {
    document.getElementById("dropdownMenu")?.classList.remove("show");
  }

  const viewBtn = e.target.closest(".btn-view");
  const editBtn = e.target.closest(".btn-edit");
  const deleteBtn = e.target.closest(".btn-delete");

  // ===== VIEW =====
  if (viewBtn) {
    const id = viewBtn.dataset.id;

    const product = productStore.find((p) => p.menu_id == id);

    if (product) {
      alert(`Tên: ${product.name}\nGiá: ${formatPrice(product.price)}`);
    } else {
      alert("Không tìm thấy sản phẩm");
    }
    return;
  }

  // ===== EDIT =====
  if (editBtn) {
    const id = editBtn.dataset.id;

    const product = productStore.find((p) => p.menu_id == id);

    if (!product) {
      alert("Không tìm thấy sản phẩm");
      return;
    }

    const newName = prompt("Nhập tên mới:", product.name);
    if (newName === null) return;

    const newPrice = prompt("Nhập giá mới:", product.price);
    if (newPrice === null) return;

    // update tạm UI (frontend)
    product.name = newName;
    product.price = parseFloat(newPrice);

    alert("Cập nhật thành công (demo frontend)");

    renderProducts(productStore);
    return;
  }

  // ===== DELETE =====
  if (deleteBtn) {
    const id = deleteBtn.dataset.id;

    if (confirm("Bạn có chắc chắn muốn xoá món này?")) {
      try {
        const res = await fetch(`${API_URL}?id=${id}`, {
          method: "DELETE",
        });
        const result = await res.json();

        alert(result.message);

        if (result.success) fetchProducts();
      } catch (err) {
        alert("Lỗi khi xoá");
      }
    }
  }
});

// Chạy init
window.initMenu = function () {
  console.log("🔥 initMenu");

  loadCategories();
  fetchProducts();
};

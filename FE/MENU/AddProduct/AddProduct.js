const categoryIcons = {
  "Cà phê truyền thống": "☕",
  "Trà & Trái cây": "🍵",
  "Bánh & Tráng miệng": "🍰",
  "Đồ uống đá xay": "🍧",
};

const API_URL = "/CNPM/BE/api/menu.php";

window.onload = async function () {
  const categorySelect = document.getElementById("category");
  const recipeSelect = document.getElementById("recipe");

  try {
    const response = await fetch(`${API_URL}?action=form-data`);
    const result = await response.json();

    if (result.success) {
      // Load Categories kèm Icon
      categorySelect.innerHTML =
        '<option value="" disabled selected>📂 Chọn loại sản phẩm</option>';
      result.categories.forEach((item) => {
        let option = document.createElement("option");
        option.value = item.category_id;
        const icon = categoryIcons[item.category_name] || "📁";
        option.text = `${icon} ${item.category_name}`;
        categorySelect.appendChild(option);
      });

      // Load Recipes từ DB
      recipeSelect.innerHTML =
        '<option value="" disabled selected>📜 Chọn công thức</option>';
      result.recipes.forEach((recipe) => {
        let option = document.createElement("option");
        option.value = recipe.recipe_id;
        option.text = `📜 ${recipe.recipe_name}`;
        recipeSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Lỗi tải dữ liệu khởi tạo:", error);
  }
};

function previewFile(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("previewImage");
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
      document.getElementById("camIcon").style.display = "none";
      document.getElementById("uploadText").style.display = "none";
    };
    reader.readAsDataURL(file);
  }
}

function closeAddProductModal() {
  if (window.parent && typeof window.parent.closeAddProduct === "function") {
    window.parent.closeAddProduct();
  }
}

document
  .getElementById("productForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      "name",
      this.querySelector('input[placeholder*="Ví dụ: Cà phê Muối"]').value,
    );
    formData.append("category_id", document.getElementById("category").value);
    formData.append("recipe_id", document.getElementById("recipe").value);
    formData.append(
      "price",
      this.querySelector('input[placeholder*="Ví dụ: 35.000"]').value,
    );
    formData.append("description", this.querySelector("textarea").value);

    const fileInput = document.getElementById("imgInput");
    if (fileInput.files[0]) {
      formData.append("image", fileInput.files[0]);
    }

    try {
      const response = await fetch(API_URL, { method: "POST", body: formData });
      const result = await response.json();
      if (result.success) {
        alert("Đã lưu sản phẩm!");
        closeAddProductModal();
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (error) {
      alert("Không thể kết nối Server!");
    }
  });

document.getElementById("cancelBtn").onclick = (e) => {
  e.preventDefault();
  closeAddProductModal();
};

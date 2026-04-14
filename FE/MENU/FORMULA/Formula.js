/**
 * Quản lý công thức - Formula Module
 */
let allIngredients = []; // Danh sách nguyên liệu từ kho

// --- 1. Khởi tạo ---
document.addEventListener("DOMContentLoaded", async () => {
  await fetchIngredients();
  addNewRow(); // Thêm dòng đầu tiên
});

// Lấy danh sách nguyên liệu từ API Inventory để đổ vào Select
async function fetchIngredients() {
  try {
    const res = await fetch("/CNPM/BE/api/inventory.php");
    const result = await res.json();
    if (result.success) {
      allIngredients = result.data;
    }
  } catch (err) {
    console.error("Lỗi tải nguyên liệu:", err);
  }
}

// --- 2. Xử lý giao diện dòng nguyên liệu ---
window.addNewRow = function () {
  const container = document.getElementById("list-container");
  const rowId = Date.now();

  const rowHtml = `
        <div class="table-grid recipe-row" id="row-${rowId}">
            <select class="ing-select" onchange="updateUnit(${rowId}, this)">
                <option value="">-- Chọn nguyên liệu --</option>
                ${allIngredients
                  .map(
                    (i) => `
                    <option value="${i.ingredient_id}" data-unit="${i.unit}">
                        ${i.name}
                    </option>`,
                  )
                  .join("")}
            </select>
            <input type="number" class="ing-quantity" placeholder="0.0" min="0">
            <div class="ing-unit" id="unit-${rowId}">---</div>
            <input type="text" class="ing-note" placeholder="Ghi chú...">
            <div style="text-align: center">
                <button class="remove-btn" onclick="removeRow(${rowId})" title="Xóa">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
    `;
  container.insertAdjacentHTML("beforeend", rowHtml);
};

window.updateUnit = function (rowId, selectEl) {
  const selectedOption = selectEl.options[selectEl.selectedIndex];
  const unit = selectedOption.getAttribute("data-unit") || "---";
  document.getElementById(`unit-${rowId}`).innerText = unit;
};

window.removeRow = function (rowId) {
  const rows = document.querySelectorAll(".recipe-row");
  if (rows.length > 1) {
    document.getElementById(`row-${rowId}`).remove();
  } else {
    alert("Công thức phải có ít nhất một nguyên liệu!");
  }
};

// --- 3. Lưu công thức (POST) ---
document.querySelector(".btn-save").onclick = async function () {
  const recipeName = document.querySelector(".recipe-name-input").value.trim();
  if (!recipeName) return alert("Vui lòng nhập tên công thức!");

  const rows = document.querySelectorAll(".recipe-row");
  const ingredients = [];

  rows.forEach((row) => {
    const id = row.querySelector(".ing-select").value;
    const qty = row.querySelector(".ing-quantity").value;
    if (id && qty) {
      ingredients.push({
        ingredient_id: parseInt(id),
        quantity: parseFloat(qty),
      });
    }
  });

  if (ingredients.length === 0)
    return alert("Vui lòng chọn nguyên liệu và định lượng!");

  const payload = {
    recipe_name: recipeName,
    note: "Tạo từ giao diện thiết lập",
    ingredients: ingredients,
  };

  try {
    const res = await fetch("/CNPM/BE/api/formula.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (result.success) {
      alert("✅ Lập công thức thành công!");
      // Gọi hàm đóng modal ở trang cha (nếu có)
      if (window.parent && window.parent.closeFormula) {
        window.parent.closeFormula();
      } else {
        location.reload();
      }
    } else {
      alert("❌ Lỗi: " + result.message);
    }
  } catch (err) {
    console.error("Lỗi gửi dữ liệu:", err);
    alert("Lỗi kết nối server!");
  }
};

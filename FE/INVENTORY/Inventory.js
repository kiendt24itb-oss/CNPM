/**
 * Quản lý Kho - Inventory Module
 * Chức năng: Tìm kiếm đa năng, Phân quyền Admin/Staff, Thống kê thời gian thực
 */
let inventoryData = [];

// Lấy thông tin user từ localStorage
const currentUser = JSON.parse(localStorage.getItem("user")) || {
  role: "STAFF",
};

// --- 1. Khởi tạo ---
window.initInventory = function () {
  console.log("🔥 Inventory System Initialized");

  // Phân quyền nút thêm mới
  const btnAdd = document.getElementById("btnAddIngredient");
  if (btnAdd) {
    if (currentUser.role !== "ADMIN") {
      btnAdd.style.display = "none";
    } else {
      btnAdd.onclick = () => alert("Mở form thêm nguyên liệu mới");
    }
  }

  // Gán sự kiện tìm kiếm (Input event để tìm kiếm realtime)
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = ""; // Clear input khi init
    searchInput.addEventListener("input", handleSearch);
  }

  // Khởi động biểu đồ và tải dữ liệu từ BE
  initInventoryChart();
  loadInventoryFromServer();
};

// --- 2. Gọi API lấy dữ liệu (ĐÃ FIX) ---
async function loadInventoryFromServer() {
  try {
    // 1. Fetch dữ liệu thô
    const response = await fetch("/CNPM/BE/api/inventory.php");

    // 2. Chuyển đổi sang JSON (Lỗi cũ ở đây)
    const result = await response.json();

    if (result.success) {
      // 3. Gán mảng dữ liệu từ key "data"
      inventoryData = result.data;

      // 4. Cập nhật giao diện
      renderInventoryTable(inventoryData);
      updateQuickStats();
    } else {
      console.error("Lỗi BE:", result.message);
      renderInventoryTable([]); // Hiện bảng trống nếu success: false
    }
  } catch (err) {
    console.error("Lỗi kết nối server:", err);
    renderInventoryTable([]);
  }
}

// --- 3. Hiển thị bảng dữ liệu ---
function renderInventoryTable(list) {
  const tableBody = document.getElementById("tableBody");
  if (!tableBody) return;

  if (!list || list.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #888;">
                    Không tìm thấy nguyên liệu nào khớp với yêu cầu.
                </td>
            </tr>`;
    return;
  }

  tableBody.innerHTML = list
    .map((item) => {
      // Định nghĩa badge theo status từ JSON
      const config = {
        GOOD: { text: "ĐỦ", class: "bg-ok" },
        LOW: { text: "THẤP", class: "bg-low" },
        OUT: { text: "HẾT", class: "bg-out" },
      };
      const st = config[item.status] || { text: item.status, class: "" };

      return `
            <tr>
                <td><strong>#${item.ingredient_id}</strong></td>
                <td><strong>${item.name}</strong></td>
                <td>${item.supplier || "---"}</td>
                <td>${item.unit}</td>
                <td><strong>${parseFloat(item.stock_quantity)}</strong></td>
                <td>${parseFloat(item.min_stock)}</td>
                <td><span class="badge ${st.class}">${st.text}</span></td>
                <td>
                    ${
                      currentUser.role === "ADMIN"
                        ? `<i class="fa-solid fa-pen-to-square edit-icon" style="cursor:pointer; color:#007bff" title="Chỉnh sửa" onclick="openEditForm('${item.ingredient_id}')"></i>`
                        : `<i class="fa-solid fa-eye" style="color: #ccc; cursor: not-allowed" title="Chỉ xem"></i>`
                    }
                </td>
            </tr>`;
    })
    .join("");
}

// --- 4. Logic tìm kiếm đa năng ---
function handleSearch(e) {
  const kw = e.target.value.toLowerCase().trim();

  const filtered = inventoryData.filter((i) => {
    const name = (i.name || "").toLowerCase();
    const id = (i.ingredient_id || "").toString();
    const supplier = (i.supplier || "").toLowerCase();

    return name.includes(kw) || id.includes(kw) || supplier.includes(kw);
  });

  renderInventoryTable(filtered);
}

// --- 5. Cập nhật thẻ thống kê ---
function updateQuickStats() {
  const total = inventoryData.length;
  // Đếm những món có status khác GOOD
  const alertCount = inventoryData.filter((i) => i.status !== "GOOD").length;

  const elTotal = document.getElementById("totalIngredients");
  const elAlert = document.getElementById("lowStockCount");

  if (elTotal) elTotal.innerText = total;
  if (elAlert) elAlert.innerText = alertCount;
}

// --- 6. Biểu đồ (Chart.js) ---
function initInventoryChart() {
  const canvas = document.getElementById("inventoryChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (window.inventoryChartInstance) window.inventoryChartInstance.destroy();

  window.inventoryChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      datasets: [
        {
          label: "Nhập",
          data: [5, 10, 8, 15, 12, 20, 18],
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Xuất",
          data: [3, 8, 12, 10, 18, 15, 22],
          borderColor: "#dc3545",
          backgroundColor: "rgba(220, 53, 69, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    },
  });
}

// --- 7. Hành động sửa (Dùng dấu == để so sánh chuỗi và số) ---
window.openEditForm = function (id) {
  const item = inventoryData.find((i) => i.ingredient_id == id);
  if (!item) return;

  alert("Đang mở chỉnh sửa cho: " + item.name);
  console.log("🛠 Data chi tiết:", item);
};

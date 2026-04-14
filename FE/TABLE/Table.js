// ================= CONFIG =================
const API_URL = "/CNPM/BE/api/table.php";

// ================= MAP =================
const statusMapReverse = {
  EMPTY: "Trống",
  OCCUPIED: "Đang dùng",
};

// ================= STATE =================
let tables = [];

// ================= RENDER =================
function renderTables(list) {
  const grid = document.getElementById("tableGrid");
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach((table) => {
    const statusClass =
      table.status === "Trống"
        ? "trong"
        : table.status === "Đang dùng"
          ? "dang-dung"
          : "don-dep";

    const card = document.createElement("div");
    card.className = "table-card";

    card.innerHTML = `
      <div class="card-content">
        <div class="card-header">
          <div class="table-icon"><i class="fa-solid fa-chair"></i></div>
          <div class="table-info">
            <div class="table-name">${table.name}</div>
            <div class="table-sub">KV: ${table.area}</div>
            <div class="table-sub">Sức chứa: ${table.capacity} người</div>
          </div>
        </div>
        <div class="status-tag ${statusClass}">
          <span class="status-dot"></span>
          ${table.status}
        </div>
      </div>

      <div class="product-actions">
        <button class="btn-bill" onclick="viewTable(${table.id})">
          <i class="fa-solid fa-file-invoice-dollar"></i> Xem
        </button>
        <div class="action-row">
          <button class="btn-edit" onclick="editTable(${table.id})">
            <i class="fa-solid fa-pen-to-square"></i> Sửa
          </button>
          <button class="btn-delete" onclick="deleteTable(${table.id})">
            <i class="fa-solid fa-trash-can"></i> Xoá
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Cập nhật thống kê nhanh
  updateStats(list);
}

function updateStats(list) {
  const totalEl = document.getElementById("totalTables");
  const occupiedEl = document.getElementById("occupiedTables");

  if (totalEl) totalEl.textContent = list.length;
  if (occupiedEl)
    occupiedEl.textContent = list.filter(
      (t) => t.status === "Đang dùng",
    ).length;
}

// ================= API =================
async function fetchTables() {
  try {
    let url = API_URL;
    const search = document.getElementById("searchInput")?.value?.trim();
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      // Lưu vào biến global tables để dùng cho Xem/Sửa
      tables = data.data.map((t) => ({
        id: t.table_id, // Quan trọng: kiểm tra field này từ API
        name: `Bàn ${String(t.table_number).padStart(2, "0")}`,
        area: t.area,
        capacity: t.capacity,
        status: statusMapReverse[t.status] || "Trống",
        customers: t.customer_count || 0,
        items: t.total_items || 0,
      }));

      renderTables(tables);

      if (data.stats) {
        document.getElementById("totalTables").textContent = data.stats.total;
        document.getElementById("occupiedTables").textContent =
          data.stats.occupied;
      }
    }
  } catch (err) {
    console.error("Lỗi load bàn:", err);
  }
}

// ================= ACTIONS =================

// XEM BÀN
window.viewTable = (id) => {
  // Ép kiểu Number để so sánh chính xác
  const table = tables.find((t) => Number(t.id) === Number(id));

  if (!table) {
    console.error("Danh sách hiện tại:", tables);
    alert("Không tìm thấy dữ liệu bàn!");
    return;
  }

  alert(
    `🪑 ${table.name}\n` +
      `----------------\n` +
      `📍 Khu vực: ${table.area}\n` +
      `👥 Sức chứa: ${table.capacity} người\n` +
      `📌 Trạng thái: ${table.status}\n` +
      `🍽 Khách hiện tại: ${table.customers}\n` +
      `🍴 Món đã gọi: ${table.items}`,
  );
};

// SỬA BÀN
window.editTable = (id) => {
  const table = tables.find((t) => Number(t.id) === Number(id));
  if (!table) {
    alert("Không tìm thấy bàn để sửa!");
    return;
  }

  const newArea = prompt("Nhập khu vực mới:", table.area);
  if (newArea === null) return;

  const newCapacity = prompt("Nhập sức chứa mới:", table.capacity);
  if (newCapacity === null) return;

  if (isNaN(newCapacity) || newCapacity < 1) {
    alert("Sức chứa phải là số dương!");
    return;
  }

  // Demo: Cập nhật trực tiếp vào mảng và render lại
  table.area = newArea;
  table.capacity = parseInt(newCapacity);
  renderTables(tables);

  alert("Cập nhật tạm thời thành công!");
  // Sau này bạn có thể gọi API UPDATE ở đây
};

// XOÁ BÀN
window.deleteTable = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa bàn này?")) return;

  try {
    const res = await fetch(`${API_URL}?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      fetchTables(); // Load lại danh sách từ server
    } else {
      alert(data.message || "Xoá thất bại");
    }
  } catch (err) {
    console.error("Lỗi xóa:", err);
  }
};

// ================= KHỞI TẠO =================
window.initTable = function () {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  fetchTables();
};

// Logic xử lý Modal Thêm bàn (Giữ nguyên của bạn)
const TABLE_BASE_PATH = (() => {
  const currentScript = document.currentScript;
  if (currentScript?.src) {
    return new URL(currentScript.src, window.location.href).href.replace(
      /\/Table\.js$/,
      "/",
    );
  }
  return window.location.origin + "/FE/TABLE/";
})();

window.openAddTable = () => {
  const wrapper = document.getElementById("addTableWrapper");
  const content = document.getElementById("addTableContent");
  if (!wrapper || !content) return;

  const addPage = new URL("AddTable/AddTable.html", TABLE_BASE_PATH).href;
  content.innerHTML = `<iframe src="${addPage}" frameborder="0" style="width:100%; height:400px;"></iframe>`;
  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden";
};

window.closeAddTable = () => {
  const wrapper = document.getElementById("addTableWrapper");
  if (wrapper) wrapper.style.display = "none";
  document.body.style.overflow = "auto";
};

window.addTable = () => window.openAddTable();

window.handleNewTable = async (newTable) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTable),
    });
    const data = await res.json();
    if (data.success) {
      fetchTables();
      window.closeAddTable();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Lỗi thêm bàn:", err);
  }
};

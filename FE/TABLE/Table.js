// ================= CONFIG =================
const API_URL = "/CNPM/BE/api/table.php";

// ================= MAP =================
const statusMap = {
  Trống: "EMPTY",
  "Đang dùng": "OCCUPIED",
};

const statusMapReverse = {
  EMPTY: "Trống",
  OCCUPIED: "Đang dùng",
};

// ================= STATE =================
let tables = [];
let currentStatus = "Tất cả";

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

        <div class="extra-info ${
          table.status !== "Đang dùng" ? "hidden-info" : ""
        }">
          <span><i class="fa-solid fa-users"></i> ${table.customers}</span>
          <span><i class="fa-solid fa-utensils"></i> ${table.items}</span>
        </div>
      </div>

      <div class="product-actions">
        <button class="btn-bill">
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

  // stats fallback (nếu API chưa trả)
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
    const params = [];

    const search = document.getElementById("searchInput")?.value?.trim();
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    if (params.length) url += "?" + params.join("&");

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      tables = data.data.map((t) => ({
        id: t.table_id,
        name: `Bàn ${String(t.table_number).padStart(2, "0")}`,
        area: t.area,
        capacity: t.capacity,
        status: statusMapReverse[t.status] || "Trống",
        customers: t.customer_count || 0,
        items: t.total_items || 0,
      }));

      renderTables(tables);

      // update stats từ BE
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

// ================= FILTER =================
function applyFilters() {
  fetchTables(); // gọi API luôn
}

// ================= INIT (GIỮ NGUYÊN) =================
window.initTable = function () {
  console.log("🔥 initTable CALLED");

  currentStatus = "Tất cả";

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";

  fetchTables();
};

// ================= PATH (GIỮ NGUYÊN) =================
const TABLE_BASE_PATH = (() => {
  const currentScript = document.currentScript;

  if (currentScript && currentScript.src) {
    const scriptUrl = new URL(currentScript.src, window.location.href);
    return scriptUrl.href.replace(/\/Table\.js$/, "/");
  }

  const path = window.location.pathname;
  const lastSlashIndex = path.lastIndexOf("/");

  if (lastSlashIndex !== -1) {
    return `${window.location.origin}${path.slice(0, lastSlashIndex + 1)}`;
  }

  return `${window.location.origin}/FE/TABLE/`;
})();

// ================= ADD TABLE (GIỮ UI) =================
window.openAddTable = () => {
  const wrapper = document.getElementById("addTableWrapper");
  const content = document.getElementById("addTableContent");

  if (!wrapper || !content) return;

  const addPage = new URL("AddTable/AddTable.html", TABLE_BASE_PATH).href;

  content.innerHTML = `<iframe src="${addPage}" frameborder="0"></iframe>`;

  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden";
};

window.closeAddTable = () => {
  const wrapper = document.getElementById("addTableWrapper");
  if (!wrapper) return;

  wrapper.style.display = "none";
  document.getElementById("addTableContent").innerHTML = "";
  document.body.style.overflow = "auto";
};

window.addTable = () => window.openAddTable();

// ================= HANDLE ADD =================
window.handleNewTable = async (newTable) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_number: newTable.table_number,
        area: newTable.area,
        capacity: newTable.capacity,
        note: newTable.note,
      }),
    });

    const data = await res.json();

    if (data.success) {
      fetchTables();
      window.closeAddTable();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
};

// ================= DELETE =================
window.deleteTable = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa bàn này?")) return;

  try {
    const res = await fetch(`${API_URL}?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      fetchTables();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
};

// ================= EDIT =================
window.editTable = async (id) => {
  const table = tables.find((t) => t.id === id);
  if (!table) return;

  const newArea = prompt("Cập nhật khu vực", table.area);
  if (newArea === null) return;

  const newCapacity = Number(prompt("Sức chứa", table.capacity));

  if (!newCapacity || newCapacity < 1) {
    alert("Sức chứa không hợp lệ");
    return;
  }

  try {
    const res = await fetch(`${API_URL}?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_number: table.name.replace("Bàn ", ""),
        area: newArea,
        capacity: newCapacity,
        status: statusMap[table.status],
      }),
    });

    const data = await res.json();

    if (data.success) {
      fetchTables();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
};

async function updateTableById(id, data) {
  try {
    const res = await fetch(`${API_URL}?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_number: data.table_number,
        area: data.area,
        capacity: data.capacity,
        note: data.note || "",
        status: data.status, // "EMPTY" | "OCCUPIED"
      }),
    });

    const result = await res.json();

    if (result.success) {
      console.log("✅ Update thành công");
      fetchTables(); // reload lại UI
    } else {
      console.error("❌", result.message);
    }
  } catch (err) {
    console.error("Lỗi update:", err);
  }
}

// ================= UI =================

window.filterTables = () => fetchTables();

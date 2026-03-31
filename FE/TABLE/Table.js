const defaultTables = [
  { id: 1, name: "Bàn 01", area: "Trong nhà", capacity: 4, status: "Trống" },
  {
    id: 2,
    name: "Bàn 02",
    area: "Ban công",
    capacity: 2,
    status: "Đang dùng",
    customers: 2,
    items: 3,
  },
  {
    id: 3,
    name: "Bàn 03",
    area: "Trong nhà",
    capacity: 4,
    status: "Đang dọn",
    customers: 0,
    items: 0,
  },
  {
    id: 4,
    name: "Bàn 04",
    area: "Phòng VIP",
    capacity: 8,
    status: "Đang dùng",
    customers: 6,
    items: 11,
  },
];

function loadTables() {
  try {
    const saved = localStorage.getItem("tables");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn("Không đọc được localStorage", err);
  }
  localStorage.setItem("tables", JSON.stringify(defaultTables));
  return [...defaultTables];
}

function saveTables(list) {
  localStorage.setItem("tables", JSON.stringify(list));
}

let tables = loadTables();
let currentStatus = "Tất cả";

function renderTables(list) {
  const grid = document.getElementById("tableGrid");
  grid.innerHTML = "";

  list.forEach((table) => {
    const statusClass =
      table.status === "Trống"
        ? "trong"
        : table.status === "Đang dùng"
          ? "dang-dung"
          : "don-dep";

    const dotColor =
      table.status === "Trống"
        ? "#2e7d32"
        : table.status === "Đang dùng"
          ? "#c62828"
          : "#f9a825";

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
            <span style="height:8px; width:8px; background:${dotColor}; border-radius:50%"></span>
            ${table.status}
        </div>

        <div class="extra-info ${table.status !== "Đang dùng" ? "hidden-info" : ""}">
            <span><i class="fa-solid fa-users"></i> Khách: ${table.customers ?? 0}</span>
            <span><i class="fa-solid fa-utensils"></i> Món: ${table.items ?? 0}</span>
        </div>
    </div>

    <div class="product-actions">
        <button class="btn-bill"><i class="fa-solid fa-file-invoice-dollar"></i> Xem</button>
        <div class="action-row">
            <button class="btn-edit" onclick="editTable(${table.id})"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>
            <button class="btn-delete" onclick="deleteTable(${table.id})"><i class="fa-solid fa-trash-can"></i> Xoá</button>
        </div>
    </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById("totalTables").textContent = list.length;
  document.getElementById("occupiedTables").textContent = list.filter(
    (t) => t.status === "Đang dùng",
  ).length;
}

function applyFilters() {
  const query = (document.getElementById("searchInput")?.value ?? "")
    .trim()
    .toLowerCase();
  let filtered = tables;
  if (currentStatus !== "Tất cả") {
    filtered = filtered.filter((t) => t.status === currentStatus);
  }
  if (query) {
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.area.toLowerCase().includes(query) ||
        t.status.toLowerCase().includes(query),
    );
  }
  renderTables(filtered);
}

// Khởi tạo
renderTables(tables);

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

window.getNextTableId = () => Math.max(0, ...tables.map((t) => t.id)) + 1;

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

window.toggleDropdown = () =>
  document.getElementById("dropdownMenu").classList.toggle("show");

window.selectStatus = (status) => {
  currentStatus = status;
  document.getElementById("selectedStatus").textContent = status;
  applyFilters();
};

window.filterTables = () => applyFilters();

window.handleNewTable = (newTable) => {
  if (!newTable) return;
  const tableToAdd = {
    ...newTable,
    id: window.getNextTableId(),
    name:
      newTable.name ||
      `Bàn ${String(window.getNextTableId()).padStart(2, "0")}`,
    status: newTable.status || "Trống",
    customers: newTable.customers ?? 0,
    items: newTable.items ?? 0,
  };

  tables.push(tableToAdd);
  saveTables(tables);
  applyFilters();
  window.closeAddTable();
};

window.deleteTable = (id) => {
  if (!confirm("Bạn có chắc muốn xóa bàn này?")) return;
  tables = tables.filter((t) => t.id !== id);
  saveTables(tables);
  applyFilters();
};

window.editTable = (id) => {
  const table = tables.find((t) => t.id === id);
  if (!table) return;
  const newArea = prompt("Cập nhật khu vực", table.area);
  if (newArea === null) return;
  const newCapacity = Number(
    prompt("Cập nhật sức chứa", table.capacity) ?? table.capacity,
  );
  if (Number.isNaN(newCapacity) || newCapacity < 1) {
    alert("Sức chứa phải là số lớn hơn 0");
    return;
  }

  table.area = newArea.trim() || table.area;
  table.capacity = newCapacity;
  saveTables(tables);
  applyFilters();
};

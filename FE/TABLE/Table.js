const tables = [
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
        <button class="btn-bill"><i class="fa-solid fa-file-invoice-dollar"></i> Xem hóa đơn</button>
        <div class="action-row">
            <button class="btn-edit"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>
            <button class="btn-delete"><i class="fa-solid fa-trash-can"></i> Xoá</button>
        </div>
    </div>
    `;
    grid.appendChild(card);
  });
  document.getElementById("totalTables").textContent = list.length;
}

// Khởi tạo
renderTables(tables);

// Các hàm toggleDropdown, selectStatus... tương tự như file Menu của bạn
window.toggleDropdown = () =>
  document.getElementById("dropdownMenu").classList.toggle("show");

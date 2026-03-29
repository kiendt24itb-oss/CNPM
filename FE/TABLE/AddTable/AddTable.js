// Dữ liệu demo có chứa Icon cho từng khu vực
const db = {
  nextId: "05",
  areas: [
    { name: "Trong nhà", icon: "🏠" },
    { name: "Ban công", icon: "🌅" },
    { name: "Phòng VIP", icon: "💎" },
    { name: "Sân vườn", icon: "🌿" },
  ],
};

// Khởi tạo dữ liệu khi load trang
window.onload = () => {
  const select = document.getElementById("areaSelect");
  const inputId = document.getElementById("tableId");

  // Gán số bàn tự động từ trang cha nếu có thể
  const parentNextId = window.parent?.getNextTableId?.();
  inputId.value = parentNextId
    ? String(parentNextId).padStart(2, "0")
    : db.nextId;

  // Đổ danh sách khu vực kèm icon
  db.areas.forEach((item) => {
    let opt = document.createElement("option");
    opt.value = item.name;
    // Kết hợp icon và tên khu vực
    opt.innerHTML = `${item.icon} ${item.name}`;
    select.appendChild(opt);
  });

  const btnCancel = document.querySelector(".btn-cancel");
  if (btnCancel) {
    btnCancel.onclick = () => {
      if (window.parent?.closeAddTable) {
        window.parent.closeAddTable();
      } else {
        window.history.back();
      }
    };
  }
};

// Xử lý nút Tạo Bàn
document.getElementById("btnCreate").onclick = () => {
  const area = document.getElementById("areaSelect").value;
  const capacity = Number(document.getElementById("capacity").value || 1);
  const note = document.getElementById("note").value.trim();
  const tableId = document.getElementById("tableId").value;

  if (!area) {
    alert("Bạn chưa chọn khu vực kìa!");
    return;
  }
  if (capacity < 1) {
    alert("Sức chứa phải lớn hơn 0");
    return;
  }

  const newTable = {
    id: Number(tableId),
    name: `Bàn ${String(tableId).padStart(2, "0")}`,
    area,
    capacity,
    status: "Trống",
    customers: 0,
    items: 0,
    note,
  };

  try {
    if (window.parent?.handleNewTable) {
      window.parent.handleNewTable(newTable);
      alert(`Đã lưu Bàn ${tableId} tại khu vực ${area}`);
      return;
    }

    const raw = localStorage.getItem("tables");
    const savedTables = raw ? JSON.parse(raw) : [];

    if (savedTables.some((t) => t.id === newTable.id)) {
      alert("Số bàn đã tồn tại. Vui lòng cập nhật ID");
      return;
    }

    savedTables.push(newTable);
    localStorage.setItem("tables", JSON.stringify(savedTables));

    alert(`Đã lưu Bàn ${tableId} tại khu vực ${area}`);
    setTimeout(() => {
      window.location.href = "../Table.html";
    }, 400);
  } catch (err) {
    console.error(err);
    alert("Lỗi lưu bàn. Vui lòng thử lại.");
  }
};

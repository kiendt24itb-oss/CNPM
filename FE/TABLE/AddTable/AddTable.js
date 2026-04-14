// ================= CONFIG =================
const API_URL = "/CNPM/BE/api/table.php";

// ================= AREA ICON =================
const areaMap = {
  INDOOR: "🏠 Trong nhà",
  VIP: "💎 Phòng VIP",
  BALCONY: "🌅 Ban công",
  GARDEN: "🌿 Sân vườn",
};

// ================= INIT =================
window.onload = async () => {
  const areaSelect = document.getElementById("areaSelect");
  const tableIdInput = document.getElementById("tableId");

  try {
    // 🔥 1. Lấy danh sách bàn
    const res = await fetch(API_URL);
    const result = await res.json();

    if (result.success) {
      const tables = result.data || [];

      // 🔥 2. Tạo số bàn tiếp theo
      const maxNumber = Math.max(
        0,
        ...tables.map((t) => Number(t.table_number)),
      );

      const nextNumber = maxNumber + 1;

      tableIdInput.value = String(nextNumber).padStart(2, "0");
    } else {
      tableIdInput.value = "01";
    }

    // 🔥 3. Render khu vực (GIỮ ICON)
    areaSelect.innerHTML =
      '<option value="" disabled selected>👉 Chọn khu vực</option>';

    Object.entries(areaMap).forEach(([value, label]) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      areaSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Lỗi init:", err);
    alert("Không load được dữ liệu bàn!");
  }

  // 🔥 4. Nút huỷ
  const btnCancel = document.querySelector(".btn-cancel");
  if (btnCancel) {
    btnCancel.onclick = () => {
      if (window.parent && window.parent.closeAddTable) {
        window.parent.closeAddTable();
      }
    };
  }
};

// ================= CREATE =================
document.getElementById("btnCreate").onclick = async () => {
  const tableNumber = document.getElementById("tableId").value;
  const area = document.getElementById("areaSelect").value;
  const capacity = document.getElementById("capacity").value;
  const note = document.getElementById("note").value.trim();

  if (!area) {
    alert("Chọn khu vực đi 😑");
    return;
  }

  const tableData = {
    table_number: parseInt(tableNumber),
    area: area,
    capacity: parseInt(capacity),
    note: note,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tableData),
    });

    const result = await res.json();

    if (result.success) {
      alert(`✅ Tạo Bàn ${tableNumber} thành công`);

      // 🔥 gọi lại Table.js
      if (window.parent && window.parent.initTable) {
        window.parent.initTable(); // load lại chuẩn
      }

      if (window.parent && window.parent.closeAddTable) {
        window.parent.closeAddTable();
      }
    } else {
      alert("❌ " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("Server lỗi!");
  }
};

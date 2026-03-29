const mockData = {
  materials: ["Cà phê", "Sữa đặc", "Sữa tươi", "Đường", "Bột béo", "Trân châu"],
  units: ["ml", "gram", "cái", "muỗng", "túi"],
};

const listContainer = document.getElementById("list-container");

// Hàm đóng Modal

function addNewRow() {
  const row = document.createElement("div");
  row.className = "table-grid table-row";

  const materialOptions = mockData.materials
    .map((m) => `<option value="${m}">${m}</option>`)
    .join("");
  const unitOptions = mockData.units
    .map((u) => `<option value="${u}">${u}</option>`)
    .join("");

  row.innerHTML = `
          <select style="width:100%">${materialOptions}</select>
          <input type="number" class="input-qty" style="width:90%" value="1" min="0" />
          <select style="width:100%">${unitOptions}</select>
          <input type="text" style="width:90%" placeholder="Ghi chú thêm..." />
          <button class="delete-btn" onclick="this.parentElement.remove()">
            <i class="fa fa-trash"></i> Xoá
          </button>
        `;

  listContainer.appendChild(row);
}

window.onload = addNewRow;

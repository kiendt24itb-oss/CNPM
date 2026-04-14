// ================== DỮ LIỆU DEMO ==================
let employees = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString().padStart(2, "0"),
  name: i === 0 ? "Quyền Phủ" : `Nhân viên ${i + 1}`,
  dob: "15/01/2024",
  email: "admin@example.com",
  cccd: "012386054920",
  phone: "09374859238",
}));

// ================== RENDER ==================
function loadStaffTable(data) {
  const tableBody = document.getElementById("staffDataTable");
  if (!tableBody) return;

  tableBody.innerHTML = data
    .map(
      (item) => `
        <tr>
            <td>${item.id}</td>
            <td style="font-weight: 500;">${item.name}</td>
            <td>${item.dob}</td>
            <td>${item.email}</td>
            <td>${item.cccd}</td>
            <td>${item.phone}</td>
            <td>
                <div class="staff-actions">
                    <i class="fa-regular fa-eye"></i>
                    <i class="fa-regular fa-pen-to-square"></i>
                    <i class="fa-regular fa-trash-can" onclick="deleteStaff('${item.id}')"></i>
                </div>
            </td>
        </tr>
      `,
    )
    .join("");
}

// ================== INIT (🔥 QUAN TRỌNG) ==================
window.initStaff = function () {
  console.log("🔥 initStaff CALLED");

  // render lần đầu
  loadStaffTable(employees);

  // ================== SEARCH ==================
  const searchInput = document.getElementById("staffSearch");
  if (searchInput) {
    searchInput.value = "";

    searchInput.addEventListener("input", function () {
      const keyword = this.value.toLowerCase();

      const filtered = employees.filter((emp) =>
        emp.name.toLowerCase().includes(keyword),
      );

      loadStaffTable(filtered);
    });
  }

  // ================== BUTTON ADD ==================
  const btnAdd = document.getElementById("btnAddStaff");
  if (btnAdd) {
    btnAdd.onclick = function () {
      const wrapper = document.getElementById("addStaffWrapper");
      const iframe = document.getElementById("staffIframe");

      if (!wrapper || !iframe) return;

      wrapper.style.display = "flex";
      iframe.src = "../STAFF/AddStaff/AddStaff.html";
    };
  }
};

// ================== GLOBAL FUNCTIONS ==================
window.deleteStaff = function (id) {
  if (!confirm("Bạn có chắc muốn xóa nhân viên này không?")) return;

  employees = employees.filter((emp) => emp.id !== id);
  loadStaffTable(employees);
};

window.closeAddStaff = function () {
  const wrapper = document.getElementById("addStaffWrapper");
  if (wrapper) wrapper.style.display = "none";
};

window.addNewStaff = function (newStaff) {
  employees.push(newStaff);
  loadStaffTable(employees);
};

const API_URL = "/CNPM/BE/api/staff.php";

// ================= DATA DEMO =================
const DATA = {
  header: "Thông Tin Nhân Viên",
  dsChucVu: ["Quản lý", "Pha chế", "Phục vụ"],
};

// ================= INIT =================
window.onload = function () {
  setup();
  loadProfile();
  bindEvents();
};

// ================= SETUP =================
function setup() {
  document.getElementById("headerTitle").innerText = DATA.header;

  const select = document.getElementById("roleSelect");
  select.innerHTML = "";

  DATA.dsChucVu.forEach((v) => {
    let opt = document.createElement("option");
    opt.value = v;
    opt.text = v;
    select.appendChild(opt);
  });
}

// ================= BIND EVENTS =================
function bindEvents() {
  document.getElementById("btnSave").onclick = onSave;
  document.getElementById("btnCancel").onclick = onCancel;
}

// ================= LOAD PROFILE =================
async function loadProfile() {
  try {
    const res = await fetch(API_URL + "?action=profile");
    if (!res.ok) throw new Error("HTTP error");

    const result = await res.json();
    if (!result.success) return;

    const data = result.data;

    document.getElementById("displayMaNV").innerText = data.staff_code || "";
    document.getElementById("displayEmail").innerText = data.email || "";

    document.getElementById("emailInput").value = data.email || "";
    document.getElementById("name").value = data.name || "";
    document.getElementById("cccd").value = data.cccd || "";
    document.getElementById("roleSelect").value = data.role || "";

    document.getElementById("dob").value = data.birth_date || "";
    document.getElementById("startDate").value = data.hire_date || "";

    document.getElementById("phone").value = data.phone || "";
    document.getElementById("address").value = data.address || "";

    const avatar = document.getElementById("avatarImg");
    avatar.style.backgroundImage = data.avatar
      ? `url('${data.avatar}')`
      : "none";
  } catch (err) {
    console.error(err);
  }
}

// ================= SAVE =================
async function onSave() {
  const data = {
    name: document.getElementById("name").value.trim(),
    cccd: document.getElementById("cccd").value.trim(),
    role: document.getElementById("roleSelect").value,
    birth_date: document.getElementById("dob").value,
    hire_date: document.getElementById("startDate").value,
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
  };

  if (!data.name) {
    alert("Vui lòng nhập tên!");
    return;
  }

  try {
    const res = await fetch(API_URL + "?action=profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("HTTP error");

    const result = await res.json();

    if (result.success) {
      alert("✅ Đã lưu thành công!");

      // reload lại data
      loadProfile();

      // 🔥 đóng popup nếu có
      closePopup();
    } else {
      alert("❌ " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Lỗi server");
  }
}

// ================= CANCEL =================
function onCancel() {
  if (confirm("Hủy bỏ thao tác?")) {
    document.getElementById("formNV").reset();
    loadProfile();
    closePopup();
  }
}

// ================= CLOSE POPUP (FIX CHÍNH) =================
function closePopup() {
  // case 1: mở bằng iframe/modal parent
  if (window.parent && typeof window.parent.closeAddStaff === "function") {
    window.parent.closeAddStaff();
    return;
  }

  // case 2: modal local
  const modal = document.querySelector(".modal");
  if (modal) {
    modal.style.display = "none";
    return;
  }

  // case 3: fallback
  console.warn("Không tìm thấy cách đóng popup");
}

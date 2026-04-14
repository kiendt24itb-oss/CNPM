// DỮ LIỆU DEMO CỦA BẠN
const DATA = {
  header: "Thêm Thông Tin Nhân Viên Mới",
  maNV: "NV-10",
  email: "nv10@coffeemanager.com",
  avatar: "https://i.pravatar.cc/150?u=emp10",
  ngayMacDinh: "2024-01-15",
  dsChucVu: ["Quản lý", "Pha chế", "Phục vụ"],
};

function setup() {
  document.getElementById("headerTitle").innerText = DATA.header;
  document.getElementById("displayMaNV").innerText = DATA.maNV;
  document.getElementById("displayEmail").innerText = DATA.email;
  document.getElementById("avatarImg").style.backgroundImage =
    `url('${DATA.avatar}')`;
  document.getElementById("dob").value = DATA.ngayMacDinh;
  document.getElementById("startDate").value = DATA.ngayMacDinh;

  const select = document.getElementById("roleSelect");
  DATA.dsChucVu.forEach((v) => {
    let opt = document.createElement("option");
    opt.value = v;
    opt.text = v;
    select.appendChild(opt);
  });
}

document.getElementById("btnSave").onclick = () => {
  const ten = document.getElementById("name").value;
  alert(ten ? `Đã lưu: ${ten}` : "Vui lòng nhập tên!");
};

document.getElementById("btnCancel").onclick = () => {
  if (confirm("Hủy bỏ thao tác?")) document.getElementById("formNV").reset();
};

window.onload = setup;

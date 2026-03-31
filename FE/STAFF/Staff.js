// Tạo dữ liệu giả lập nhiều một chút để thấy hiệu ứng cuộn
const employees = [];
for (let i = 1; i <= 20; i++) {
  employees.push({
    id: i.toString().padStart(4, "0"),
    img: `https://i.pravatar.cc/150?u=${i}`,
    name: i % 2 === 0 ? "Lê Văn Nhân viên" : "Nguyễn Thị Quản lý",
    phone: "0723" + Math.floor(Math.random() * 1000000),
    email: `user${i}@gmail.com`,
    role: i % 3 === 0 ? "Trưởng phòng" : "Nhân viên",
  });
}

function render() {
  const html = employees
    .map(
      (emp) => `
                <tr>
                    <td>${emp.id}</td>
                    <td><img src="${emp.img}" class="emp-img"></td>
                    <td><strong>${emp.name}</strong></td>
                    <td>${emp.phone}</td>
                    <td>${emp.email}</td>
                    <td>${emp.role}</td>
                    <td class="actions">
                        <i class="fa-regular fa-pen-to-square"></i>
                        <i class="fa-solid fa-trash-can"></i>
                    </td>
                </tr>
            `,
    )
    .join("");
  document.getElementById("employee-list").innerHTML = html;
}

window.onload = render;

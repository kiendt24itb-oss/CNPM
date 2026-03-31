const data = [
  {
    id: "M-001",
    name: "Cà phê Arabica",
    supplier: "Đà Lạt Farm",
    unit: "Kg",
    qty: 45,
    min: 10,
    status: "ĐỦ",
  },
  {
    id: "M-002",
    name: "Sữa tươi TH",
    supplier: "TH True Milk",
    unit: "Lít",
    qty: 120,
    min: 20,
    status: "ĐỦ",
  },
  {
    id: "M-003",
    name: "Bột Chocolate",
    supplier: "An Nam Food",
    unit: "Hộp",
    qty: 6,
    min: 15,
    status: "THẤP",
  },
  {
    id: "M-004",
    name: "Sirô Vani Monin",
    supplier: "Cty Nguyên Liệu",
    unit: "Chai",
    qty: 0,
    min: 5,
    status: "HẾT",
  },
  {
    id: "M-005",
    name: "Trà Oolong",
    supplier: "Phúc Long",
    unit: "Gói",
    qty: 200,
    min: 50,
    status: "ĐỦ",
  },
];

document.getElementById("list-data").innerHTML = data
  .map(
    (m) => `
          <tr>
            <td style="color: var(--primary); font-weight: 800;">${m.id}</td>
            <td><strong>${m.name}</strong></td>
            <td>${m.supplier}</td>
            <td>${m.unit}</td>
            <td style="font-weight: 900;">${m.qty}</td>
            <td style="color: var(--secondary);">${m.min}</td>
            <td><span class="status-tag ${m.status === "THẤP" ? "tag-low" : m.status === "HẾT" ? "tag-out" : "tag-ok"}">${m.status}</span></td>
            <td><i class="fas fa-eye" style="cursor:pointer; color: var(--primary)"></i></td>
          </tr>`,
  )
  .join("");

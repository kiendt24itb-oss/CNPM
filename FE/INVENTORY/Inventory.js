const inventoryData = [
  {
    id: "M-001",
    name: "Cà phê Arabica",
    provider: "Đà Lạt Farm",
    unit: "Kg",
    qty: 45,
    min: 10,
    status: "ĐỦ",
  },
  {
    id: "M-002",
    name: "Sữa tươi TH",
    provider: "TH True Milk",
    unit: "Lít",
    qty: 120,
    min: 20,
    status: "ĐỦ",
  },
  {
    id: "M-003",
    name: "Bột Chocolate",
    provider: "An Nam Food",
    unit: "Hộp",
    qty: 6,
    min: 15,
    status: "THẤP",
  },
  {
    id: "M-004",
    name: "Sirô Vani Monin",
    provider: "Cty Nguyên Liệu",
    unit: "Chai",
    qty: 0,
    min: 5,
    status: "HẾT",
  },
  {
    id: "M-005",
    name: "Trà Oolong",
    provider: "Phúc Long",
    unit: "Gói",
    qty: 200,
    min: 50,
    status: "ĐỦ",
  },
  {
    id: "M-006",
    name: "Đường cát trắng",
    provider: "Biên Hòa",
    unit: "Kg",
    qty: 15,
    min: 20,
    status: "THẤP",
  },
];

function renderTable(list) {
  const body = document.getElementById("tableBody");
  body.innerHTML = list
    .map(
      (item) => `
            <tr>
                <td><strong>${item.id}</strong></td>
                <td><strong>${item.name}</strong></td>
                <td>${item.provider}</td>
                <td>${item.unit}</td>
                <td><strong>${item.qty}</strong></td>
                <td>${item.min}</td>
                <td>
                    <span class="badge ${item.status === "ĐỦ" ? "bg-ok" : item.status === "THẤP" ? "bg-low" : "bg-out"}">
                        ${item.status}
                    </span>
                </td>
                <td><i class="fa-solid fa-pen-to-square" style="cursor:pointer; color: #555;"></i></td>
            </tr>
        `,
    )
    .join("");
}

function doSearch() {
  const kw = document.getElementById("searchInput").value.toLowerCase();
  renderTable(
    inventoryData.filter(
      (i) =>
        i.name.toLowerCase().includes(kw) || i.id.toLowerCase().includes(kw),
    ),
  );
}

// CẤU HÌNH BIỂU ĐỒ 2 ĐƯỜNG (Chart.js)
const ctx = document.getElementById("inventoryChart").getContext("2d");
new Chart(ctx, {
  type: "line",
  data: {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    datasets: [
      {
        label: "Nhập kho",
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: "#28a745", // Màu xanh cho nhập
        backgroundColor: "rgba(40, 167, 69, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Xuất kho",
        data: [8, 15, 20, 18, 28, 22, 35],
        borderColor: "#dc3545", // Màu đỏ cho xuất
        backgroundColor: "rgba(220, 53, 69, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { boxWidth: 12, font: { size: 10 } },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { grid: { color: "#f0f0f0" }, ticks: { font: { size: 10 } } },
    },
    elements: { point: { radius: 2, hoverRadius: 5 } },
  },
});

renderTable(inventoryData);

const orders = [
  {
    id: "#00123",
    customer: "Nguyễn Văn A",
    table: 5,
    total: "150.000đ",
    status: "paid",
    statusText: "Đã thanh toán",
  },
  {
    id: "#00124",
    customer: "Nguyễn Văn B",
    table: 2,
    total: "85.000đ",
    status: "paid",
    statusText: "Đã thanh toán",
  },
  {
    id: "#00125",
    customer: "Cà Phê Trà",
    table: 6,
    total: "120.000đ",
    status: "unpaid",
    statusText: "Chưa thanh toán",
  },
  {
    id: "#00126",
    customer: "Trần Thị C",
    table: 4,
    total: "210.000đ",
    status: "paid",
    statusText: "Đã thanh toán",
  },
  {
    id: "#00127",
    customer: "Lê Văn D",
    table: 5,
    total: "45.000đ",
    status: "processing",
    statusText: "Đang xử lý",
  },
  {
    id: "#00128",
    customer: "Phạm Văn E",
    table: 1,
    total: "60.000đ",
    status: "unpaid",
    statusText: "Chưa thanh toán",
  },
];

// Cơ chế path linh hoạt khi page Order được nhúng bằng sidebar
const ORDER_BASE_PATH = (() => {
  const currentScript = document.currentScript;
  if (currentScript && currentScript.src) {
    const scriptUrl = new URL(currentScript.src, window.location.href);
    return scriptUrl.href.replace(/\/Order\.js$/, "/");
  }

  // Nếu không lấy được currentScript, dùng path của window.location (trường hợp test trực tiếp)
  const path = window.location.pathname;
  const lastSlashIndex = path.lastIndexOf("/");
  if (lastSlashIndex !== -1) {
    return `${window.location.origin}${path.slice(0, lastSlashIndex + 1)}`;
  }
  return `${window.location.origin}/FE/ORDER/`;
})();

function renderOrders() {
  const container = document.getElementById("orderContainer");
  document.getElementById("total-count").innerText = orders.length;

  container.innerHTML = orders
    .map((order) => {
      let statusColor = "#9e9e9e";
      if (order.status === "paid") statusColor = "#2e7d32";
      if (order.status === "unpaid") statusColor = "#d32f2f";
      if (order.status === "processing") statusColor = "#ed6c02";

      return `
          <div class="order-card">
            <div class="card-top">
              <span class="order-id">Đơn: ${order.id}</span>
              <span class="status-badge" style="background-color: ${statusColor}">${order.statusText}</span>
            </div>
            <div class="card-body">
              <div class="info-row">
                <i class="fa-solid fa-user-tie"></i> 
                <span>Khách: <strong>${order.customer}</strong></span>
              </div>
              <div class="info-row">
                <i class="fa-solid fa-couch"></i> 
                <span>Bàn số: <strong>${order.table}</strong></span>
              </div>
              <div class="total-price-row">
                <span class="total-price-label">Tổng tiền:</span> ${order.total}
              </div>
            </div>
            
            <div class="card-actions-group">
              <button class="btn-view"><i class="fa-solid fa-eye"></i> Chi tiết</button>
              <div class="action-row">
                <button class="btn-edit"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          </div>
        `;
    })
    .join("");
}

renderOrders();

window.openAddOrder = function () {
  const wrapper = document.getElementById("addOrderWrapper");
  const content = document.getElementById("addOrderContent");

  if (!wrapper || !content) return;

  const addOrderUrl = new URL("AddOrder/AddOrder.html", ORDER_BASE_PATH).href;

  content.innerHTML = `
    <iframe 
      src="${addOrderUrl}" 
      id="addOrderIframe"
      style="width: 100%; height: 85vh; border: none; border-radius: 15px;"
    ></iframe>
  `;

  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden";
};

window.closeAddOrder = function () {
  const wrapper = document.getElementById("addOrderWrapper");
  if (wrapper) {
    wrapper.style.display = "none";
    document.getElementById("addOrderContent").innerHTML = "";
    document.body.style.overflow = "auto";
  }
};

window.addOrder = function (orderData) {
  // Tạo ID mới
  const newId = `#00${String(orders.length + 129).padStart(3, "0")}`;
  const newOrder = {
    id: newId,
    customer: orderData.customer || "Khách vãng lai",
    table: orderData.table,
    total: `${orderData.total.toLocaleString()}đ`,
    status: orderData.isPaid ? "paid" : "unpaid",
    statusText: orderData.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
  };
  orders.push(newOrder);
  renderOrders();
  closeAddOrder();
};

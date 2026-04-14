// Giữ nguyên mảng để tránh lỗi khi render lần đầu, nhưng sẽ được update từ API
let orders = [];

// --- GIỮ NGUYÊN CƠ CHẾ PATH CỦA BẠN ---
const ORDER_BASE_PATH = (() => {
  const currentScript = document.currentScript;
  if (currentScript && currentScript.src) {
    const scriptUrl = new URL(currentScript.src, window.location.href);
    return scriptUrl.href.replace(/\/Order\.js$/, "/");
  }
  const path = window.location.pathname;
  const lastSlashIndex = path.lastIndexOf("/");
  if (lastSlashIndex !== -1) {
    return `${window.location.origin}${path.slice(0, lastSlashIndex + 1)}`;
  }
  return `${window.location.origin}/FE/ORDER/`;
})();

// --- HÀM LẤY DỮ LIỆU TỪ DATABASE ---
async function fetchOrders() {
  try {
    const response = await fetch("/CNPM/api/order.php");
    const result = await response.json();
    if (result.success) {
      // Convert dữ liệu từ DB sang format của UI bạn đang dùng
      orders = result.data.map((item) => ({
        id: `#${String(item.order_id).padStart(5, "0")}`,
        customer: item.customer_name || "Khách vãng lai",
        table: item.table_number || "N/A",
        total: Number(item.total).toLocaleString() + "đ",
        status: item.status.toLowerCase(), // 'paid' hoặc 'unpaid'
        statusText:
          item.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán",
      }));
      renderOrders();
    }
  } catch (error) {
    console.error("Không thể kết nối API, sử dụng dữ liệu tạm thời.");
  }
}

// --- GIỮ NGUYÊN HÀM RENDER CỦA BẠN ---
function renderOrders() {
  const container = document.getElementById("orderContainer");
  if (!container) return;
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
                <button class="btn-delete" onclick="deleteOrderById(${order.id.replace("#", "")})">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
    })
    .join("");
}

// --- GIỮ NGUYÊN LOGIC MỞ MODAL (IFRAME) CỦA BẠN ---
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
    fetchOrders(); // Load lại danh sách sau khi thêm đơn thành công
  }
};

// Hàm này để Iframe gọi khi ấn "Xác nhận" hoặc "Thanh toán"
window.addOrder = function (orderData) {
  // Logic: Iframe sẽ gửi data lên, file này sẽ gọi fetchOrders để cập nhật lại màn hình
  fetchOrders();
  closeAddOrder();
};

// Hàm xóa đơn thật trong DB
async function deleteOrderById(id) {
  if (confirm("Xóa đơn hàng này?")) {
    await fetch(`../api/order.php?id=${id}`, { method: "DELETE" });
    fetchOrders();
  }
}

// Khởi chạy
fetchOrders();

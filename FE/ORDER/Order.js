// ================= STATE =================
let orders = [];

// ================= GIỮ NGUYÊN PATH =================
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

// ================= FETCH ORDERS =================
async function fetchOrders() {
  try {
    const response = await fetch("/CNPM/BE/api/order.php");
    const result = await response.json();

    if (result.success) {
      orders = result.data.map((item) => ({
        id: item.order_id,
        code: `#${String(item.order_id).padStart(5, "0")}`,
        customer: item.customer_name || "Khách vãng lai",
        table: item.table_number || "N/A",
        total: Number(item.total).toLocaleString() + "đ",
        status: item.status.toLowerCase(),
        statusText:
          item.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán",
      }));

      renderOrders();
    }
  } catch (error) {
    console.error("Lỗi fetch orders:", error);
  }
}

// ================= RENDER =================
function renderOrders() {
  const container = document.getElementById("orderContainer");
  if (!container) return;

  document.getElementById("total-count").innerText = orders.length;

  container.innerHTML = orders
    .map((order) => {
      let statusClass =
        order.status === "paid" ? "status-paid" : "status-unpaid";

      return `
        <div class="order-card">
          <div class="card-header">
            <span class="order-code">${order.code}</span>
            <span class="status-dot ${statusClass}">${order.statusText}</span>
          </div>

          <div class="card-body">
            <div class="info-item">
              <i class="fa-solid fa-user"></i>
              <span>${order.customer}</span>
            </div>
            <div class="info-item">
              <i class="fa-solid fa-table"></i>
              <span>Bàn số: <strong>${order.table}</strong></span>
            </div>
            <div class="price-tag">
              ${order.total}
            </div>
          </div>

          <div class="card-footer">
            <button class="btn-detail" onclick="viewOrder(${order.id})">
              <i class="fa-solid fa-file-invoice"></i> Xem chi tiết
            </button>
            <div class="footer-actions">
              ${
                order.status === "unpaid"
                  ? `<button class="btn-pay-card" onclick="payOrder(${order.id})" title="Thanh toán">
                      <i class="fa-solid fa-credit-card"></i>
                    </button>`
                  : ""
              }
              <button class="btn-delete-card" onclick="deleteOrderById(${order.id})" title="Xóa">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// ================= VIEW DETAIL =================
// ================= VIEW DETAIL =================
async function viewOrder(id) {
  try {
    const res = await fetch(`/CNPM/BE/api/order.php?id=${id}`);
    const data = await res.json();

    if (!data.success) return alert("Không lấy được chi tiết đơn hàng");

    // Lấy thông tin cơ bản từ mảng orders hiện tại (tránh gọi API nhiều lần)
    const orderInfo = orders.find((o) => Number(o.id) === Number(id));

    // Xử lý danh sách món ăn
    let itemList = data.items
      .map(
        (i, index) =>
          `${index + 1}. ${i.name}\n   ${i.quantity} x ${Number(i.price).toLocaleString()}đ = ${(i.quantity * i.price).toLocaleString()}đ`,
      )
      .join("\n--------------------------\n");

    // Tính tổng số lượng món
    const totalQty = data.items.reduce((sum, i) => sum + Number(i.quantity), 0);

    // Tạo nội dung hiển thị
    const billContent = `
🧾 CHI TIẾT ĐƠN HÀNG ${orderInfo ? orderInfo.code : ""}
------------------------------------------
👤 Khách hàng: ${orderInfo ? orderInfo.customer : "N/A"}
🪑 Bàn số: ${orderInfo ? orderInfo.table : "N/A"}
------------------------------------------
DANH SÁCH MÓN:
${itemList}

------------------------------------------
📦 Tổng số lượng: ${totalQty} món
💰 TỔNG CỘNG: ${orderInfo ? orderInfo.total : "0đ"}
------------------------------------------
📌 Trạng thái: ${orderInfo ? orderInfo.statusText : ""}
    `;

    alert(billContent);
  } catch (err) {
    console.error("Lỗi khi xem chi tiết:", err);
    alert("Có lỗi xảy ra khi tải dữ liệu.");
  }
}

// ================= THANH TOÁN =================
async function payOrder(id) {
  if (!confirm("Xác nhận thanh toán đơn này?")) return;

  try {
    const res = await fetch(`/CNPM/BE/api/order.php?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "PAID",
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Đã thanh toán!");
      fetchOrders(); // reload UI
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
}

// ================= DELETE =================
async function deleteOrderById(id) {
  if (!confirm("Xóa đơn hàng này?")) return;

  try {
    const res = await fetch(`/CNPM/BE/api/order.php?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      fetchOrders();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
}

// ================= GIỮ NGUYÊN MODAL =================
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

    fetchOrders(); // reload
  }
};

// iframe gọi
window.addOrder = function () {
  fetchOrders();
  closeAddOrder();
};

// ================= INIT =================
window.initOrder = function () {
  console.log("🔥 Init Order Page");

  fetchOrders();
};

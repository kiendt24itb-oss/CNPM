// Biến lưu trữ dữ liệu từ Database
let dbTables = [];
let dbMenu = [];

let selectedTable = null;
let cart = [];

// 1. Khi load trang, lấy dữ liệu thật từ API
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Gọi API để lấy bàn trống và menu món ăn
    const response = await fetch("../api/order.php?action=init-data");
    const result = await response.json();

    if (result.success) {
      // Chuyển đổi dữ liệu từ DB sang định dạng của UI
      dbTables = result.tables.map((t) => ({
        id: t.table_id,
        n: `Bàn ${t.table_number} (${t.capacity}N)`,
        s: parseInt(t.capacity),
      }));

      dbMenu = result.menu;

      // Render dữ liệu lên UI
      renderTables();
      renderMenu();
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu khởi tạo:", error);
  }
});

// 2. Render danh sách bàn dựa trên số lượng khách (Giữ nguyên logic của bạn)
function renderTables() {
  const num = parseInt(document.getElementById("gCount").value) || 0;
  const grid = document.getElementById("tables");
  if (!grid) return;

  grid.innerHTML = "";

  if (dbTables.length === 0) {
    grid.innerHTML =
      "<p style='color:gray; font-size:13px;'>Không có bàn trống phù hợp</p>";
    return;
  }

  dbTables
    .filter((t) => (num > 4 ? t.s >= 6 : t.s <= 4))
    .forEach((t) => {
      const d = document.createElement("div");
      d.className = `card-table ${selectedTable === t.id ? "selected" : ""}`;
      d.onclick = () => {
        selectedTable = selectedTable === t.id ? null : t.id;
        renderTables();
      };
      d.innerHTML = `<i class="fas fa-couch"></i><span>${t.n}</span>`;
      grid.appendChild(d);
    });
}

// 3. Render danh sách thực đơn từ Database
function renderMenu() {
  const m = document.getElementById("menu");
  if (!m || !dbMenu) return;

  m.innerHTML = dbMenu
    .map(
      (item) => `
    <div onclick="addItem('${item.name}', ${parseFloat(item.price)}, 'fa-mug-hot', ${item.menu_id})">
      <i class="fas fa-mug-hot"></i> ${item.name} - ${parseInt(item.price).toLocaleString()}đ
    </div>
  `,
    )
    .join("");
}

// 4. Các hàm xử lý Giỏ hàng (Giữ nguyên logic xử lý mảng của bạn)
function toggleMenu() {
  const m = document.getElementById("menu");
  m.style.display = m.style.display === "block" ? "none" : "block";
}

function addItem(name, price, icon, menu_id) {
  const ex = cart.find((i) => i.menu_id === menu_id);
  if (ex) {
    ex.q++;
  } else {
    cart.push({ menu_id: menu_id, name: name, price: price, icon: icon, q: 1 });
  }
  toggleMenu();
  updateCart();
}

function changeQ(menu_id, d) {
  const i = cart.find((x) => x.menu_id === menu_id);
  if (i) {
    i.q += d;
    if (i.q <= 0) cart = cart.filter((x) => x.menu_id !== menu_id);
  }
  updateCart();
}

function updateCart() {
  const c = document.getElementById("cart");
  c.innerHTML = "";
  let total = 0;
  cart.forEach((i) => {
    total += i.price * i.q;
    c.innerHTML += `
      <div class="cart-item">
        <div style="display:flex; align-items:center; gap:8px">
          <i class="fas ${i.icon}" style="color:var(--primary)"></i>
          <span style="font-weight:bold">${i.name}</span>
        </div>
        <div class="qty-box">
          <i class="fas fa-minus" onclick="changeQ(${i.menu_id}, -1)"></i>
          <span>${i.q}</span>
          <i class="fas fa-plus" onclick="changeQ(${i.menu_id}, 1)"></i>
        </div>
        <strong>${(i.price * i.q).toLocaleString()}đ</strong>
      </div>`;
  });
  document.getElementById("total").innerText =
    `Tổng: ${total.toLocaleString()}đ`;
}

// 5. Gửi đơn hàng về Server (Lưu vào MySQL)
async function submitOrder(isPaid) {
  if (!selectedTable) {
    alert("Vui lòng chọn bàn!");
    return;
  }
  if (cart.length === 0) {
    alert("Vui lòng thêm ít nhất một món!");
    return;
  }

  const customer =
    document.querySelector('input[placeholder="Nhập tên..."]').value ||
    "Khách vãng lai";
  const guestCount = document.getElementById("gCount").value;

  // Chuẩn bị dữ liệu để khớp với OrderController
  const orderData = {
    table_id: selectedTable,
    customer_name: customer,
    customer_count: guestCount,
    is_paid: isPaid, // Trạng thái: Nếu ấn "Thanh toán" -> true (PAID), "Xác nhận" -> false (UNPAID)
    items: cart.map((item) => ({
      menu_id: item.menu_id,
      quantity: item.q,
      price: item.price,
    })),
  };

  try {
    const response = await fetch("../api/order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (result.success) {
      alert(
        isPaid ? "Thanh toán thành công!" : "Xác nhận đơn hàng thành công!",
      );
      // Gọi hàm của trang cha (Order.js) để cập nhật danh sách và đóng modal
      parent.addOrder(orderData);
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (error) {
    alert("Không thể kết nối với máy chủ!");
  }
}

// Đóng menu khi click ra ngoài
window.onclick = (e) => {
  if (!e.target.closest(".col-right"))
    document.getElementById("menu").style.display = "none";
};

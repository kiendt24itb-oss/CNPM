// ================= STATE =================
let dbTables = [];
let dbMenu = [];

let selectedTable = null;
let cart = [];

// ================= INIT =================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/CNPM/BE/api/order.php?action=create");
    const result = await response.json();

    if (result.success) {
      dbTables = result.tables.map((t) => ({
        id: t.table_id,
        n: `Bàn ${t.table_number} (${t.capacity}N)`,
        s: parseInt(t.capacity),
      }));

      dbMenu = result.menu;

      renderTables();
      renderMenu();
    }
  } catch (error) {
    console.error("Lỗi load data:", error);
  }
});

// ================= TABLE =================
function renderTables() {
  const num = parseInt(document.getElementById("gCount").value) || 0;
  const grid = document.getElementById("tables");
  if (!grid) return;

  grid.innerHTML = "";

  if (dbTables.length === 0) {
    grid.innerHTML =
      "<p style='color:gray; font-size:13px;'>Không có bàn trống</p>";
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

// ================= MENU =================
function renderMenu() {
  const m = document.getElementById("menu");
  if (!m || !dbMenu) return;

  m.innerHTML = dbMenu
    .map(
      (item) => `
    <div onclick="addItem('${item.name}', ${parseFloat(item.price)}, 'fa-mug-hot', ${item.menu_id})">
      <i class="fas fa-mug-hot"></i> 
      ${item.name} - ${parseInt(item.price).toLocaleString()}đ
    </div>
  `,
    )
    .join("");
}

// ================= CART =================
function toggleMenu() {
  const m = document.getElementById("menu");
  m.style.display = m.style.display === "block" ? "none" : "block";
}

function addItem(name, price, icon, menu_id) {
  const ex = cart.find((i) => i.menu_id === menu_id);

  if (ex) {
    ex.q++;
  } else {
    cart.push({ menu_id, name, price, icon, q: 1 });
  }

  toggleMenu();
  updateCart();
}

function changeQ(menu_id, d) {
  const i = cart.find((x) => x.menu_id === menu_id);

  if (i) {
    i.q += d;
    if (i.q <= 0) {
      cart = cart.filter((x) => x.menu_id !== menu_id);
    }
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
      </div>
    `;
  });

  document.getElementById("total").innerText =
    `Tổng: ${total.toLocaleString()}đ`;
}

// ================= SUBMIT =================
async function submitOrder(isPaid) {
  if (!selectedTable) {
    alert("Vui lòng chọn bàn!");
    return;
  }

  if (cart.length === 0) {
    alert("Vui lòng thêm món!");
    return;
  }

  const customer =
    document.querySelector('input[placeholder="Nhập tên..."]').value ||
    "Khách vãng lai";

  const guestCount = document.getElementById("gCount").value;

  const orderData = {
    table_id: selectedTable,
    customer_name: customer,
    customer_count: guestCount,
    status: isPaid ? "PAID" : "UNPAID", // ✅ FIX
    items: cart.map((item) => ({
      menu_id: item.menu_id,
      quantity: item.q,
      price: item.price,
    })),
  };

  try {
    const response = await fetch("/CNPM/BE/api/order.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (result.success) {
      alert(isPaid ? "Thanh toán thành công!" : "Tạo đơn thành công!");

      parent.addOrder(); // reload bên ngoài
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert("Lỗi kết nối server!");
  }
}

// ================= CLICK OUTSIDE =================
window.onclick = (e) => {
  if (!e.target.closest(".col-right")) {
    document.getElementById("menu").style.display = "none";
  }
};

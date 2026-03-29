const tables = [
  { id: 1, n: "Bàn 1 (4N)", s: 4 },
  { id: 2, n: "Bàn 2 (4N)", s: 4 },
  { id: 3, n: "Bàn 3 (8N)", s: 8 },
  { id: 4, n: "Bàn 4 (4N)", s: 4 },
  { id: 5, n: "Bàn 5 (8N)", s: 8 },
  { id: 6, n: "Bàn 6 (4N)", s: 4 },
  { id: 7, n: "Bàn 7 (8N)", s: 8 },
  { id: 8, n: "Bàn 8 (4N)", s: 4 },
  { id: 9, n: "Bàn 9 (8N)", s: 8 },
];
let selectedTable = null;
let cart = [];

function renderTables() {
  const num = parseInt(document.getElementById("gCount").value) || 0;
  const grid = document.getElementById("tables");
  grid.innerHTML = "";
  tables
    .filter((t) => (num > 4 ? t.s === 8 : t.s === 4))
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

function toggleMenu() {
  const m = document.getElementById("menu");
  m.style.display = m.style.display === "block" ? "none" : "block";
}

function addItem(name, price, icon) {
  const ex = cart.find((i) => i.name === name);
  if (ex) ex.q++;
  else cart.push({ name, price, icon, q: 1 });
  toggleMenu();
  updateCart();
}

function changeQ(name, d) {
  const i = cart.find((x) => x.name === name);
  if (i) {
    i.q += d;
    if (i.q <= 0) cart = cart.filter((x) => x.name !== name);
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
                            <i class="fas fa-minus" onclick="changeQ('${i.name}', -1)"></i>
                            <span>${i.q}</span>
                            <i class="fas fa-plus" onclick="changeQ('${i.name}', 1)"></i>
                        </div>
                        <strong>${(i.price * i.q).toLocaleString()}đ</strong>
                    </div>`;
  });
  document.getElementById("total").innerText =
    `Tổng: ${total.toLocaleString()}đ`;
}

renderTables();
window.onclick = (e) => {
  if (!e.target.closest(".col-right"))
    document.getElementById("menu").style.display = "none";
};

function submitOrder(isPaid) {
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
  const total = cart.reduce((sum, item) => sum + item.price * item.q, 0);
  const orderData = {
    customer: customer,
    table: selectedTable,
    items: cart,
    total: total,
    isPaid: isPaid,
  };
  parent.addOrder(orderData);
  // Reset form
  selectedTable = null;
  cart = [];
  document.querySelector('input[placeholder="Nhập tên..."]').value = "";
  document.getElementById("gCount").value = 2;
  renderTables();
  updateCart();
}

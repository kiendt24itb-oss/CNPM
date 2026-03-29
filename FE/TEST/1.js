// DATA giả
const ingredients = ["Cà phê", "Sữa", "Đường", "Trà", "Matcha"];
const units = ["ml", "gram", "cái", "muỗng"];

// Tạo option
function renderOptions(arr) {
  return arr.map(item => `<option>${item}</option>`).join("");
}

// Tạo row
function createRow() {
  const div = document.createElement("div");
  div.className = "table-row";

  div.innerHTML = `
    <select class="select-nguyenlieu">
      ${renderOptions(ingredients)}
    </select>

    <input class="input-qty" type="number" value="1" min="0" />

    <select class="select-unit">
      ${renderOptions(units)}
    </select>

    <input class="input-note" type="text" placeholder="Ghi chú..." />

    <button class="delete-btn" onclick="removeRow(this)">
      <i class="fa fa-trash"></i>
    </button>
  `;

  return div;
}

// Add row
function addRow() {
  const list = document.getElementById("list");
  list.appendChild(createRow());
}

// Delete row
function removeRow(btn) {
  btn.parentElement.remove();
}

// Init 1 dòng
window.onload = () => {
  addRow();
};
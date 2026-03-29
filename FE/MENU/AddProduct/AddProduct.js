const categories = [
  { name: "Cà phê truyền thống", icon: "☕" },
  { name: "Trà & Trái cây", icon: "🍵" },
  { name: "Bánh & Tráng miệng", icon: "🍰" },
  { name: "Đồ uống đá xay", icon: "🍧" },
];

window.onload = function () {
  const select = document.getElementById("category");
  categories.forEach((item) => {
    let option = document.createElement("option");
    option.value = item.name;
    option.text = `${item.icon} ${item.name}`;
    select.appendChild(option);
  });
};

function previewFile(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("previewImage");
  const camIcon = document.getElementById("camIcon");
  const text = document.getElementById("uploadText");

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
      camIcon.style.display = "none";
      text.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
}

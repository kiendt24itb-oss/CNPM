// Load nội dung
// Trong file index.js, hãy sửa lại đoạn này:
async function loadPage(page) {
  try {
    const res = await fetch(page);
    const data = await res.text();

    const content = document.getElementById("content");
    content.innerHTML = data;

    // Đợi DOM render xong
    await new Promise((r) => setTimeout(r, 0));

    await executeScripts(data);

    // 👉 GỌI INIT THEO PAGE
    if (window.initMenu && page.includes("Menu")) {
      window.initMenu();
    }

    if (window.initChart && page.includes("Home")) {
      window.initChart();
    }

    if (window.initMenuPage && page.includes("Order")) {
      window.initMenuPage();
    }

    console.log("Đã load + chạy JS xong");
  } catch (err) {
    console.error(err);
    document.getElementById("content").innerHTML =
      "<h2 style='color:red'>Không load được trang</h2>";
  }
}

// Hàm thực thi scripts
// Thay thế hàm này trong file SLIDEBAR/index.js
async function executeScripts(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const scripts = tempDiv.querySelectorAll("script");

  for (const script of scripts) {
    const newScript = document.createElement("script");

    if (script.src) {
      // 🔥 FIX CACHE (QUAN TRỌNG)
      newScript.src = script.src + "?t=" + Date.now();

      await new Promise((resolve, reject) => {
        newScript.onload = resolve;
        newScript.onerror = reject;
        document.body.appendChild(newScript);
      });
    } else {
      newScript.textContent = script.textContent;
      document.body.appendChild(newScript);
      document.body.removeChild(newScript);
    }
  }
}

// Click menu
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector(".menu-item.active")?.classList.remove("active");
    item.classList.add("active");

    const page = item.getAttribute("data-page");
    if (page) {
      loadPage(page);
      history.pushState(null, "", "?page=" + page);
    }
  });
});

// Load lần đầu
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") || "../HOME/Home.html";

  loadPage(page);

  document.querySelectorAll(".menu-item").forEach((item) => {
    if (item.getAttribute("data-page") === page) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
});

// ================= LOAD PAGE =================
async function loadPage(page) {
  try {
    const res = await fetch(page);
    const data = await res.text();

    const content = document.getElementById("content");
    content.innerHTML = data;

    // đợi render DOM
    await new Promise((r) => setTimeout(r, 0));

    // chạy script trong page
    await executeScripts(data);

    // ================= INIT THEO PAGE =================
    if (window.initHome && page.includes("Home")) {
      window.initHome();
    }

    if (window.initMenu && page.includes("Menu")) {
      window.initMenu();
    }

    if (window.initHome && page.includes("Home")) {
      window.initHome();
    }

    if (window.initOrder && page.includes("Order")) {
      window.initOrder(); // 🔥 FIX
    }

    if (window.initTable && page.includes("Table")) {
      window.initTable();
    }

    if (window.initStaff && page.includes("Staff")) {
      window.initStaff();
    }

    if (window.initInventory && page.includes("Inventory")) {
      window.initInventory();
    }

    console.log("Đã load + chạy JS xong");
  } catch (err) {
    console.error(err);
    document.getElementById("content").innerHTML =
      "<h2 style='color:red'>Không load được trang</h2>";
  }
}

// ================= EXECUTE SCRIPT =================
async function executeScripts(html) {
  // 🔥 XÓA script cũ
  document.querySelectorAll("script[data-dynamic]").forEach((s) => s.remove());

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const scripts = tempDiv.querySelectorAll("script");

  for (const script of scripts) {
    const newScript = document.createElement("script");
    newScript.setAttribute("data-dynamic", "true"); // 🔥 đánh dấu

    if (script.src) {
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

// ================= CLICK SIDEBAR =================
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    const page = item.getAttribute("data-page");
    if (!page) return;

    // 🔥 tránh click lại page hiện tại
    const current = new URLSearchParams(window.location.search).get("page");
    if (current === page) return;

    // đổi active
    document.querySelector(".menu-item.active")?.classList.remove("active");
    item.classList.add("active");

    loadPage(page);
    history.pushState({ page }, "", "?page=" + page);
  });
});

// ================= LOAD LẦN ĐẦU =================
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

// ================= BACK / FORWARD =================
window.addEventListener("popstate", () => {
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

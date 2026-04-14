console.log("Toast function loaded");

/**
 * Hiển thị thông báo Toast
 */
function showToast(title, desc) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  document.getElementById("toastTitle").innerText = title;
  document.getElementById("toastDesc").innerText = desc;

  // Hiện toast
  toast.classList.remove("translate-y-20", "opacity-0", "pointer-events-none");

  // Tự động ẩn sau 2.5s
  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0", "pointer-events-none");
  }, 2500);
}

// =======================
// XỬ LÝ ĐĂNG NHẬP
// =======================
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Lấy dữ liệu và xóa khoảng trắng 2 đầu
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showToast("Thiếu dữ liệu", "Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      // Gửi yêu cầu đến API
      const res = await fetch("../../../BE/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Dùng JSON để đồng bộ với Backend
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // Kiểm tra nếu Server trả về lỗi (như die() hoặc lỗi 500)
      if (!res.ok) {
        throw new Error("Phản hồi từ server không hợp lệ");
      }

      const data = await res.json();

      // =======================
      // TRƯỜNG HỢP THÀNH CÔNG
      // =======================
      if (data.success) {
        showToast("Thành công", data.message || "Đăng nhập thành công!");

        // Lưu thông tin user vào localStorage để dùng cho các trang sau
        localStorage.setItem("user", JSON.stringify(data.user));

        // Chuyển hướng sau 1.2s để người dùng kịp nhìn thấy Toast
        setTimeout(() => {
          // Lưu ý: Kiểm tra đường dẫn index.html cho chính xác với folder của bạn
          window.location.href = "http://127.0.0.1/CNPM/FE/SLIDEBAR/index.html";
        }, 1200);
      }
      // =======================
      // TRƯỜNG HỢP THẤT BẠI (Sai pass, thiếu user...)
      // =======================
      else {
        showToast("Thất bại", data.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      console.error("Login Error:", err);
      showToast("Lỗi hệ thống", "Không thể kết nối API hoặc Server đang lỗi");
    }
  });

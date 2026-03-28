function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === "password") {
    input.type = "text";
    icon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        `;
  } else {
    input.type = "password";
    icon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
  }
}

function showToast(title, description, isError = false) {
  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastDesc = document.getElementById("toastDesc");

  toastTitle.textContent = title;
  toastDesc.textContent = description;

  if (isError) {
    toastTitle.classList.add("text-red-600");
    toastTitle.classList.remove("text-coffee-800");
  } else {
    toastTitle.classList.remove("text-red-600");
    toastTitle.classList.add("text-coffee-800");
  }

  toast.classList.remove("translate-y-20", "opacity-0", "pointer-events-none");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0", "pointer-events-none");
    toast.classList.remove("translate-y-0", "opacity-100");
  }, 3000);
}

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.querySelector('input[name="role"]:checked');

    if (!role) {
      showToast("Lỗi", "Vui lòng chọn vai trò!", true);
      return;
    }

    if (password !== confirmPassword) {
      showToast("Lỗi", "Mật khẩu xác nhận không khớp!", true);
      return;
    }

    if (password.length < 6) {
      showToast("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!", true);
      return;
    }

    const data = {
      email,
      password,
      fullName: document.getElementById("fullName").value,
      role: role.value === "admin" ? "ADMIN" : "STAFF",
    };

    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.message || "Đăng ký thất bại");
        }
        return payload;
      })
      .then((payload) => {
        showToast("Đăng ký thành công!", "Đã lưu thông tin vào MySQL.");
        localStorage.setItem("token", payload.data.token);
        localStorage.setItem("role", payload.data.role);
        localStorage.setItem("userId", payload.data.userId);
        setTimeout(() => {
          window.location.href = "../LOGIN/login.html";
        }, 1200);
      })
      .catch((err) => {
        showToast("Lỗi", err.message, true);
      });
  });

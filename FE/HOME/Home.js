function initChart() {
  const canvas = document.getElementById("revenueChart");
  if (!canvas) return; // tránh lỗi khi DOM chưa có

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      datasets: [
        {
          label: "Doanh thu",
          data: [1200000, 1900000, 1500000, 2200000, 2500000, 2800000, 3000000],
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
  });
}

// expose ra ngoài để index.js gọi
window.initChart = initChart;

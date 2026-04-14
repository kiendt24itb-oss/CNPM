// ================= DATA =================
const HOME_DATA = {
  revenue: {
    today: "2.450.000đ",
    trend: "⬆ 12% so với hôm qua",
    chartLabels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    chartValues: [
      1200000, 1900000, 1500000, 2200000, 2500000, 2800000, 3000000,
    ],
  },
  orders: {
    count: "42 đơn",
    trend: "⬆ 8 đơn so với hôm qua",
  },
  staff: {
    total: "12 người",
    status: "✅ Đủ biên chế",
  },
  tables: {
    available: "8/15",
    percent: 53,
  },
  customers: {
    count: "128 khách",
    trend: "⬇ 5 khách so với hôm qua",
  },
  stock: {
    lowItems: "3 món",
  },
};

// ================= GLOBAL CHART =================
let revenueChartInstance = null;

// ================= INIT HOME =================
function initHome() {
  console.log("Init Home...");

  // ===== 1. SET TEXT =====
  const setEl = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };

  setEl("todayRevenue", HOME_DATA.revenue.today);
  setEl("revenueTrend", HOME_DATA.revenue.trend);

  setEl("newOrders", HOME_DATA.orders.count);
  setEl("orderTrend", HOME_DATA.orders.trend);

  setEl("totalStaff", HOME_DATA.staff.total);
  setEl("staffStatus", HOME_DATA.staff.status);

  setEl("tableStatus", HOME_DATA.tables.available);
  setEl("tablePercent", `🟢 ${HOME_DATA.tables.percent}% trống`);

  const progress = document.getElementById("tableProgress");
  if (progress) {
    progress.style.width = `${HOME_DATA.tables.percent}%`;
  }

  setEl("customerCount", HOME_DATA.customers.count);
  setEl("customerTrend", HOME_DATA.customers.trend);

  setEl("lowStock", HOME_DATA.stock.lowItems);

  // ===== 2. INIT CHART =====
  const canvas = document.getElementById("revenueChart");
  if (!canvas) {
    console.warn("Không tìm thấy canvas chart");
    return;
  }

  // 🔥 Nếu Chart.js chưa load thì bỏ qua tránh crash
  if (typeof Chart === "undefined") {
    console.error("Chart.js chưa được load!");
    return;
  }

  const ctx = canvas.getContext("2d");

  // 🔥 DESTROY chart cũ (QUAN TRỌNG)
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }

  // 🔥 TẠO chart mới
  revenueChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: HOME_DATA.revenue.chartLabels,
      datasets: [
        {
          label: "Doanh thu",
          data: HOME_DATA.revenue.chartValues,
          borderColor: "#4e73df",
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  console.log("Home loaded OK");
}

// ================= EXPORT GLOBAL =================
window.initHome = initHome;

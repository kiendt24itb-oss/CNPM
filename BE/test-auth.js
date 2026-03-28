// Test script để kiểm tra Register & Login
const axios = require("axios");

const API_BASE = "http://localhost:3000/api";

// Helper để in output đẹp
const log = (title, data) => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📌 ${title}`);
  console.log(`${"=".repeat(60)}`);
  console.log(JSON.stringify(data, null, 2));
};

// Test data
const testUser = {
  email: `test_${Date.now()}@example.com`,
  password: "password123",
  fullName: "Test User",
};

let authToken = null;
let userId = null;

// Test functions
const testRegister = async () => {
  try {
    log("1️⃣ TEST REGISTER", {
      url: `${API_BASE}/auth/register`,
      data: testUser,
    });

    const response = await axios.post(`${API_BASE}/auth/register`, testUser);

    log("✅ REGISTER SUCCESS", response.data);

    authToken = response.data.data.token;
    userId = response.data.data.userId;

    return true;
  } catch (error) {
    log("❌ REGISTER FAILED", error.response?.data || error.message);
    return false;
  }
};

const testLogin = async () => {
  try {
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };

    log("2️⃣ TEST LOGIN", { url: `${API_BASE}/auth/login`, data: loginData });

    const response = await axios.post(`${API_BASE}/auth/login`, loginData);

    log("✅ LOGIN SUCCESS", response.data);

    return true;
  } catch (error) {
    log("❌ LOGIN FAILED", error.response?.data || error.message);
    return false;
  }
};

const testGetProducts = async () => {
  try {
    log("3️⃣ TEST GET PRODUCTS", { url: `${API_BASE}/products` });

    const response = await axios.get(`${API_BASE}/products`);

    log("✅ GET PRODUCTS SUCCESS", response.data);

    return true;
  } catch (error) {
    log("❌ GET PRODUCTS FAILED", error.response?.data || error.message);
    return false;
  }
};

const testGetProfile = async () => {
  if (!authToken) {
    log("⚠️ SKIP GET PROFILE", "No auth token available");
    return false;
  }

  try {
    log("4️⃣ TEST GET PROFILE", {
      url: `${API_BASE}/users/profile/me`,
      token: `${authToken.substring(0, 20)}...`,
    });

    const response = await axios.get(`${API_BASE}/users/profile/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    log("✅ GET PROFILE SUCCESS", response.data);

    return true;
  } catch (error) {
    log("❌ GET PROFILE FAILED", error.response?.data || error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log("\n🚀 STARTING AUTH TESTS...\n");

  const results = {
    register: await testRegister(),
    login: await testLogin(),
    getProducts: await testGetProducts(),
    getProfile: await testGetProfile(),
  };

  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST RESULTS");
  console.log("=".repeat(60));
  Object.entries(results).forEach(([key, value]) => {
    console.log(`${value ? "✅" : "❌"} ${key}`);
  });
  console.log("=".repeat(60) + "\n");

  process.exit(Object.values(results).every((r) => r) ? 0 : 1);
};

// Run tests
runTests().catch((error) => {
  console.error("❌ FATAL ERROR:", error.message);
  process.exit(1);
});

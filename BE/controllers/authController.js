const User = require("../models/User");
const {
  hashPassword,
  comparePassword,
  generateToken,
  sendResponse,
} = require("../utils/helpers");

// Import Google Auth Library (cần cài npm install google-auth-library)
let OAuth2Client;
let client;
try {
  ({ OAuth2Client } = require("google-auth-library"));
  client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE",
  );
} catch (e) {
  console.warn(
    "google-auth-library chưa cài: Google login sẽ không hoạt động. Hãy chạy npm install google-auth-library",
  );
}

// Register
const register = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Check if user exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const normalizedRole = role === "ADMIN" ? "ADMIN" : "STAFF";
    const username = fullName || email;

    // Create user
    const userId = await User.createUser(
      email,
      hashedPassword,
      username,
      fullName,
      normalizedRole,
    );
    const token = generateToken(userId, normalizedRole);

    sendResponse(res, 201, { userId, token, role }, "Đăng ký thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc password không đúng" });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email hoặc password không đúng" });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    sendResponse(
      res,
      200,
      { userId: user.id, token, role: user.role },
      "Đăng nhập thành công",
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    if (!client) {
      return res
        .status(500)
        .json({
          message: "Google login chưa cấu hình (thiếu google-auth-library)",
        });
    }
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE",
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name: fullName } = payload;

    // Check if user exists
    let user = await User.getUserByGoogleId(googleId);
    if (!user) {
      // Create new user
      const username = fullName || email;
      const userId = await User.createUser(
        email,
        null,
        username,
        fullName,
        "STAFF",
        googleId,
        "GOOGLE",
      );
      user = { id: userId, role: "STAFF" };
    }

    // Generate token
    const jwtToken = generateToken(user.id, user.role);

    sendResponse(
      res,
      200,
      { userId: user.id, token: jwtToken, role: user.role },
      "Đăng nhập Google thành công",
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi đăng nhập Google" });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../config/sequelize");
const config = require("../config/config");
const { sendEmail } = require("../utils/emailSender");
const logger = require("../middlewares/logger");

exports.register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({ where: { email } });

    if (user) {
      logger.error("user already registered with this email");
      return res
        .status(400)
        .json({ message: "user already registered with this email" });
    }

    // Check if user's role is provided
    if (!role) {
      logger.error("Role is mandatory");
      return res.status(400).json({ message: "Role is mandatory" });
    }

    // Update user details
    user.email = email || user.email;
    user.username = username;
    user.role = role;
    user.password = hashedPassword;
    user.is_active = true;

    user = await user.save();

    // Serialize user instance to JSON and remove sensitive fields
    const userJSON = user.toJSON();
    delete userJSON.password;
    delete userJSON.verified_otp;
    delete userJSON.forgot_otp;

    logger.info(`User with email ${email} registered successfully`);
    res
      .status(201)
      .json({ message: "User registered successfully", user: userJSON });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.error("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1h" },
    );

    logger.info(`User with email ${email} logged in successfully`);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    logger.error(`Change Password error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

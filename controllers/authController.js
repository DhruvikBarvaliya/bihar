const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../config/sequelize");
const config = require("../config/config");
const { sendEmail } = require("../utils/emailSender");
const logger = require("../middlewares/logger");

exports.register = async (req, res) => {
  try {
    const { username, password, email, role, verified_otp } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      logger.info(`User with email ${email} already registered`);
      return res.status(400).json({ message: "User Already registered" });
    }

    if (existingUser.verified_otp !== verified_otp) {
      logger.error("Invalid OTP");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      role,
    });

    logger.info(`User with email ${email} registered successfully`);
    res.status(201).json({ message: "User registered successfully", user });
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
      { expiresIn: "1h" }
    );

    logger.info(`User with email ${email} logged in successfully`);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    const user = await User.findOne({ where: { email } });

    if (type === "verify" && user) {
      logger.info(`User with email ${email} already registered`);
      return res.status(400).json({ message: "User Already registered" });
    } else if (type === "forgot" && !user) {
      logger.info(`User with email ${email} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    if (type === "verify") {
      await User.create({ email, verified_otp: otp });
      await sendEmail(email, "Verified User OTP", `Your OTP is ${otp}`);
      logger.info(
        `OTP Sent successfully for verified user with email ${email}`
      );
      res
        .status(200)
        .json({ message: "OTP Sent successfully for verified user" });
    } else if (type === "forgot") {
      user.forgot_otp = otp;
      await user.save();
      await sendEmail(email, "Forgot Password OTP", `Your OTP is ${otp}`);
      logger.info(
        `OTP sent successfully for forgot password to user with email ${email}`
      );
      res
        .status(200)
        .json({ message: "OTP sent successfully for forgot password" });
    } else {
      logger.error("Invalid OTP type");
      res.status(400).json({ message: "Invalid OTP type" });
    }
  } catch (error) {
    logger.error(`Send OTP error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.info(`User with email ${email} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.forgot_otp !== otp) {
      logger.error("Invalid OTP");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (newPassword !== confirmPassword) {
      logger.error("New password and confirm password do not match");
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    logger.info(`Password reset successfully for user with email ${email}`);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    logger.error(`Forgot Password error: ${error.message}`);
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

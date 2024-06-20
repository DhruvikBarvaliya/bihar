// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Store, Inventory } = require("../config/sequelize");
const config = require("../config/config");
const logger = require("../middlewares/logger");
const sendResponse = require("../utils/responseHelper");

exports.register = async (req, res) => {
  try {
    const {
      username,
      role,
      email,
      password,
      store_id,
      created_by,
      updated_by,
    } = req.body;
    if (!store_id || !password || !email || !username) {
      logger.error("Mandatory fields are missing");
      return sendResponse(res, "fail", "Mandatory fields are missing");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user, userName, existingUser] = await Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { username } }),
      User.findOne({ where: { role, store_id } }),
    ]);

    if (user) {
      logger.error("User already registered with this email");
      return sendResponse(
        res,
        "fail",
        "User already registered with this email",
        null,
        null,
        { email }
      );
    }

    if (userName) {
      logger.error("Username already exists");
      return sendResponse(res, "fail", "Username already exists", null, null, {
        username,
      });
    }

    if (role == "CE" && existingUser) {
      logger.error("CE Role already exists for this store");
      return sendResponse(
        res,
        "fail",
        "CE Role already exists for this store",
        null,
        null,
        { role, store_id }
      );
    }

    if (!role) {
      logger.error("Role is mandatory");
      return sendResponse(res, "fail", "Role is mandatory");
    }

    const newUser = await User.create({
      username,
      role,
      email,
      password: hashedPassword,
      store_id,
      is_active: true,
      created_by,
      updated_by,
    });

    const userJSON = newUser.toJSON();
    delete userJSON.password;
    delete userJSON.verified_otp;
    delete userJSON.forgot_otp;

    logger.info(`User with email ${email} registered successfully`);
    sendResponse(res, "success", "User registered successfully", {
      user: userJSON,
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: {
        model: Store,
        as: "store",
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.error("Invalid credentials");
      return sendResponse(res, "fail", "Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        store_id: user.store_id,
      },
      config.JWT_SECRET,
      { expiresIn: "12h" }
    );

    logger.info(`User with email ${email} logged in successfully`);
    delete user.dataValues.password;
    delete user.dataValues.verified_otp;
    delete user.dataValues.forgot_otp;

    sendResponse(res, "success", "Login successful", { token, user });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return sendResponse(res, "fail", "User not found", null, null, {
        userId: req.params.id,
      });
    }

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return sendResponse(res, "fail", "Invalid current password");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    sendResponse(res, "success", "Password changed successfully");
  } catch (error) {
    logger.error(`Change password error: ${error.message}`);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};

exports.dashboard = async (req, res) => {
  try {
    const { role, store_id } = req.params;
    console.log(role, store_id);

    let userCount, inventoryCount, storeCount;

    if (role === "Admin" || role === "Super Admin") {
      userCount = await User.count();
      inventoryCount = await Inventory.count();
      storeCount = await Store.count();
    } else {
      userCount = await User.count({
        where: { store_id },
      });

      inventoryCount = await Inventory.count({
        where: { store_id },
      });

      storeCount = await Store.count({
        where: { id:store_id },
      });
    }

    sendResponse(res, "success", "Dashboard data retrieved successfully", {
      userCount,
      inventoryCount,
      storeCount,
    });
  } catch (error) {
    logger.error(`Dashboard error: ${error.message}`);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};
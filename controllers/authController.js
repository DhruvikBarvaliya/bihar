const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User,Store} = require("../config/sequelize");
const config = require("../config/config");
const logger = require("../middlewares/logger");
const sendResponse = require("../utils/responseHelper");

exports.register = async (req, res) => {
  try {
    const { username, role, email, password, store_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({ where: { email } });
    let user_name = await User.findOne({ where: { username } });

    if (user) {
      logger.error("User Already Registered with this Email");
      return sendResponse(
        res,
        "fail",
        "User Already Registered with this Email",
        null,
        null,
        { email }
      );
    }
    if (user_name) {
      logger.error("User Name already Exists");
      return sendResponse(res, "fail", "User Name already Exists", null, null, {
        username,
      });
    }

    if (!role) {
      logger.error("Role is mandatory");
      return sendResponse(res, "fail", "Role is mandatory");
    }

    user = await User.create({
      username,
      role,
      email,
      password: hashedPassword,
      store_id,
      is_active: true,
    });

    const userJSON = user.toJSON();
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
        as: 'store',
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.error("Invalid credentials");
      return sendResponse(res, "fail", "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role ,email:user.email,store_id:user.store_id},
      config.JWT_SECRET,
      { expiresIn: "12h" }
    );

    logger.info(`User with email ${email} logged in successfully`);
    delete user.dataValues.password;
    delete user.dataValues.verified_otp;
    delete user.dataValues.forgot_otp;

    sendResponse(res, "success", "Login successful", { token ,user},);
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
    logger.error(`Change Password error: ${error.message}`);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};

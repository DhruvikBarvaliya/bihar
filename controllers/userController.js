// controllers/userController.js
const { User, Store } = require("../config/sequelize");
const logger = require("../middlewares/logger");
const { Op } = require("sequelize");
const sendResponse = require("../utils/responseHelper");

const excludeSensitiveInfo = (user) => {
  const userJSON = user.toJSON();
  delete userJSON.password;
  delete userJSON.verified_otp;
  delete userJSON.forgot_otp;
  return userJSON;
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      include: { model: Store, as: "store" },
    });

    if (!user) {
      logger.info(`User with ID ${req.params.id} not found`);
      return sendResponse(res, "fail", "User not found", null, null, {
        userId: req.params.id,
      });
    }

    sendResponse(res, "success", "User profile retrieved successfully", {
      userProfile: excludeSensitiveInfo(user),
    });
  } catch (error) {
    logger.error(error);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};
exports.getUsersByStoreId = async (req, res) => {
  try {
    const { store_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: { store_id: store_id },
      include: { model: Store, as: "store" },
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });

    const totalPages = Math.ceil(count / limit);

    sendResponse(res, "success", "Users retrieved successfully", {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page, 10),
      users: rows.map(excludeSensitiveInfo),
    });
  } catch (error) {
    logger.error(error);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, role, store_id } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      logger.info(`User with ID ${req.params.id} not found`);
      return sendResponse(res, "fail", "User not found", null, null, {
        userId: req.params.id,
      });
    }

    user.username = username || user.username;
    user.role = role || user.role;
    user.store_id = store_id || user.store_id;
    await user.save();

    logger.info(`User profile updated for ID ${req.params.id}`);
    sendResponse(res, "success", "User profile updated successfully", {
      userProfile: excludeSensitiveInfo(user),
    });
  } catch (error) {
    logger.error(error);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
      include: { model: Store, as: "store" },
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });

    const totalPages = Math.ceil(count / limit);

    logger.info(`Users listed, page ${page}`);
    sendResponse(res, "success", "Users listed successfully", {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page, 10),
      users: rows.map(excludeSensitiveInfo),
    });
  } catch (error) {
    logger.error(error);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      logger.info(`User with ID ${req.params.id} not found`);
      return sendResponse(res, "fail", "User not found", null, null, {
        userId: req.params.id,
      });
    }

    await user.destroy();
    logger.info(`User with ID ${req.params.id} deleted`);
    sendResponse(res, "success", "User deleted successfully");
  } catch (error) {
    logger.error(error);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      include: { model: Store, as: "store" },
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
        ],
      },
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });

    const totalPages = Math.ceil(count / limit);
    logger.info(`Users searched with keyword "${keyword}", page ${page}`);

    sendResponse(res, "success", "Users searched successfully", {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page, 10),
      users: rows.map(excludeSensitiveInfo),
    });
  } catch (error) {
    logger.error(error);
    sendResponse(res, "fail", "Server error", null, error.message);
  }
};

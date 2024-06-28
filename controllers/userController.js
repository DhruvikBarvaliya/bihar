// controllers/userController.js
const { User, Store } = require("../config/sequelize");
const logger = require("../middlewares/logger");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
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
      order: [["updatedAt", "DESC"]],
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
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const { id } = decodedToken;
    req.body.updated_by = id;
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      logger.warn(`User not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "User not found", null, null, {
        userId: req.params.id,
      });
    }
    const userJSON = await User.findByPk(req.params.id);

    const updatedUser = userJSON.toJSON();
    delete updatedUser.password;
    delete updatedUser.verified_otp;
    delete updatedUser.forgot_otp;

    logger.info(`Updated user with ID: ${updatedUser.id}`);
    sendResponse(res, "success", "User updated successfully", {
      updatedUser,
    });
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    sendResponse(res, "fail", "Error updating user", null, error.message);
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
      order: [["updatedAt", "DESC"]],
    });

    const roles = [
      { original: "Super Admin", camelCase: "countOfSuperAdmin" },
      { original: "Admin", camelCase: "countOfAdmin" },
      { original: "JE", camelCase: "countOfJe" },
      { original: "AEE", camelCase: "countOfAee" },
      { original: "EEE", camelCase: "countOfEee" },
      { original: "ESE", camelCase: "countOfEse" },
      { original: "CE", camelCase: "countOfCe" },
      { original: "Store In Charge", camelCase: "countOfStoreInCharge" },
    ];

    // Initialize an object with roles in camelCase
    const roleCount = roles.reduce((acc, role) => {
      acc[role.camelCase] = 0;
      return acc;
    }, {});

    // Count the number of users for each role
    rows.forEach((user) => {
      const role = roles.find((r) => r.original === user.role);
      if (role) {
        roleCount[role.camelCase]++;
      }
    });
    const dashboardInfo = roleCount;

    const totalPages = Math.ceil(count / limit);

    logger.info(`Users listed, page ${page}`);
    sendResponse(res, "success", "Users listed successfully", {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page, 10),
      users: rows.map(excludeSensitiveInfo),
      dashboardInfo,
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
    const { keyword, page = 1, limit = 10, store_id } = req.query;
    const offset = (page - 1) * limit;
    const whereCondition = {
      [Op.or]: [
        { username: { [Op.iLike]: `%${keyword}%` } },
        { email: { [Op.iLike]: `%${keyword}%` } },
      ],
    };

    if (store_id) {
      whereCondition.store_id = store_id;
    }

    const { count, rows } = await User.findAndCountAll({
      include: { model: Store, as: "store" },
      where: whereCondition,
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      order: [["updatedAt", "DESC"]],
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

exports.searchStoreUsers = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      include: { model: Store, as: "store" },
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${keyword}%` } },
          { email: { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      order: [["updatedAt", "DESC"]],
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

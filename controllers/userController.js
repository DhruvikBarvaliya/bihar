const { User } = require("../config/sequelize");
const logger = require("../middlewares/logger");
const { Op } = require("sequelize");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      logger.info(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      logger.info(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();
    logger.info(`User profile updated for ID ${req.params.id}`);
    res.status(200).json(user);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const users = await User.findAndCountAll({
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });
    const totalPages = Math.ceil(users.count / limit);
    logger.info(`Users listed, page ${page}`);
    res.status(200).json({
      users: users.rows,
      totalPages,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      logger.info(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    logger.info(`User with ID ${req.params.id} deleted`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const users = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } }
        ]
      },
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });
    const totalPages = Math.ceil(users.count / limit);
    logger.info(`Users searched with keyword "${keyword}", page ${page}`);
    res.status(200).json({
      users: users.rows,
      totalPages,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

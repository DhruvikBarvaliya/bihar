const { Inventory } = require("../config/sequelize");
const { Op } = require("sequelize");
const logger = require("../middlewares/logger");

exports.createInventory = async (req, res) => {
  try {
    const { item_name, quantity, is_available, unit, description } = req.body;
    const inventory = await Inventory.create({
      item_name,
      quantity,
      is_available,
      unit,
      description,
    });
    logger.info("Inventory created: ", JSON.stringify(inventory));
    res.status(201).json(inventory);
  } catch (error) {
    logger.error("Error creating inventory: ", JSON.stringify(error));
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Inventory.findAndCountAll({
      offset,
      limit,
    });
    const totalPages = Math.ceil(count / limit);
    logger.info("All inventory retrieved");
    res.status(200).json({
      totalItems: count,
      totalPages,
      currentPage: parseInt(page),
      inventory: rows,
    });
  } catch (error) {
    logger.error("Error retrieving all inventory: ", JSON.stringify(error));
    res.status(500).json({ message: "Server error", error });
  }
};

exports.searchInventory = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const inventory = await Inventory.findAndCountAll({
      where: {
        item_name: {
          [Op.like]: `%${keyword}%`,
        },
      },
      offset,
      limit,
    });
    const totalPages = Math.ceil(inventory.count / limit);
    logger.info("Inventory search completed");
    res.status(200).json({
      totalItems: inventory.count,
      totalPages,
      currentPage: parseInt(page),
      inventory: inventory.rows,
    });
  } catch (error) {
    logger.error("Error searching inventory: ", JSON.stringify(error));
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      logger.error("Inventory not found");
      return res.status(404).json({ message: "Inventory not found" });
    }
    logger.info("Inventory retrieved by ID: ", JSON.stringify(inventory));
    res.status(200).json(inventory);
  } catch (error) {
    logger.error("Error retrieving inventory by ID: ", JSON.stringify(error));
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name, quantity, is_available, unit, description } = req.body;
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      logger.error("Inventory not found");
      return res.status(404).json({ message: "Inventory not found" });
    }
    const updatedInventory = await inventory.update({
      item_name,
      quantity,
      is_available,
      unit,
      description,
    });
    logger.info("Inventory updated: ", JSON.stringify(updatedInventory));
    res.status(200).json(updatedInventory);
  } catch (error) {
    logger.error("Error updating inventory: ", JSON.stringify(error));
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      logger.error("Inventory not found");
      return res.status(404).json({ message: "Inventory not found" });
    }
    await inventory.destroy();
    logger.info("Inventory deleted");
    res.status(204).end();
  } catch (error) {
    logger.error("Error deleting inventory: ", JSON.stringify(error));
    res.status(500).json({ message: "Server error", error });
  }
};

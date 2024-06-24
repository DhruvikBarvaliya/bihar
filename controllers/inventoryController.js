const { Inventory, Store } = require("../config/sequelize");
const { Op } = require("sequelize");
const logger = require("../middlewares/logger");
const sendResponse = require("../utils/responseHelper");

exports.createInventory = async (req, res) => {
  try {
    const {
      item_name,
      quantity,
      value,
      is_available,
      specification,
      notes,
      is_active,
      store_id,
      created_by,
      updated_by,
    } = req.body;
    const inventory = await Inventory.create({
      item_name,
      quantity,
      value,
      is_available,
      specification,
      notes,
      is_active,
      store_id,
      created_by,
      updated_by,
    });
    logger.info("Inventory created: ", JSON.stringify(inventory));
    sendResponse(res, "success", "Inventory created successfully", {
      inventory,
    });
  } catch (error) {
    logger.error("Error creating inventory: ", JSON.stringify(error));
    sendResponse(res, "fail", "Error creating inventory", null, error.message);
  }
};

exports.getAllInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Inventory.findAndCountAll({
      include: { model: Store, as: "store" },
      offset,
      limit,
    });
    const totalPages = Math.ceil(count / limit);
    const response = {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page),
      inventory: rows,
    };
    logger.info("All inventory retrieved");
    sendResponse(res, "success", "Inventory retrieved successfully", response);
  } catch (error) {
    logger.error("Error retrieving all inventory: ", JSON.stringify(error));
    sendResponse(
      res,
      "fail",
      "Error retrieving inventory",
      null,
      error.message
    );
  }
};

exports.searchInventory = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Inventory.findAndCountAll({
      include: { model: Store, as: "store" },
      where: { item_name: { [Op.like]: `%${keyword}%` } },
      offset,
      limit,
    });
    const totalPages = Math.ceil(count / limit);
    const response = {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page),
      inventory: rows,
    };
    logger.info("Inventory search completed");
    sendResponse(
      res,
      "success",
      "Inventory search completed successfully",
      response
    );
  } catch (error) {
    logger.error("Error searching inventory: ", JSON.stringify(error));
    sendResponse(res, "fail", "Error searching inventory", null, error.message);
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findOne({
      where: { id },
      include: { model: Store, as: "store" },
    });
    if (!inventory) {
      logger.error("Inventory not found");
      sendResponse(res, "fail", "Inventory not found", null, null, {
        inventoryId: id,
      });
    } else {
      logger.info("Inventory retrieved by ID: ", JSON.stringify(inventory));
      sendResponse(res, "success", "Inventory retrieved successfully", {
        inventory,
      });
    }
  } catch (error) {
    logger.error("Error retrieving inventory by ID: ", JSON.stringify(error));
    sendResponse(
      res,
      "fail",
      "Error retrieving inventory",
      null,
      error.message
    );
  }
};

exports.getInventoryByStoreId = async (req, res) => {
  try {
    const { store_id } = req.params;
    const inventory = await Inventory.findAll({
      where: { store_id },
      include: { model: Store, as: "store" },
    });
    if (!inventory) {
      logger.error("Inventory not found");
      sendResponse(res, "fail", "Inventory not found", null, null, {
        inventoryId: store_id,
      });
    } else {
      logger.info(
        "Inventory retrieved by Store ID: ",
        JSON.stringify(inventory)
      );
      sendResponse(res, "success", "Inventory retrieved successfully", {
        inventory,
      });
    }
  } catch (error) {
    logger.error(
      "Error retrieving inventory by Store ID: ",
      JSON.stringify(error)
    );
    sendResponse(
      res,
      "fail",
      "Error retrieving inventory",
      null,
      error.message
    );
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      item_name,
      quantity,
      value,
      is_available,
      specification,
      notes,
      is_active,
      store_id,
      created_by,
      updated_by,
    } = req.body;
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      logger.error("Inventory not found");
      sendResponse(res, "fail", "Inventory not found", null, null, {
        inventoryId: id,
      });
    } else {
      const updatedInventory = await inventory.update({
        item_name,
        quantity,
        value,
        is_available,
        specification,
        notes,
        is_active,
        store_id,
        created_by,
        updated_by,
      });
      logger.info("Inventory updated: ", JSON.stringify(updatedInventory));
      sendResponse(res, "success", "Inventory updated successfully", {
        updatedInventory,
      });
    }
  } catch (error) {
    logger.error("Error updating inventory: ", JSON.stringify(error));
    sendResponse(res, "fail", "Error updating inventory", null, error.message);
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const deleted = await Inventory.destroy({ where: { id: req.params.id } });
    if (deleted) {
      logger.info(`Deleted Inventory with ID: ${req.params.id}`);
      sendResponse(res, "success", "Inventory deleted successfully");
    } else {
      logger.warn(`Inventory not found with ID: ${req.params.id}`);
      sendResponse(res, "fail", "Inventory not found", null, null, {
        inventoryId: req.params.id,
      });
    }
  } catch (error) {
    logger.error(`Error deleting Inventory: ${error.message}`);
    sendResponse(res, "fail", "Error deleting inventory", null, error.message);
  }
};

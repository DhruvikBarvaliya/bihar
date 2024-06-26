const { validationResult } = require("express-validator");
const { Store } = require("../config/sequelize");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../middlewares/logger");
const sendResponse = require("../utils/responseHelper");
const { Op } = require("sequelize");
exports.createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        "fail",
        "Validation error",
        null,
        errors.array()
      );
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const { id } = decodedToken;
    req.body.created_by = id;
    req.body.updated_by = id;
    const store = await Store.create(req.body);
    logger.info(`Store created with ID: ${store.id}`);
    sendResponse(res, "success", "Store created successfully", { store });
  } catch (error) {
    logger.error(`Error creating store: ${error.message}`);
    sendResponse(res, "fail", "Error creating store", null, error.message);
  }
};

exports.getAllStore = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Store.findAndCountAll({ offset, limit });
    const totalPages = Math.ceil(count / limit);
    const response = {
      totalStores: count,
      totalPages,
      currentPage: parseInt(page),
      stores: rows,
    };
    logger.info(`Retrieved ${rows.length} stores`);
    sendResponse(res, "success", "Stores retrieved successfully", response);
  } catch (error) {
    logger.error(`Error retrieving stores: ${error.message}`);
    sendResponse(res, "fail", "Error retrieving stores", null, error.message);
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      logger.warn(`Store not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "Store not found", null, null, {
        storeId: req.params.id,
      });
    }
    logger.info(`Retrieved store with ID: ${store.id}`);
    sendResponse(res, "success", "Store retrieved successfully", { store });
  } catch (error) {
    logger.error(`Error retrieving store by ID: ${error.message}`);
    sendResponse(res, "fail", "Error retrieving store", null, error.message);
  }
};

exports.updateStore = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const { id } = decodedToken;
    req.body.updated_by = id;
    const [updated] = await Store.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      logger.warn(`Store not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "Store not found", null, null, {
        storeId: req.params.id,
      });
    }
    const updatedStore = await Store.findByPk(req.params.id);
    await new Promise(resolve => setTimeout(resolve, 2000));
    logger.info(`Updated store with ID: ${updatedStore.id}`);
    sendResponse(res, "success", "Store updated successfully", {
      updatedStore,
    });
  } catch (error) {
    logger.error(`Error updating store: ${error.message}`);
    sendResponse(res, "fail", "Error updating store", null, error.message);
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const deleted = await Store.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      logger.warn(`Store not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "Store not found", null, null, {
        storeId: req.params.id,
      });
    }
    logger.info(`Deleted store with ID: ${req.params.id}`);
    sendResponse(res, "success", "Store deleted successfully");
  } catch (error) {
    logger.error(`Error deleting store: ${error.message}`);
    sendResponse(res, "fail", "Error deleting store", null, error.message);
  }
};

exports.searchStore = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Store.findAndCountAll({
      where: { name: { [Op.iLike]: `%${keyword}%` } },
      offset,
      limit,
    });
    const totalPages = Math.ceil(count / limit);
    const response = {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page),
      stores: rows,
    };
    logger.info("Store search completed");
    sendResponse(
      res,
      "success",
      "Store search completed successfully",
      response
    );
  } catch (error) {
    logger.error("Error searching Store: ", JSON.stringify(error));
    sendResponse(res, "fail", "Error searching Store", null, error.message);
  }
};

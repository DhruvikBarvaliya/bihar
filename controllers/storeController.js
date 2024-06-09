const { Store } = require("../config/sequelize");
const logger = require("../middlewares/logger");
const sendResponse = require("../utils/responseHelper");

exports.createStore = async (req, res) => {
  try {
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
    const stores = await Store.findAndCountAll({
      offset,
      limit,
    });
    const totalPages = Math.ceil(stores.count / limit);
    const response = {
      totalStores: stores.count,
      totalPages,
      currentPage: parseInt(page),
      stores: stores.rows,
    };
    logger.info(`Retrieved ${stores.rows.length} stores`);
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
      sendResponse(res, "fail", "Store not found", null, null, {
        storeId: req.params.id,
      });
    } else {
      logger.info(`Retrieved store with ID: ${store.id}`);
      sendResponse(res, "success", "Store retrieved successfully", { store });
    }
  } catch (error) {
    logger.error(`Error retrieving store by ID: ${error.message}`);
    sendResponse(res, "fail", "Error retrieving store", null, error.message);
  }
};

exports.updateStore = async (req, res) => {
  try {
    const [updated] = await Store.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedStore = await Store.findByPk(req.params.id);
      logger.info(`Updated store with ID: ${updatedStore.id}`);
      sendResponse(res, "success", "Store updated successfully", {
        updatedStore,
      });
    } else {
      logger.warn(`Store not found with ID: ${req.params.id}`);
      sendResponse(res, "fail", "Store not found", null, null, {
        storeId: req.params.id,
      });
    }
  } catch (error) {
    logger.error(`Error updating store: ${error.message}`);
    sendResponse(res, "fail", "Error updating store", null, error.message);
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const deleted = await Store.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      logger.info(`Deleted store with ID: ${req.params.id}`);
      sendResponse(res, "success", "Store deleted successfully");
    } else {
      logger.warn(`Store not found with ID: ${req.params.id}`);
      sendResponse(res, "fail", "Store not found", null, null, {
        storeId: req.params.id,
      });
    }
  } catch (error) {
    logger.error(`Error deleting store: ${error.message}`);
    sendResponse(res, "fail", "Error deleting store", null, error.message);
  }
};

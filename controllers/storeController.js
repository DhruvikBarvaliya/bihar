const { Store } = require("../config/sequelize");
const logger = require("../middlewares/logger");

exports.createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    logger.info(`Store created with ID: ${store.id}`);
    res.status(201).json(store);
  } catch (error) {
    logger.error(`Error creating store: ${error.message}`);
    res.status(400).json({ error: error.message });
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
    res.json(response);
  } catch (error) {
    logger.error(`Error retrieving stores: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      logger.warn(`Store not found with ID: ${req.params.id}`);
      res.status(404).json({ error: "Store not found" });
    } else {
      logger.info(`Retrieved store with ID: ${store.id}`);
      res.json(store);
    }
  } catch (error) {
    logger.error(`Error retrieving store by ID: ${error.message}`);
    res.status(500).json({ error: error.message });
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
      res.json(updatedStore);
    } else {
      logger.warn(`Store not found with ID: ${req.params.id}`);
      res.status(404).json({ error: "Store not found" });
    }
  } catch (error) {
    logger.error(`Error updating store: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const deleted = await Store.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      logger.info(`Deleted store with ID: ${req.params.id}`);
      res.status(204).send();
    } else {
      logger.warn(`Store not found with ID: ${req.params.id}`);
      res.status(404).json({ error: "Store not found" });
    }
  } catch (error) {
    logger.error(`Error deleting store: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

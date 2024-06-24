const { validationResult } = require("express-validator");
const { Unit } = require("../config/sequelize");
const logger = require("../middlewares/logger");
const sendResponse = require("../utils/responseHelper");
const { Op } = require("sequelize");
exports.createUnit = async (req, res) => {
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

    const unit = await Unit.create(req.body);
    logger.info(`Unit created with ID: ${unit.id}`);
    sendResponse(res, "success", "Unit created successfully", { unit });
  } catch (error) {
    logger.error(`Error creating unit: ${error.message}`);
    sendResponse(res, "fail", "Error creating unit", null, error.message);
  }
};

exports.getAllUnit = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Unit.findAndCountAll({ offset, limit });
    const totalPages = Math.ceil(count / limit);
    const response = {
      totalUnit: count,
      totalPages,
      currentPage: parseInt(page),
      units: rows,
    };
    logger.info(`Retrieved ${rows.length} units`);
    sendResponse(res, "success", "Unit retrieved successfully", response);
  } catch (error) {
    logger.error(`Error retrieving units: ${error.message}`);
    sendResponse(
      res,
      "fail",
      "Error retrieving units",
      null,
      error.message
    );
  }
};

exports.getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) {
      logger.warn(`Unit not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "Unit not found", null, null, {
        unitId: req.params.id,
      });
    }
    logger.info(`Retrieved unit with ID: ${unit.id}`);
    sendResponse(res, "success", "Unit retrieved successfully", {
      unit,
    });
  } catch (error) {
    logger.error(`Error retrieving unit by ID: ${error.message}`);
    sendResponse(res, "fail", "Error retrieving unit", null, error.message);
  }
};

exports.updateUnit = async (req, res) => {
  try {
    const [updated] = await Unit.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      logger.warn(`Unit not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "Unit not found", null, null, {
        unitId: req.params.id,
      });
    }
    const updatedUnit = await Unit.findByPk(req.params.id);
    logger.info(`Updated unit with ID: ${updatedUnit.id}`);
    sendResponse(res, "success", "Unit updated successfully", {
      updatedUnit,
    });
  } catch (error) {
    logger.error(`Error updating unit: ${error.message}`);
    sendResponse(res, "fail", "Error updating unit", null, error.message);
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    const deleted = await Unit.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      logger.warn(`Unit not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "Unit not found", null, null, {
        unitId: req.params.id,
      });
    }
    logger.info(`Deleted unit with ID: ${req.params.id}`);
    sendResponse(res, "success", "Unit deleted successfully");
  } catch (error) {
    logger.error(`Error deleting unit: ${error.message}`);
    sendResponse(res, "fail", "Error deleting unit", null, error.message);
  }
};

exports.searchUnit = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Unit.findAndCountAll({
      where: { unit_name: { [Op.like]: `%${keyword}%` } },
      offset,
      limit,
    });
    const totalPages = Math.ceil(count / limit);
    const response = {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page),
      units: rows,
    };
    logger.info("Unit search completed");
    sendResponse(
      res,
      "success",
      "Unit search completed successfully",
      response
    );
  } catch (error) {
    logger.error("Error searching Unit: ", JSON.stringify(error));
    sendResponse(res, "fail", "Error searching Unit", null, error.message);
  }
};

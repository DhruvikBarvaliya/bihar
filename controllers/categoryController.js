const { validationResult } = require("express-validator");
const { Category } = require("../config/sequelize");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../middlewares/logger");
const sendResponse = require("../utils/responseHelper");
const { Op } = require("sequelize");
exports.createCategory = async (req, res) => {
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
    const category = await Category.create(req.body);
    logger.info(`Category created with ID: ${category.id}`);
    sendResponse(res, "success", "Category created successfully", { category });
  } catch (error) {
    logger.error(`Error creating category: ${error.message}`);
    sendResponse(res, "fail", "Error creating category", null, error.message);
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Category.findAndCountAll({ offset, limit });
    const totalPages = Math.ceil(count / limit);
    const response = {
      totalCategory: count,
      totalPages,
      currentPage: parseInt(page),
      categories: rows,
    };
    logger.info(`Retrieved ${rows.length} categories`);
    sendResponse(res, "success", "Category retrieved successfully", response);
  } catch (error) {
    logger.error(`Error retrieving categories: ${error.message}`);
    sendResponse(
      res,
      "fail",
      "Error retrieving categories",
      null,
      error.message
    );
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      logger.warn(`Category not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "Category not found", null, null, {
        categoryId: req.params.id,
      });
    }
    logger.info(`Retrieved category with ID: ${category.id}`);
    sendResponse(res, "success", "Category retrieved successfully", {
      category,
    });
  } catch (error) {
    logger.error(`Error retrieving category by ID: ${error.message}`);
    sendResponse(res, "fail", "Error retrieving category", null, error.message);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const { id } = decodedToken;
    req.body.updated_by = id;
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      logger.warn(`Category not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "Category not found", null, null, {
        categoryId: req.params.id,
      });
    }
    const updatedCategory = await Category.findByPk(req.params.id);
    logger.info(`Updated category with ID: ${updatedCategory.id}`);
    sendResponse(res, "success", "Category updated successfully", {
      updatedCategory,
    });
  } catch (error) {
    logger.error(`Error updating category: ${error.message}`);
    sendResponse(res, "fail", "Error updating category", null, error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      logger.warn(`Category not found with ID: ${req.params.id}`);
      return sendResponse(res, "fail", "Category not found", null, null, {
        categoryId: req.params.id,
      });
    }
    logger.info(`Deleted category with ID: ${req.params.id}`);
    sendResponse(res, "success", "Category deleted successfully");
  } catch (error) {
    logger.error(`Error deleting category: ${error.message}`);
    sendResponse(res, "fail", "Error deleting category", null, error.message);
  }
};

exports.searchCategory = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Category.findAndCountAll({
      where: { category_name: { [Op.iLike]: `%${keyword}%` } },
      offset,
      limit,
    });
    const totalPages = Math.ceil(count / limit);
    const response = {
      totalItems: count,
      totalPages,
      currentPage: parseInt(page),
      categories: rows,
    };
    logger.info("Category search completed");
    sendResponse(
      res,
      "success",
      "Category search completed successfully",
      response
    );
  } catch (error) {
    logger.error("Error searching Category: ", JSON.stringify(error));
    sendResponse(res, "fail", "Error searching Category", null, error.message);
  }
};

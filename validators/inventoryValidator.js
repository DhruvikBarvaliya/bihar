const { check, validationResult } = require("express-validator");

exports.validateInventory = [
  check("item_name").notEmpty().withMessage("Item name is required"),
  check("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
  check("is_available")
    .isBoolean()
    .withMessage("Availability status must be a boolean"),
  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  check("store_id").notEmpty().withMessage("Store ID is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return sendResponse(
        res,
        "fail",
        "Validation errors",
        null,
        null,
        errorMessages
      );
    }
    next();
  },
];

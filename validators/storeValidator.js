const { body } = require("express-validator");

// Validation rules for creating a store
exports.createStoreValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("location").notEmpty().withMessage("Location is required"),
];

// Validation rules for updating a store
exports.updateStoreValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("location").notEmpty().withMessage("Location is required"),
];

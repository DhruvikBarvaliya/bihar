// routes/category.js

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing category
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - category_name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         category_name:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all category
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of all category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/category", authenticate, categoryController.getAllCategory);

/**
 * @swagger
 * /category/search:
 *   get:
 *     summary: Search category items
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Category search completed successfully
 *       500:
 *         description: Server error
 */
router.get("/category/search", authenticate, categoryController.searchCategory);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get("/category/:id", authenticate, categoryController.getCategoryById);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 */
router.post(
  "/category",
  authenticate,
  authorize(["Super Admin", "Admin", "CE"]),
  categoryController.createCategory
);

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 */
router.put(
  "/category/:id",
  authenticate,
  authorize(["Super Admin", "Admin", "CE"]),
  categoryController.updateCategory
);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete(
  "/category/:id",
  authenticate,
  authorize(["Super Admin", "Admin", "CE"]),
  categoryController.deleteCategory
);

module.exports = router;

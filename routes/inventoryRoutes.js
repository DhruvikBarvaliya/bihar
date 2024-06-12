const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { validateInventory } = require("../validators/inventoryValidator");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       required:
 *         - item_name
 *         - quantity
 *         - is_available
 *         - store_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         item_name:
 *           type: string
 *         quantity:
 *           type: integer
 *         is_available:
 *           type: boolean
 *         description:
 *           type: string
 *         store_id:
 *           type: string
 */

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       201:
 *         description: Inventory created successfully
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Server error
 */
router.post(
  "/inventory",
  authenticate,
  authorize(["Super Admin", "Admin", "CE"]),
  validateInventory,
  inventoryController.createInventory
);

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     parameters:
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
 *         description: Inventory retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/inventory", authenticate, inventoryController.getAllInventory);

/**
 * @swagger
 * /inventory/search:
 *   get:
 *     summary: Search inventory items
 *     tags: [Inventory]
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
 *         description: Inventory search completed successfully
 *       500:
 *         description: Server error
 */
router.get(
  "/inventory/search",
  authenticate,
  inventoryController.searchInventory
);

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Server error
 */
router.get("/inventory/:id", inventoryController.getInventoryById);

/**
 * @swagger
 * /inventory/store/{store_id}:
 *   get:
 *     summary: Get inventory item by Store ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: store_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Server error
 */
router.get("/inventory/store/:store_id", inventoryController.getInventoryByStoreId);

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Update inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Server error
 */
router.put(
  "/inventory/:id",
  authenticate,
  authorize(["Super Admin", "Admin", "CE"]),
  validateInventory,
  inventoryController.updateInventory
);

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Delete inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory deleted successfully
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/inventory/:id",
  authenticate,
  authorize(["Super Admin", "Admin", "CE"]),
  inventoryController.deleteInventory
);

module.exports = router;

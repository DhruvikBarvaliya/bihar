const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       required:
 *         - item_name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the inventory item
 *         item_name:
 *           type: string
 *           description: The name of the inventory item
 *         quantity:
 *           type: integer
 *           description: The quantity of the inventory item
 *           default: 0
 *         is_available:
 *           type: boolean
 *           description: Availability status of the inventory item
 *           default: false
 *         unit:
 *           type: integer
 *           description: Unit of the inventory item
 *         description:
 *           type: string
 *           description: Description of the inventory item
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the inventory item was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the inventory item was last updated
 */

/**
 * @swagger
 * /inventory/create:
 *   post:
 *     summary: Create new inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       500:
 *         description: Server error
 */
router.post(
  "/inventory/create",
  authenticate,
  authorize(["SUPER_ADMIN", "ADMIN", "CE"]),
  inventoryController.createInventory,
);

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get inventory overview
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: Inventory overview retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 inventory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryItem'
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
 *         required: true
 *         schema:
 *           type: string
 *         description: Keyword to search for in inventory items
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: Inventory items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 inventory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryItem'
 *       500:
 *         description: Server error
 */
router.get(
  "/inventory/search",
  authenticate,
  inventoryController.searchInventory,
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
 *           format: uuid
 *         description: ID of the inventory item to retrieve
 *     responses:
 *       200:
 *         description: Inventory item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Server error
 */
router.get(
  "/inventory/:id",
  authenticate,
  inventoryController.getInventoryById,
);

/**
 * @swagger
 * /inventory/update/{id}:
 *   put:
 *     summary: Update inventory item
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the inventory item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Server error
 */
router.put(
  "/inventory/update/:id",
  authenticate,
  authorize(["SUPER_ADMIN", "ADMIN", "CE"]),
  inventoryController.updateInventory,
);

/**
 * @swagger
 * /inventory/delete/{id}:
 *   delete:
 *     summary: Delete inventory item
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the inventory item to delete
 *     responses:
 *       204:
 *         description: Inventory item deleted successfully
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/inventory/delete/:id",
  authenticate,
  authorize(["SUPER_ADMIN", "ADMIN", "CE"]),
  inventoryController.deleteInventory,
);

module.exports = router;

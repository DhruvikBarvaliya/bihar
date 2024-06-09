// routes/stores.js
const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       required:
 *         - name
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: API for managing stores
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Get all stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: List of all stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get("/store", authenticate, storeController.getAllStore);

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Get a store by ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Store not found
 */
router.get("/store/:id", authenticate, storeController.getStoreById);

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       201:
 *         description: Store created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Invalid input
 */
router.post(
  "/store",
  authenticate,
  authorize(["SUPER_ADMIN", "ADMIN", "CE"]),
  storeController.createStore,
);

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Update a store by ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Store updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Store not found
 */
router.put(
  "/store/:id",
  authenticate,
  authorize(["SUPER_ADMIN", "ADMIN", "CE"]),
  storeController.updateStore,
);

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Delete a store by ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       204:
 *         description: Store deleted
 *       404:
 *         description: Store not found
 */
router.delete(
  "/store/:id",
  authenticate,
  authorize(["SUPER_ADMIN", "ADMIN", "CE"]),
  storeController.deleteStore,
);

module.exports = router;

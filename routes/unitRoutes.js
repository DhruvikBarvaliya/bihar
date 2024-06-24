// routes/unit.js

const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing unit
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Unit:
 *       type: object
 *       required:
 *         - unit_name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         unit_name:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /unit:
 *   get:
 *     summary: Get all unit
 *     tags: [Unit]
 *     responses:
 *       200:
 *         description: List of all unit
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Unit'
 */
router.get("/unit", authenticate, unitController.getAllUnit);

/**
 * @swagger
 * /unit/search:
 *   get:
 *     summary: Search unit items
 *     tags: [Unit]
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
 *         description: Unit search completed successfully
 *       500:
 *         description: Server error
 */
router.get("/unit/search", authenticate, unitController.searchUnit);

/**
 * @swagger
 * /unit/{id}:
 *   get:
 *     summary: Get a unit by ID
 *     tags: [Unit]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unit ID
 *     responses:
 *       200:
 *         description: Unit data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *       404:
 *         description: Unit not found
 */
router.get("/unit/:id", authenticate, unitController.getUnitById);

/**
 * @swagger
 * /unit:
 *   post:
 *     summary: Create a new unit
 *     tags: [Unit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unit'
 *     responses:
 *       201:
 *         description: Unit created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *       400:
 *         description: Invalid input
 */
router.post(
  "/unit",
  authenticate,
  authorize(["Super Admin", "Admin", "CE"]),
  unitController.createUnit
);

/**
 * @swagger
 * /unit/{id}:
 *   put:
 *     summary: Update a unit by ID
 *     tags: [Unit]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unit'
 *     responses:
 *       200:
 *         description: Unit updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Unit not found
 */
router.put(
  "/unit/:id",
  authenticate,
  authorize(["Super Admin", "Admin", "CE"]),
  unitController.updateUnit
);

/**
 * @swagger
 * /unit/{id}:
 *   delete:
 *     summary: Delete a unit by ID
 *     tags: [Unit]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unit ID
 *     responses:
 *       204:
 *         description: Unit deleted
 *       404:
 *         description: Unit not found
 */
router.delete(
  "/unit/:id",
  authenticate,
  authorize(["Super Admin", "Admin", "CE"]),
  unitController.deleteUnit
);

module.exports = router;

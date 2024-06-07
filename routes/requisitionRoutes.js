const express = require("express");
const router = express.Router();
const requisitionController = require("../controllers/requisitionController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Requisitions
 *   description: Material requisition endpoints
 */

/**
 * @swagger
 * /requisitions:
 *   post:
 *     summary: Submit a new requisition
 *     tags: [Requisitions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               purpose:
 *                 type: string
 *               required_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Requisition submitted successfully
 *       500:
 *         description: Server error
 */
router.post(
  "/requisitions",
  authenticate,
  authorize(["StoreInCharge"]),
  requisitionController.submitRequisition
);

/**
 * @swagger
 * /requisitions/{id}/status:
 *   get:
 *     summary: Get requisition status
 *     tags: [Requisitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Requisition ID
 *     responses:
 *       200:
 *         description: Requisition status
 *       404:
 *         description: Requisition not found
 *       500:
 *         description: Server error
 */
router.get(
  "/requisitions/:id/status",
  authenticate,
  requisitionController.getRequisitionStatus
);

/**
 * @swagger
 * /requisitions/{id}/approve:
 *   put:
 *     summary: Approve a requisition
 *     tags: [Requisitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Requisition ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected]
 *               notes:
 *                 type: string
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Requisition approved/rejected
 *       404:
 *         description: Requisition not found
 *       500:
 *         description: Server error
 */
router.put(
  "/requisitions/:id/approve",
  authenticate,
  authorize(["JE", "AEE", "EEE", "ESE", "CE"]),
  requisitionController.approveRequisition
);

/**
 * @swagger
 * /requisitions:
 *   get:
 *     summary: List all requisitions
 *     tags: [Requisitions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requisitions
 *       500:
 *         description: Server error
 */
router.get(
  "/requisitions",
  authenticate,
  authorize(["AEE", "EEE", "ESE", "CE", "StoreInCharge"]),
  requisitionController.listRequisitions
);

module.exports = router;

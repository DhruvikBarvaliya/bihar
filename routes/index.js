const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const storeRoutes = require("./storeRoutes");
const categoryRoutes = require("./categoryRoutes");
const unitRoutes = require("./unitRoutes");

router.get("/", (req, res) => {
  res.send("Inside Index Router");
});

router.use("/v1", authRoutes, userRoutes, storeRoutes, inventoryRoutes,categoryRoutes,unitRoutes);

module.exports = router;

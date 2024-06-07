const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const storeRoutes = require("./storeRoutes");
const requisitionRoutes = require("./requisitionRoutes");

router.get("/", (req, res) => {
  res.send("Inside Index Router");
});

router.use(
  "/v1",
  authRoutes,
  userRoutes,
  inventoryRoutes,
  storeRoutes,
  requisitionRoutes
);

module.exports = router;

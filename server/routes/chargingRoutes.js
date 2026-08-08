const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addCharging,
  getChargingHistory,
  getChargingByVehicle,
  updateCharging,
  deleteCharging,
} = require("../controllers/chargingController");

// Add Charging
router.post(
  "/",
  authMiddleware,
  addCharging
);

// Get Charging History
router.get(
  "/",
  authMiddleware,
  getChargingHistory
);

// Get Charging History By Vehicle
router.get(
  "/vehicle/:vehicleId",
  authMiddleware,
  getChargingByVehicle
);

// Update Charging
router.put(
  "/:id",
  authMiddleware,
  updateCharging
);

// Delete Charging
router.delete(
  "/:id",
  authMiddleware,
  deleteCharging
);

module.exports = router;
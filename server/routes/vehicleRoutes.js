const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addVehicle,
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
  getVehicleById,
} = require("../controllers/vehicleController");

// Add Vehicle
router.post(
  "/",
  authMiddleware,
  addVehicle
);

// Get My Vehicles
router.get(
  "/",
  authMiddleware,
  getMyVehicles
);

// Update Vehicle
router.put(
  "/:id",
  authMiddleware,
  updateVehicle
);

// Delete Vehicle
router.delete(
  "/:id",
  authMiddleware,
  deleteVehicle
);

// Get Single Vehicle
router.get(
  "/:id",
  authMiddleware,
  getVehicleById
);

module.exports = router;
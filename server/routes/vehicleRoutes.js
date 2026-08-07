const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addVehicle,
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

// Add Vehicle
router.post("/", authMiddleware, addVehicle);

// Get Logged-in User Vehicles
router.get("/", authMiddleware, getMyVehicles);

// Update Vehicle
router.put("/:id", authMiddleware, updateVehicle);

// Delete Vehicle
router.delete("/:id", authMiddleware, deleteVehicle);

module.exports = router;
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addService,
  getMyServices,
  updateService,
  deleteService,
  getServicesByVehicle,
} = require("../controllers/serviceController");

// Add Service
router.post("/", authMiddleware, addService);

// Get My Services
router.get("/", authMiddleware, getMyServices);

// Get Services By Vehicle
router.get("/vehicle/:vehicleId", authMiddleware, getServicesByVehicle);

// Update Service
router.put("/:id", authMiddleware, updateService);

// Delete Service
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;
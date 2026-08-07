const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addService,
  getMyServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Add Service
router.post("/", authMiddleware, addService);

// Get My Services
router.get("/", authMiddleware, getMyServices);

// Update Service
router.put("/:id", authMiddleware, updateService);

// Delete Service
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addFuel,
  getFuelHistory,
  updateFuel,
  deleteFuel,
  getFuelByVehicle,
} = require("../controllers/fuelController");

router.post("/", authMiddleware, addFuel);

router.get("/", authMiddleware, getFuelHistory);

router.get("/vehicle/:vehicleId", authMiddleware, getFuelByVehicle);

router.put("/:id", authMiddleware, updateFuel);

router.delete("/:id", authMiddleware, deleteFuel);

module.exports = router;
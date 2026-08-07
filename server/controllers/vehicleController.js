const Vehicle = require("../models/Vehicle");

// Add Vehicle
const addVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      registrationNumber,
      fuelType,
      odometer,
    } = req.body;

    const vehicle = await Vehicle.create({
      owner: req.user.id,
      brand,
      model,
      year,
      registrationNumber,
      fuelType,
      odometer,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle Added Successfully",
      vehicle,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get My Vehicles
const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    Object.assign(vehicle, req.body);

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: "Vehicle Updated Successfully",
      vehicle,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addVehicle,
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
};
const Fuel = require("../models/Fuel");

// Add Fuel
const addFuel = async (req, res) => {
  try {
    const {
      vehicle,
      fuelType,
      litres,
      amount,
      odometer,
      fuelDate,
      station,
      notes,
    } = req.body;

    const fuel = await Fuel.create({
      vehicle,
      owner: req.user.id,
      fuelType,
      litres,
      amount,
      odometer,
      fuelDate,
      station,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Fuel Entry Added Successfully",
      fuel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Fuel History
const getFuelHistory = async (req, res) => {
  try {
    const filter = {
      owner: req.user.id,
    };

    // If a vehicle ID is provided,
    // show fuel history only for that vehicle
    if (req.query.vehicle) {
      filter.vehicle = req.query.vehicle;
    }

    const fuelHistory = await Fuel.find(filter)
      .populate(
        "vehicle",
        "brand model registrationNumber"
      )
      .sort({ fuelDate: -1 });

    res.status(200).json({
      success: true,
      count: fuelHistory.length,
      fuelHistory,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Fuel Entry
const updateFuel = async (req, res) => {
  try {
    const fuel = await Fuel.findById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel Entry Not Found",
      });
    }

    if (fuel.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedFuel = await Fuel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Fuel Entry Updated Successfully",
      fuel: updatedFuel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Fuel Entry
const deleteFuel = async (req, res) => {
  try {
    const fuel = await Fuel.findById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel Entry Not Found",
      });
    }

    if (fuel.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Fuel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Fuel Entry Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Fuel History By Vehicle
const getFuelByVehicle = async (req, res) => {
  try {
    const fuelHistory = await Fuel.find({
      vehicle: req.params.vehicleId,
      owner: req.user.id,
    }).sort({ fuelDate: -1 });

    res.status(200).json({
      success: true,
      count: fuelHistory.length,
      fuelHistory,
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
  addFuel,
  getFuelHistory,
  updateFuel,
  deleteFuel,
  getFuelByVehicle,
};
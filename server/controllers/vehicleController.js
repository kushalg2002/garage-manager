const Vehicle = require("../models/Vehicle");

// ==========================================
// ADD VEHICLE
// ==========================================

const addVehicle = async (req, res) => {
  try {
    console.log("=================================");
    console.log("ADD VEHICLE REQUEST");
    console.log("BODY:", req.body);
    console.log("=================================");

    const {
      vehicleType,
      brand,
      model,
      year,
      registrationNumber,
      fuelType,
      odometer,
    } = req.body;

    // Vehicle type validation
    if (
      vehicleType !== "2 Wheeler" &&
      vehicleType !== "4 Wheeler"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select 2 Wheeler or 4 Wheeler",
      });
    }

    // 2 Wheeler fuel validation
    if (vehicleType === "2 Wheeler") {
      if (
        fuelType !== "Petrol" &&
        fuelType !== "Electric"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "2 Wheeler supports only Petrol and EV",
        });
      }
    }

    // 4 Wheeler fuel validation
    if (vehicleType === "4 Wheeler") {
      if (
        ![
          "Petrol",
          "Diesel",
          "CNG",
          "Electric",
        ].includes(fuelType)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "4 Wheeler supports Petrol, Diesel, CNG and EV",
        });
      }
    }

    // Create vehicle
    const vehicle = await Vehicle.create({
      owner: req.user.id,
      vehicleType: vehicleType,
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      registrationNumber:
        registrationNumber
          .trim()
          .toUpperCase(),
      fuelType: fuelType,
      odometer: Number(odometer || 0),
    });

    console.log(
      "VEHICLE SAVED:",
      vehicle
    );

    res.status(201).json({
      success: true,
      message:
        "Vehicle Added Successfully",
      vehicle,
    });
  } catch (error) {
    console.error(
      "ADD VEHICLE ERROR:",
      error
    );

    // Duplicate registration number
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Registration number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY VEHICLES
// ==========================================

const getMyVehicles = async (req, res) => {
  try {
    const vehicles =
      await Vehicle.find({
        owner: req.user.id,
      }).sort({
        createdAt: -1,
      });

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

// ==========================================
// UPDATE VEHICLE
// ==========================================

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle =
      await Vehicle.findOne({
        _id: id,
        owner: req.user.id,
      });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const {
      vehicleType,
      brand,
      model,
      year,
      registrationNumber,
      fuelType,
      odometer,
    } = req.body;

    // Vehicle type validation
    if (
      vehicleType !== "2 Wheeler" &&
      vehicleType !== "4 Wheeler"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select 2 Wheeler or 4 Wheeler",
      });
    }

    // 2 Wheeler validation
    if (vehicleType === "2 Wheeler") {
      if (
        fuelType !== "Petrol" &&
        fuelType !== "Electric"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "2 Wheeler supports only Petrol and EV",
        });
      }
    }

    // 4 Wheeler validation
    if (vehicleType === "4 Wheeler") {
      if (
        ![
          "Petrol",
          "Diesel",
          "CNG",
          "Electric",
        ].includes(fuelType)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "4 Wheeler supports Petrol, Diesel, CNG and EV",
        });
      }
    }

    // Update vehicle
    vehicle.vehicleType =
      vehicleType;

    vehicle.brand =
      brand.trim();

    vehicle.model =
      model.trim();

    vehicle.year =
      Number(year);

    vehicle.registrationNumber =
      registrationNumber
        .trim()
        .toUpperCase();

    vehicle.fuelType =
      fuelType;

    vehicle.odometer =
      Number(odometer || 0);

    await vehicle.save();

    res.status(200).json({
      success: true,
      message:
        "Vehicle Updated Successfully",
      vehicle,
    });
  } catch (error) {
    console.error(
      "UPDATE VEHICLE ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Registration number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE VEHICLE
// ==========================================

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle =
      await Vehicle.findOneAndDelete({
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
      message:
        "Vehicle Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET SINGLE VEHICLE
// ==========================================

const getVehicleById = async (req, res) => {
  try {
    const vehicle =
      await Vehicle.findOne({
        _id: req.params.id,
        owner: req.user.id,
      });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle Not Found",
      });
    }

    res.status(200).json({
      success: true,
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

module.exports = {
  addVehicle,
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
  getVehicleById,
};
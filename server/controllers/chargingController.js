const Charging = require("../models/Charging");

// ==========================================
// ADD CHARGING
// ==========================================

const addCharging = async (req, res) => {
  try {
    const {
      vehicle,
      units,
      amount,
      odometer,
      chargingDate,
      station,
      notes,
    } = req.body;

    const charging = await Charging.create({
      vehicle,
      owner: req.user.id,
      units,
      amount,
      odometer,
      chargingDate,
      station,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Charging Entry Added Successfully",
      charging,
    });
  } catch (error) {
    console.error("Add Charging Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET ALL CHARGING HISTORY
// ==========================================

const getChargingHistory = async (req, res) => {
  try {
    const filter = {
      owner: req.user.id,
    };

    if (req.query.vehicle) {
      filter.vehicle = req.query.vehicle;
    }

    const chargingHistory = await Charging.find(
      filter
    )
      .populate(
        "vehicle",
        "brand model registrationNumber"
      )
      .sort({
        chargingDate: -1,
      });

    res.status(200).json({
      success: true,
      count: chargingHistory.length,
      chargingHistory,
    });
  } catch (error) {
    console.error(
      "Get Charging History Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET CHARGING BY VEHICLE
// ==========================================

const getChargingByVehicle = async (
  req,
  res
) => {
  try {
    const chargingHistory =
      await Charging.find({
        vehicle: req.params.vehicleId,
        owner: req.user.id,
      })
        .populate(
          "vehicle",
          "brand model registrationNumber"
        )
        .sort({
          chargingDate: -1,
        });

    res.status(200).json({
      success: true,
      count: chargingHistory.length,
      chargingHistory,
    });
  } catch (error) {
    console.error(
      "Get Charging By Vehicle Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// UPDATE CHARGING
// ==========================================

const updateCharging = async (req, res) => {
  try {
    const charging = await Charging.findById(
      req.params.id
    );

    if (!charging) {
      return res.status(404).json({
        success: false,
        message: "Charging Entry Not Found",
      });
    }

    if (
      charging.owner.toString() !==
      req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedCharging =
      await Charging.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Charging Entry Updated Successfully",
      charging: updatedCharging,
    });
  } catch (error) {
    console.error(
      "Update Charging Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// DELETE CHARGING
// ==========================================

const deleteCharging = async (req, res) => {
  try {
    const charging = await Charging.findById(
      req.params.id
    );

    if (!charging) {
      return res.status(404).json({
        success: false,
        message: "Charging Entry Not Found",
      });
    }

    if (
      charging.owner.toString() !==
      req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Charging.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Charging Entry Deleted Successfully",
    });
  } catch (error) {
    console.error(
      "Delete Charging Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addCharging,
  getChargingHistory,
  getChargingByVehicle,
  updateCharging,
  deleteCharging,
};
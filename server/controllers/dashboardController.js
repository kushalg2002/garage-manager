const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const Fuel = require("../models/Fuel");

const getDashboardStats = async (req, res) => {
  try {
    const owner = req.user.id;

    const vehicles = await Vehicle.find({ owner });
    const services = await Service.find({ owner });
    const fuelHistory = await Fuel.find({ owner });

    const totalFuelCost = fuelHistory.reduce(
      (sum, fuel) => sum + fuel.amount,
      0
    );

    const totalServiceCost = services.reduce(
      (sum, service) => sum + service.cost,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        totalVehicles: vehicles.length,
        totalServices: services.length,
        totalFuelEntries: fuelHistory.length,
        totalFuelCost,
        totalServiceCost,
        totalExpense: totalFuelCost + totalServiceCost,
      },
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
  getDashboardStats,
};
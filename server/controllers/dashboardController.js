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
      (sum, fuel) => sum + Number(fuel.amount || 0),
      0
    );

    const totalServiceCost = services.reduce(
      (sum, service) => sum + Number(service.cost || 0),
      0
    );

    // Calculate expenses for each vehicle
    const vehicleExpenses = vehicles.map((vehicle) => {
      const vehicleServices = services.filter(
        (service) =>
          service.vehicle &&
          service.vehicle.toString() ===
            vehicle._id.toString()
      );

      const vehicleFuel = fuelHistory.filter(
        (fuel) =>
          fuel.vehicle &&
          fuel.vehicle.toString() ===
            vehicle._id.toString()
      );

      const serviceCost = vehicleServices.reduce(
        (sum, service) =>
          sum + Number(service.cost || 0),
        0
      );

      const fuelCost = vehicleFuel.reduce(
        (sum, fuel) =>
          sum + Number(fuel.amount || 0),
        0
      );

      return {
        vehicleId: vehicle._id,
        brand: vehicle.brand,
        model: vehicle.model,
        registrationNumber:
          vehicle.registrationNumber,
        fuelType: vehicle.fuelType,

        serviceCount: vehicleServices.length,
        fuelCount: vehicleFuel.length,

        serviceCost,
        fuelCost,

        totalExpense:
          serviceCost + fuelCost,
      };
    });

    console.log("DASHBOARD VEHICLES:", vehicles.length);
    console.log("VEHICLE EXPENSES:", vehicleExpenses);

    res.status(200).json({
      success: true,

      stats: {
        totalVehicles: vehicles.length,
        totalServices: services.length,
        totalFuelEntries: fuelHistory.length,

        totalFuelCost,
        totalServiceCost,

        totalExpense:
          totalFuelCost + totalServiceCost,

        vehicleExpenses,
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
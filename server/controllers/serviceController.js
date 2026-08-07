const Service = require("../models/Service");

// Add Service
const addService = async (req, res) => {
  try {
    const {
      vehicle,
      serviceName,
      serviceDate,
      garageName,
      cost,
      odometer,
      notes,
    } = req.body;

    const service = await Service.create({
      vehicle,
      owner: req.user.id,
      serviceName,
      serviceDate,
      garageName,
      cost,
      odometer,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Service Added Successfully",
      service,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get My Services
const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({
      owner: req.user.id,
    }).populate("vehicle", "brand model registrationNumber");

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Service
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service Not Found",
      });
    }

    if (service.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Service Updated Successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service Not Found",
      });
    }

    if (service.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Service Deleted Successfully",
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
  addService,
  getMyServices,
  updateService,
  deleteService,
};
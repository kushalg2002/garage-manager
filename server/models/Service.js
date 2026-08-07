const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceName: {
      type: String,
      required: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    garageName: {
      type: String,
      required: true,
    },

    cost: {
      type: Number,
      required: true,
    },

    odometer: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
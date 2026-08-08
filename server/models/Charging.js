const mongoose = require("mongoose");

const chargingSchema = new mongoose.Schema(
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

    units: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    odometer: {
      type: Number,
      required: true,
    },

    chargingDate: {
      type: Date,
      required: true,
    },

    station: {
      type: String,
      default: "",
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

module.exports = mongoose.model(
  "Charging",
  chargingSchema
);
const mongoose = require("mongoose");

const fuelSchema = new mongoose.Schema(
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

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
      required: true,
    },

    litres: {
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

    fuelDate: {
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

module.exports = mongoose.model("Fuel", fuelSchema);
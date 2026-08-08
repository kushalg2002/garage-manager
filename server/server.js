const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Database
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const fuelRoutes = require("./routes/fuelRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chargingRoutes = require("./routes/chargingRoutes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/vehicles", vehicleRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/fuel", fuelRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/charging", chargingRoutes);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "🚗 Garage Manager API Running Successfully",
  });
});

// ==========================================
// HANDLE UNKNOWN ROUTES
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});
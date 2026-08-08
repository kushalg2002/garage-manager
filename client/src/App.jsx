import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import EditVehicle from "./pages/EditVehicle";
import Services from "./pages/Services";
import Fuel from "./pages/Fuel";
import VehicleDetails from "./pages/VehicleDetails";
import AddService from "./pages/AddService";
import AddFuel from "./pages/AddFuel";
import Charging from "./pages/Charging";
import AddCharging from "./pages/AddCharging";

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* VEHICLES */}
      <Route
        path="/vehicles"
        element={<Vehicles />}
      />

      {/* ADD VEHICLE */}
      <Route
        path="/add-vehicle"
        element={<AddVehicle />}
      />

      {/* EDIT VEHICLE */}
      <Route
        path="/edit-vehicle/:id"
        element={<EditVehicle />}
      />

      {/* VEHICLE DETAILS */}
      <Route
        path="/vehicle/:id"
        element={<VehicleDetails />}
      />

      {/* SERVICES */}
      <Route
        path="/services"
        element={<Services />}
      />

      {/* FUEL */}
      <Route
        path="/fuel"
        element={<Fuel />}
      />

      {/* ADD SERVICE */}
      <Route
        path="/add-service/:vehicleId"
        element={<AddService />}
      />

      {/* ADD FUEL */}
      <Route
        path="/add-fuel/:vehicleId"
        element={<AddFuel />}
      />

      {/* CHARGING HISTORY */}
      <Route
        path="/charging"
        element={<Charging />}
      />

      {/* ADD CHARGING - FROM GENERAL CHARGING PAGE */}
      <Route
        path="/add-charging"
        element={<AddCharging />}
      />

      {/* ADD CHARGING - FROM SPECIFIC VEHICLE */}
      <Route
        path="/add-charging/:vehicleId"
        element={<AddCharging />}
      />
    </Routes>
  );
}

export default App;
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/add-vehicle" element={<AddVehicle />} />
      <Route path="/edit-vehicle/:id" element={<EditVehicle />} />
      <Route path="/services" element={<Services />} />
      <Route path="/fuel" element={<Fuel />} />
      <Route path="/vehicle/:id" element={<VehicleDetails />} />
    </Routes>
  );
}

export default App;
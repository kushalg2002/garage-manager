import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/add-vehicle" element={<AddVehicle />} />
    </Routes>
  );
}

export default App;
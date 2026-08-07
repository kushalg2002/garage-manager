import { useState } from "react";
import api from "../services/api";

function AddVehicle() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [fuelType, setFuelType] = useState("Petrol");
  const [odometer, setOdometer] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      "/vehicles",
      {
        brand,
        model,
        year,
        registrationNumber,
        fuelType,
        odometer,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(response.data.message);

    // Clear form
    setBrand("");
    setModel("");
    setYear("");
    setRegistrationNumber("");
    setFuelType("Petrol");
    setOdometer("");

  } catch (error) {
    alert(error.response?.data?.message || "Failed to add vehicle");
  }
};

  return (
    <div style={{ padding: "30px" }}>
      <h1>Add Vehicle</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Registration Number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="number"
            placeholder="Odometer"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
          />
        </div>

        <button type="submit">Save Vehicle</button>
      </form>
    </div>
  );
}

export default AddVehicle;
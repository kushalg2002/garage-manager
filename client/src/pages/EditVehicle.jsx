import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [odometer, setOdometer] = useState("");

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const vehicle = response.data.vehicles.find(
        (v) => v._id === id
      );

      if (vehicle) {
        setBrand(vehicle.brand);
        setModel(vehicle.model);
        setYear(vehicle.year);
        setRegistrationNumber(vehicle.registrationNumber);
        setFuelType(vehicle.fuelType);
        setOdometer(vehicle.odometer);
      }
    } catch (error) {
      alert("Failed to load vehicle");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/vehicles/${id}`,
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

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Edit Vehicle</h1>

      <input
        type="text"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        value={registrationNumber}
        onChange={(e) => setRegistrationNumber(e.target.value)}
      />

      <br /><br />

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

      <br /><br />

      <input
        type="number"
        value={odometer}
        onChange={(e) => setOdometer(e.target.value)}
      />

      <br /><br />

      <button onClick={handleUpdate}>
        Update Vehicle
      </button>
    </div>
  );
}

export default EditVehicle;
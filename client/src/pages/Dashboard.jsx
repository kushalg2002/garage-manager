import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";
import DashboardStats from "../components/mui/DashboardStats";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState("All");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(response.data.vehicles);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert(error.message);
      }
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      vehicle.brand.toLowerCase().includes(keyword) ||
      vehicle.model.toLowerCase().includes(keyword) ||
      vehicle.registrationNumber.toLowerCase().includes(keyword);

    const matchesFuel =
      fuelFilter === "All" || vehicle.fuelType === fuelFilter;

    return matchesSearch && matchesFuel;
  });

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>🚗 Garage Manager</h1>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <DashboardStats
  title="Total Vehicles"
  value={vehicles.length}
/>

<DashboardStats
  title="Petrol Vehicles"
  value={vehicles.filter((v) => v.fuelType === "Petrol").length}
/>

<DashboardStats
  title="Diesel Vehicles"
  value={vehicles.filter((v) => v.fuelType === "Diesel").length}
/>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="🔍 Search by Brand, Model or Registration"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "350px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          {[
            "All",
            "Petrol",
            "Diesel",
            "CNG",
            "Electric",
            "Hybrid",
          ].map((fuel) => (
            <button
              key={fuel}
              onClick={() => setFuelFilter(fuel)}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background:
                  fuelFilter === fuel ? "#1976d2" : "#e0e0e0",
                color:
                  fuelFilter === fuel ? "white" : "black",
              }}
            >
              {fuel}
            </button>
          ))}
        </div>

        <h2>My Vehicles</h2>

        {loading ? (
          <h3>Loading vehicles...</h3>
        ) : filteredVehicles.length === 0 ? (
          <p>No vehicles found.</p>
        ) : (
          filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
            />
          ))
        )}
      </div>
    </>
  );
}

export default Dashboard;
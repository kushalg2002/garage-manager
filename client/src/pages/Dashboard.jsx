import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.log(response.data);
      setVehicles(response.data.vehicles);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);

  if (error.response) {
    alert(error.response.data.message);
  } else {
    alert(error.message);
  }
  }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>🚗 Garage Manager</h1>

      <h2>My Vehicles</h2>

      {loading ? (
  <h3>Loading vehicles...</h3>
) : vehicles.length === 0 ? (
  <p>No vehicles found.</p>
) : (
        vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>
              {vehicle.brand} {vehicle.model}
            </h3>

            <p>
              <strong>Registration:</strong>{" "}
              {vehicle.registrationNumber}
            </p>

            <p>
              <strong>Fuel:</strong> {vehicle.fuelType}
            </p>

            <p>
              <strong>Odometer:</strong> {vehicle.odometer} km
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
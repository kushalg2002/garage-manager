import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function VehicleDetails() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [fuelHistory, setFuelHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem("token");

      const vehicleResponse = await api.get(`/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const serviceResponse = await api.get(
        `/services/vehicle/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fuelResponse = await api.get(
        `/fuel/vehicle/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicle(vehicleResponse.data.vehicle);
      setServices(serviceResponse.data.services);
      setFuelHistory(fuelResponse.data.fuelHistory);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Failed to load data");
    }
  };

  const totalServiceCost = services.reduce(
    (sum, service) => sum + service.cost,
    0
  );

  const totalFuelCost = fuelHistory.reduce(
    (sum, fuel) => sum + fuel.amount,
    0
  );

  const totalExpense = totalServiceCost + totalFuelCost;

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "30px" }}>
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>🚗 Vehicle Details</h1>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h2>
            {vehicle.brand} {vehicle.model}
          </h2>

          <p>
            <strong>Registration:</strong> {vehicle.registrationNumber}
          </p>

          <p>
            <strong>Year:</strong> {vehicle.year}
          </p>

          <p>
            <strong>Fuel Type:</strong> {vehicle.fuelType}
          </p>

          <p>
            <strong>Odometer:</strong> {vehicle.odometer} km
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h2>📊 Statistics</h2>

          <p><strong>Total Services:</strong> {services.length}</p>

          <p><strong>Total Fuel Entries:</strong> {fuelHistory.length}</p>

          <p><strong>Total Service Cost:</strong> ₹{totalServiceCost}</p>

          <p><strong>Total Fuel Cost:</strong> ₹{totalFuelCost}</p>

          <p><strong>Total Expense:</strong> ₹{totalExpense}</p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h2>🔧 Services</h2>

          {services.length === 0 ? (
            <p>No services found.</p>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "10px 0",
                }}
              >
                <h3>{service.serviceName}</h3>

                <p>Garage: {service.garageName}</p>

                <p>Cost: ₹{service.cost}</p>

                <p>Odometer: {service.odometer} km</p>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h2>⛽ Fuel History</h2>

          {fuelHistory.length === 0 ? (
            <p>No fuel entries found.</p>
          ) : (
            fuelHistory.map((fuel) => (
              <div
                key={fuel._id}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "10px 0",
                }}
              >
                <p>Fuel Type: {fuel.fuelType}</p>

                <p>Litres: {fuel.litres} L</p>

                <p>Amount: ₹{fuel.amount}</p>

                <p>Station: {fuel.station}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default VehicleDetails;
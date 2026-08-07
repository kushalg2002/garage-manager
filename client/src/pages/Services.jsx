import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/services", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

console.log("Services API:", response.data);

setServices(response.data.services);

      setServices(response.data.services);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Failed to load services");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>🔧 Service History</h1>

        {loading ? (
          <h3>Loading...</h3>
        ) : services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          services.map((service) => (
            <div
              key={service._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>{service.serviceName}</h2>

              <p>
                <strong>Vehicle:</strong>{" "}
                {service.vehicle.brand} {service.vehicle.model}
              </p>

              <p>
                <strong>Registration:</strong>{" "}
                {service.vehicle.registrationNumber}
              </p>

              <p>
                <strong>Garage:</strong> {service.garageName}
              </p>

              <p>
                <strong>Cost:</strong> ₹{service.cost}
              </p>

              <p>
                <strong>Odometer:</strong> {service.odometer} km
              </p>

              <p>
                <strong>Notes:</strong> {service.notes}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Services;
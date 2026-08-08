import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

function Fuel() {
  const [fuelHistory, setFuelHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle");

  useEffect(() => {
    fetchFuel();
  }, [vehicleId]);

  const fetchFuel = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const url = vehicleId
        ? `/fuel?vehicle=${vehicleId}`
        : "/fuel";

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFuelHistory(response.data.fuelHistory);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load fuel history"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ padding: "30px" }}>
        <h1>⛽ Fuel History</h1>

        {loading ? (
          <h3>Loading...</h3>
        ) : fuelHistory.length === 0 ? (
          <p>No fuel entries found.</p>
        ) : (
          fuelHistory.map((fuel) => (
            <div
              key={fuel._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>
                {fuel.vehicle?.brand}{" "}
                {fuel.vehicle?.model}
              </h2>

              <p>
                <strong>Registration:</strong>{" "}
                {fuel.vehicle?.registrationNumber}
              </p>

              <p>
                <strong>Fuel Type:</strong>{" "}
                {fuel.fuelType}
              </p>

              <p>
                <strong>Litres:</strong>{" "}
                {fuel.litres} L
              </p>

              <p>
                <strong>Amount:</strong> ₹
                {fuel.amount}
              </p>

              <p>
                <strong>Odometer:</strong>{" "}
                {fuel.odometer} km
              </p>

              <p>
                <strong>Fuel Date:</strong>{" "}
                {fuel.fuelDate
                  ? new Date(
                      fuel.fuelDate
                    ).toLocaleDateString("en-IN")
                  : "-"}
              </p>

              <p>
                <strong>Station:</strong>{" "}
                {fuel.station}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {fuel.notes || "-"}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Fuel;
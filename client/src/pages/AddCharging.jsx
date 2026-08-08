import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import api from "../services/api";

function AddCharging() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState(vehicleId || "");

  const [loadingVehicles, setLoadingVehicles] =
    useState(true);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    units: "",
    amount: "",
    odometer: "",
    chargingDate: "",
    station: "",
    notes: "",
  });

  // ==========================================
  // FETCH VEHICLES
  // ==========================================

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "Vehicles API Response:",
        response.data
      );

      // Handle different possible API response formats
      const allVehicles =
        response.data?.vehicles ||
        response.data?.data ||
        response.data?.vehicle ||
        [];

      console.log(
        "All Vehicles:",
        allVehicles
      );

      // ========================================
      // ONLY EV VEHICLES
      // ========================================

      const evVehicles = allVehicles.filter(
        (vehicle) => {
          const fuelType = String(
            vehicle.fuelType ||
              vehicle.fuel ||
              vehicle.vehicleType ||
              ""
          )
            .trim()
            .toLowerCase();

          console.log(
            "Vehicle:",
            vehicle.brand,
            vehicle.model,
            "Fuel Type:",
            fuelType
          );

          return (
            fuelType === "ev" ||
            fuelType === "electric" ||
            fuelType ===
              "electric vehicle"
          );
        }
      );

      console.log(
        "EV Vehicles:",
        evVehicles
      );

      setVehicles(evVehicles);

      // If opened with a vehicle ID
      if (vehicleId) {
        const selected = evVehicles.find(
          (vehicle) =>
            String(vehicle._id) ===
            String(vehicleId)
        );

        if (selected) {
          setSelectedVehicle(
            selected._id
          );
        } else {
          alert(
            "This vehicle is not an EV."
          );

          navigate("/charging");
        }
      }
    } catch (error) {
      console.error(
        "Fetch EV Vehicles Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load vehicles"
      );
    } finally {
      setLoadingVehicles(false);
    }
  };

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // VEHICLE CHANGE
  // ==========================================

  const handleVehicleChange = (e) => {
    setSelectedVehicle(e.target.value);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVehicle) {
      alert("Please select an EV vehicle.");
      return;
    }

    if (
      !formData.units ||
      Number(formData.units) <= 0
    ) {
      alert(
        "Please enter a valid energy amount."
      );
      return;
    }

    if (
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      alert(
        "Please enter a valid charging amount."
      );
      return;
    }

    if (
      !formData.odometer ||
      Number(formData.odometer) < 0
    ) {
      alert(
        "Please enter a valid odometer."
      );
      return;
    }

    if (!formData.chargingDate) {
      alert(
        "Please select the charging date."
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      await api.post(
        "/charging",
        {
          vehicle: selectedVehicle,
          units: Number(formData.units),
          amount: Number(formData.amount),
          odometer: Number(
            formData.odometer
          ),
          chargingDate:
            formData.chargingDate,
          station: formData.station,
          notes: formData.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Charging Entry Added Successfully"
      );

      navigate(
        `/vehicle/${selectedVehicle}`
      );
    } catch (error) {
      console.error(
        "Add Charging Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add charging entry"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 650,
          mx: "auto",
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{
              color: "#7b1fa2",
              mb: 1,
            }}
          >
            ⚡ Add Charging
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{
              mb: 4,
            }}
          >
            Add a new charging entry for
            your EV.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* EV VEHICLE */}

            <TextField
              fullWidth
              required
              select
              label="Select EV Vehicle"
              value={selectedVehicle}
              onChange={
                handleVehicleChange
              }
              disabled={loadingVehicles}
              helperText={
                loadingVehicles
                  ? "Loading EV vehicles..."
                  : vehicles.length === 0
                  ? "No EV vehicles found. Make sure the vehicle fuel type is EV."
                  : "Only EV vehicles are shown."
              }
            >
              {vehicles.map((vehicle) => (
                <MenuItem
                  key={vehicle._id}
                  value={vehicle._id}
                >
                  {vehicle.brand}{" "}
                  {vehicle.model}
                  {vehicle.registrationNumber
                    ? ` - ${vehicle.registrationNumber}`
                    : ""}
                </MenuItem>
              ))}
            </TextField>

            {/* ENERGY */}

            <TextField
              fullWidth
              required
              label="Energy Charged"
              name="units"
              type="number"
              value={formData.units}
              onChange={handleChange}
              inputProps={{
                step: "0.01",
                min: "0",
              }}
              placeholder="Enter energy in kWh"
              helperText="Example: 18.50 kWh"
            />

            {/* AMOUNT */}

            <TextField
              fullWidth
              required
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              inputProps={{
                step: "0.01",
                min: "0",
              }}
              placeholder="Enter charging amount"
            />

            {/* ODOMETER */}

            <TextField
              fullWidth
              required
              label="Odometer"
              name="odometer"
              type="number"
              value={formData.odometer}
              onChange={handleChange}
              inputProps={{
                min: "0",
              }}
              placeholder="Enter current odometer"
            />

            {/* DATE */}

            <TextField
              fullWidth
              required
              label="Charging Date"
              name="chargingDate"
              type="date"
              value={
                formData.chargingDate
              }
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* STATION */}

            <TextField
              fullWidth
              label="Charging Station"
              name="station"
              value={formData.station}
              onChange={handleChange}
              placeholder="Example: Tata Power"
            />

            {/* NOTES */}

            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Example: Fast charging"
              multiline
              rows={4}
            />

            {/* BUTTONS */}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={
                  loading ||
                  loadingVehicles ||
                  !selectedVehicle
                }
                fullWidth
                sx={{
                  backgroundColor:
                    "#7b1fa2",
                  fontWeight: 700,
                  textTransform:
                    "none",
                  borderRadius: 2,

                  "&:hover": {
                    backgroundColor:
                      "#6a1b9a",
                  },
                }}
              >
                {loading
                  ? "Saving..."
                  : "Add Charging"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => {
                  if (selectedVehicle) {
                    navigate(
                      `/vehicle/${selectedVehicle}`
                    );
                  } else {
                    navigate(
                      "/charging"
                    );
                  }
                }}
                sx={{
                  fontWeight: 700,
                  textTransform:
                    "none",
                  borderRadius: 2,
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddCharging;
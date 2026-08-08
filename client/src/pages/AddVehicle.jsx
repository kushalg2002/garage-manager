import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  TwoWheeler,
  DirectionsCar,
  ElectricCar,
  LocalGasStation,
} from "@mui/icons-material";

import api from "../services/api";

function AddVehicle() {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [vehicleType, setVehicleType] =
    useState("2 Wheeler");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [registrationNumber, setRegistrationNumber] =
    useState("");

  const [fuelType, setFuelType] =
    useState("Petrol");

  const [odometer, setOdometer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // VEHICLE TYPE CHANGE
  // ==========================================

  const handleVehicleTypeChange = (type) => {
    setVehicleType(type);

    // 2 Wheeler → Petrol / EV only
    if (type === "2 Wheeler") {
      if (
        !["Petrol", "Electric"].includes(
          fuelType
        )
      ) {
        setFuelType("Petrol");
      }
    }

    // 4 Wheeler → Petrol / Diesel / CNG / EV
    if (type === "4 Wheeler") {
      if (
        ![
          "Petrol",
          "Diesel",
          "CNG",
          "Electric",
        ].includes(fuelType)
      ) {
        setFuelType("Petrol");
      }
    }
  };

  // ==========================================
  // FUEL OPTIONS
  // ==========================================

  const fuelOptions =
    vehicleType === "2 Wheeler"
      ? [
          {
            value: "Petrol",
            label: "Petrol",
          },
          {
            value: "Electric",
            label: "EV",
          },
        ]
      : [
          {
            value: "Petrol",
            label: "Petrol",
          },
          {
            value: "Diesel",
            label: "Diesel",
          },
          {
            value: "CNG",
            label: "CNG",
          },
          {
            value: "Electric",
            label: "EV",
          },
        ];

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brand.trim()) {
      alert("Please enter vehicle brand");
      return;
    }

    if (!model.trim()) {
      alert("Please enter vehicle model");
      return;
    }

    if (!year) {
      alert("Please enter vehicle year");
      return;
    }

    if (!registrationNumber.trim()) {
      alert(
        "Please enter registration number"
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      // IMPORTANT:
      // vehicleType is now sent to backend
      console.log("Vehicle Type Being Sent:", vehicleType);
      console.log("Fuel Type Being Sent:", fuelType);
      const response = await api.post(
        "/vehicles",
        {
          vehicleType: vehicleType,
          brand: brand.trim(),
          model: model.trim(),
          year: Number(year),
          registrationNumber:
            registrationNumber
              .trim()
              .toUpperCase(),
          fuelType: fuelType,
          odometer: Number(
            odometer || 0
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data.message ||
          "Vehicle Added Successfully"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Add Vehicle Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add vehicle"
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
        background:
          "linear-gradient(135deg, #f5f9ff 0%, #eef4fb 100%)",
        p: {
          xs: 2,
          sm: 3,
          md: 5,
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 720,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow:
            "0 10px 35px rgba(15,23,42,0.12)",
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            background:
              "linear-gradient(135deg, #1565c0, #1976d2)",
            color: "white",
            px: {
              xs: 3,
              sm: 4,
            },
            py: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "25px",
                sm: "30px",
              },
              fontWeight: 800,
            }}
          >
            Add Vehicle
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 14,
              opacity: 0.9,
            }}
          >
            Add your car or two-wheeler
            to AutoCare Hub
          </Typography>
        </Box>

        <CardContent
          sx={{
            p: {
              xs: 2.5,
              sm: 4,
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* ==================================
                VEHICLE TYPE
            ================================== */}

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#334155",
                  fontSize: 14,
                  mb: 1,
                }}
              >
                Vehicle Type
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 1.5,
                }}
              >
                {/* 2 WHEELER */}

                <Button
                  type="button"
                  onClick={() =>
                    handleVehicleTypeChange(
                      "2 Wheeler"
                    )
                  }
                  startIcon={
                    <TwoWheeler />
                  }
                  sx={{
                    minHeight: 60,
                    borderRadius: 2.5,
                    border: "2px solid",
                    borderColor:
                      vehicleType ===
                      "2 Wheeler"
                        ? "#1565c0"
                        : "#dbe3ec",
                    backgroundColor:
                      vehicleType ===
                      "2 Wheeler"
                        ? "#e8f1ff"
                        : "#fff",
                    color:
                      vehicleType ===
                      "2 Wheeler"
                        ? "#1565c0"
                        : "#64748b",
                    fontWeight: 700,
                    textTransform: "none",

                    "&:hover": {
                      backgroundColor:
                        "#e8f1ff",
                    },
                  }}
                >
                  2 Wheeler
                </Button>

                {/* 4 WHEELER */}

                <Button
                  type="button"
                  onClick={() =>
                    handleVehicleTypeChange(
                      "4 Wheeler"
                    )
                  }
                  startIcon={
                    <DirectionsCar />
                  }
                  sx={{
                    minHeight: 60,
                    borderRadius: 2.5,
                    border: "2px solid",
                    borderColor:
                      vehicleType ===
                      "4 Wheeler"
                        ? "#1565c0"
                        : "#dbe3ec",
                    backgroundColor:
                      vehicleType ===
                      "4 Wheeler"
                        ? "#e8f1ff"
                        : "#fff",
                    color:
                      vehicleType ===
                      "4 Wheeler"
                        ? "#1565c0"
                        : "#64748b",
                    fontWeight: 700,
                    textTransform: "none",

                    "&:hover": {
                      backgroundColor:
                        "#e8f1ff",
                    },
                  }}
                >
                  4 Wheeler
                </Button>
              </Box>
            </Box>

            {/* BRAND */}

            <TextField
              fullWidth
              required
              label="Brand"
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              placeholder="Example: Honda"
            />

            {/* MODEL */}

            <TextField
              fullWidth
              required
              label="Model"
              value={model}
              onChange={(e) =>
                setModel(e.target.value)
              }
              placeholder="Example: Activa 6G"
            />

            {/* YEAR */}

            <TextField
              fullWidth
              required
              label="Year"
              type="number"
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
              placeholder="Example: 2025"
              inputProps={{
                min: 1900,
                max: new Date().getFullYear(),
              }}
            />

            {/* REGISTRATION */}

            <TextField
              fullWidth
              required
              label="Registration Number"
              value={registrationNumber}
              onChange={(e) =>
                setRegistrationNumber(
                  e.target.value
                )
              }
              placeholder="Example: KA01AB1234"
            />

            {/* FUEL TYPE */}

            <TextField
              fullWidth
              required
              select
              label="Fuel Type"
              value={fuelType}
              onChange={(e) =>
                setFuelType(
                  e.target.value
                )
              }
            >
              {fuelOptions.map(
                (option) => (
                  <MenuItem
                    key={option.value}
                    value={
                      option.value
                    }
                  >
                    {option.value ===
                    "Electric" ? (
                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 1,
                        }}
                      >
                        <ElectricCar
                          fontSize="small"
                        />
                        EV
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 1,
                        }}
                      >
                        <LocalGasStation
                          fontSize="small"
                        />
                        {
                          option.label
                        }
                      </Box>
                    )}
                  </MenuItem>
                )
              )}
            </TextField>

            {/* ODOMETER */}

            <TextField
              fullWidth
              required
              label="Current Odometer"
              type="number"
              value={odometer}
              onChange={(e) =>
                setOdometer(
                  e.target.value
                )
              }
              placeholder="Example: 25000"
              inputProps={{
                min: 0,
              }}
            />

            {/* BUTTONS */}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 1,
                flexDirection: {
                  xs: "column-reverse",
                  sm: "row",
                },
              }}
            >
              <Button
                type="button"
                variant="outlined"
                fullWidth
                size="large"
                onClick={() =>
                  navigate(
                    "/dashboard"
                  )
                }
                sx={{
                  height: 50,
                  borderRadius: 2.5,
                  textTransform:
                    "none",
                  fontWeight: 700,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  height: 50,
                  borderRadius: 2.5,
                  textTransform:
                    "none",
                  fontWeight: 700,
                  backgroundColor:
                    "#1565c0",

                  "&:hover": {
                    backgroundColor:
                      "#0d47a1",
                  },
                }}
              >
                {loading
                  ? "Saving..."
                  : "Save Vehicle"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddVehicle;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
  LocalGasStation,
  ElectricCar,
  Speed,
  CalendarMonth,
  ConfirmationNumber,
} from "@mui/icons-material";

import api from "../services/api";

function EditVehicle() {
  const { id } = useParams();
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

  const [loadingVehicle, setLoadingVehicle] =
    useState(true);

  // ==========================================
  // FETCH VEHICLE
  // ==========================================

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoadingVehicle(true);

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        `/vehicles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const vehicle =
        response.data.vehicle;

      if (!vehicle) {
        alert("Vehicle not found");
        navigate("/dashboard");
        return;
      }

      setVehicleType(
        vehicle.vehicleType ||
          "4 Wheeler"
      );

      setBrand(vehicle.brand || "");
      setModel(vehicle.model || "");
      setYear(vehicle.year || "");

      setRegistrationNumber(
        vehicle.registrationNumber ||
          ""
      );

      setFuelType(
        vehicle.fuelType || "Petrol"
      );

      setOdometer(
        vehicle.odometer ?? ""
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load vehicle"
      );

      navigate("/dashboard");
    } finally {
      setLoadingVehicle(false);
    }
  };

  // ==========================================
  // VEHICLE TYPE CHANGE
  // ==========================================

  const handleVehicleTypeChange = (
    type
  ) => {
    setVehicleType(type);

    // Keep current fuel if valid
    // Otherwise reset to Petrol

    if (type === "2 Wheeler") {
      if (
        !["Petrol", "Electric"].includes(
          fuelType
        )
      ) {
        setFuelType("Petrol");
      }
    }

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
            icon: (
              <LocalGasStation />
            ),
          },
          {
            value: "Electric",
            label: "EV",
            icon: (
              <ElectricCar />
            ),
          },
        ]
      : [
          {
            value: "Petrol",
            label: "Petrol",
            icon: (
              <LocalGasStation />
            ),
          },
          {
            value: "Diesel",
            label: "Diesel",
            icon: (
              <LocalGasStation />
            ),
          },
          {
            value: "CNG",
            label: "CNG",
            icon: (
              <LocalGasStation />
            ),
          },
          {
            value: "Electric",
            label: "EV",
            icon: (
              <ElectricCar />
            ),
          },
        ];

  // ==========================================
  // UPDATE
  // ==========================================

  const handleUpdate = async (e) => {
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

    if (!odometer && odometer !== 0) {
      alert("Please enter odometer");
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await api.put(
        `/vehicles/${id}`,
        {
          vehicleType,
          brand: brand.trim(),
          model: model.trim(),
          year: Number(year),
          registrationNumber:
            registrationNumber
              .trim()
              .toUpperCase(),
          fuelType,
          odometer: Number(odometer),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data.message ||
          "Vehicle Updated Successfully"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Update Vehicle Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loadingVehicle) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f5f9ff, #eef4fb)",
        }}
      >
        <Typography
          sx={{
            color: "#64748b",
            fontWeight: 600,
          }}
        >
          Loading vehicle...
        </Typography>
      </Box>
    );
  }

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
          border:
            "1px solid rgba(148,163,184,0.18)",
        }}
      >
        {/* ======================================
            HEADER
        ====================================== */}

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
            Edit Vehicle
          </Typography>

          <Typography
            sx={{
              mt: 0.6,
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            Update your vehicle details
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
            onSubmit={handleUpdate}
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
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#334155",
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
                    minHeight: 58,
                    borderRadius: 2.5,
                    textTransform:
                      "none",
                    fontWeight: 700,
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
                        : "white",
                    color:
                      vehicleType ===
                      "2 Wheeler"
                        ? "#1565c0"
                        : "#64748b",

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
                    minHeight: 58,
                    borderRadius: 2.5,
                    textTransform:
                      "none",
                    fontWeight: 700,
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
                        : "white",
                    color:
                      vehicleType ===
                      "4 Wheeler"
                        ? "#1565c0"
                        : "#64748b",

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

            {/* ==================================
                BRAND
            ================================== */}

            <TextField
              fullWidth
              required
              label="Brand"
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              placeholder="Example: Tata"
            />

            {/* ==================================
                MODEL
            ================================== */}

            <TextField
              fullWidth
              required
              label="Model"
              value={model}
              onChange={(e) =>
                setModel(e.target.value)
              }
              placeholder="Example: Nexon EV"
            />

            {/* ==================================
                YEAR
            ================================== */}

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
              InputProps={{
                startAdornment: (
                  <CalendarMonth
                    sx={{
                      mr: 1,
                      color:
                        "#64748b",
                    }}
                  />
                ),
              }}
              inputProps={{
                min: 1900,
                max: new Date().getFullYear(),
              }}
            />

            {/* ==================================
                REGISTRATION
            ================================== */}

            <TextField
              fullWidth
              required
              label="Registration Number"
              value={
                registrationNumber
              }
              onChange={(e) =>
                setRegistrationNumber(
                  e.target.value
                )
              }
              placeholder="Example: KA01AB1234"
              InputProps={{
                startAdornment: (
                  <ConfirmationNumber
                    sx={{
                      mr: 1,
                      color:
                        "#64748b",
                    }}
                  />
                ),
              }}
            />

            {/* ==================================
                FUEL TYPE
            ================================== */}

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
                    <Box
                      sx={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: 1,
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </Box>
                  </MenuItem>
                )
              )}
            </TextField>

            {/* ==================================
                ODOMETER
            ================================== */}

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
              InputProps={{
                startAdornment: (
                  <Speed
                    sx={{
                      mr: 1,
                      color:
                        "#64748b",
                    }}
                  />
                ),
              }}
              inputProps={{
                min: 0,
              }}
            />

            {/* ==================================
                BUTTONS
            ================================== */}

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
                size="large"
                fullWidth
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
                  borderColor:
                    "#cbd5e1",
                  color: "#475569",
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  height: 50,
                  borderRadius: 2.5,
                  textTransform:
                    "none",
                  fontWeight: 700,
                  backgroundColor:
                    "#1565c0",
                  boxShadow:
                    "0 5px 15px rgba(21,101,192,0.22)",

                  "&:hover": {
                    backgroundColor:
                      "#0d47a1",
                  },
                }}
              >
                {loading
                  ? "Updating..."
                  : "Update Vehicle"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EditVehicle;
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  DirectionsCar,
  LocalGasStation,
  Build,
  Search,
  CurrencyRupee,
  Add,
} from "@mui/icons-material";

import api from "../services/api";
import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";
import DashboardStats from "../components/mui/DashboardStats";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState("All");

  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalServices: 0,
    totalFuelEntries: 0,
    totalExpense: 0,
  });

  useEffect(() => {
    fetchVehicles();
    fetchDashboardStats();
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
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      vehicle.brand?.toLowerCase().includes(keyword) ||
      vehicle.model?.toLowerCase().includes(keyword) ||
      vehicle.registrationNumber
        ?.toLowerCase()
        .includes(keyword);

    const matchesFuel =
      fuelFilter === "All" ||
      vehicle.fuelType === fuelFilter;

    return matchesSearch && matchesFuel;
  });

  const petrolCount = vehicles.filter(
    (vehicle) => vehicle.fuelType === "Petrol"
  ).length;

  const dieselCount = vehicles.filter(
    (vehicle) => vehicle.fuelType === "Diesel"
  ).length;

  const fuelFilters = [
    {
      name: "All",
      icon: <DirectionsCar fontSize="small" />,
    },
    {
      name: "Petrol",
      icon: <LocalGasStation fontSize="small" />,
    },
    {
      name: "Diesel",
      icon: <LocalGasStation fontSize="small" />,
    },
    {
      name: "CNG",
      icon: <LocalGasStation fontSize="small" />,
    },
    {
      name: "Electric",
      icon: <DirectionsCar fontSize="small" />,
    },
    {
      name: "Hybrid",
      icon: <DirectionsCar fontSize="small" />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
      }}
    >
      <Navbar />

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 3,
            sm: 4,
            md: 5,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "15px",
                mb: 0.5,
              }}
            >
              Welcome back 👋
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "30px",
                  sm: "36px",
                },
                fontWeight: 700,
                color: "#14213d",
                lineHeight: 1.2,
              }}
            >
              Garage Manager
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#6b7280",
                fontSize: "16px",
              }}
            >
              Manage your vehicles, services and fuel
              expenses in one place.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            href="/add-vehicle"
            sx={{
              backgroundColor: "#1565c0",
              borderRadius: 2,
              px: 2.5,
              py: 1.3,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 6px 18px rgba(21,101,192,0.25)",

              "&:hover": {
                backgroundColor: "#0d47a1",
              },
            }}
          >
            Add Vehicle
          </Button>
        </Box>

        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(3, 1fr)",
              lg: "repeat(6, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <DashboardStats
            title="Total Vehicles"
            value={stats.totalVehicles}
          />

          <DashboardStats
            title="Petrol Vehicles"
            value={petrolCount}
          />

          <DashboardStats
            title="Diesel Vehicles"
            value={dieselCount}
          />

          <DashboardStats
            title="Services"
            value={stats.totalServices}
          />

          <DashboardStats
            title="Fuel Entries"
            value={stats.totalFuelEntries}
          />

          <DashboardStats
            title="Expenses"
            value={`₹${stats.totalExpense}`}
          />
        </Box>

        {/* Search + Filters */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            mb: 4,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#14213d",
              mb: 2,
            }}
          >
            Find Your Vehicle
          </Typography>

          <TextField
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand, model or registration number"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f8fafc",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#64748b" }} />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {fuelFilters.map((fuel) => (
              <Chip
                key={fuel.name}
                icon={fuel.icon}
                label={fuel.name}
                clickable
                onClick={() =>
                  setFuelFilter(fuel.name)
                }
                sx={{
                  px: 0.5,
                  height: 40,
                  borderRadius: 2,
                  fontWeight: 600,

                  backgroundColor:
                    fuelFilter === fuel.name
                      ? "#1565c0"
                      : "#f1f5f9",

                  color:
                    fuelFilter === fuel.name
                      ? "#ffffff"
                      : "#475569",

                  "& .MuiChip-icon": {
                    color:
                      fuelFilter === fuel.name
                        ? "#ffffff"
                        : "#64748b",
                  },

                  "&:hover": {
                    backgroundColor:
                      fuelFilter === fuel.name
                        ? "#0d47a1"
                        : "#e2e8f0",
                  },
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Vehicle Section */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "24px",
                  sm: "28px",
                },
                fontWeight: 700,
                color: "#14213d",
              }}
            >
              My Vehicles
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                mt: 0.5,
              }}
            >
              {filteredVehicles.length} vehicle
              {filteredVehicles.length !== 1
                ? "s"
                : ""}{" "}
              found
            </Typography>
          </Box>
        </Box>

        {/* Loading */}
        {loading && (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
              }}
            >
              Loading your vehicles...
            </Typography>
          </Paper>
        )}

        {/* Empty */}
        {!loading &&
          filteredVehicles.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 4,
                  sm: 6,
                },
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
              }}
            >
              <DirectionsCar
                sx={{
                  fontSize: 60,
                  color: "#94a3b8",
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#334155",
                  mb: 1,
                }}
              >
                No vehicles found
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  mb: 3,
                }}
              >
                Try changing your search or fuel filter.
              </Typography>

              <Button
                variant="contained"
                startIcon={<Add />}
                href="/add-vehicle"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Add Vehicle
              </Button>
            </Paper>
          )}

        {/* Vehicles */}
        {!loading &&
          filteredVehicles.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                },
                gap: 2.5,
              }}
            >
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                />
              ))}
            </Box>
          )}
      </Container>
    </Box>
  );
}

export default Dashboard;
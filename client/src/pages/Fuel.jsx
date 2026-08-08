import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  ArrowBack,
  CalendarToday,
  DirectionsCar,
  LocalGasStation,
  Search,
  Speed,
} from "@mui/icons-material";

import Navbar from "../components/Navbar";
import api from "../services/api";

function Fuel() {
  const navigate = useNavigate();

  const [fuelHistory, setFuelHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

      setFuelHistory(
        response.data.fuelHistory || []
      );
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

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  const formatNumber = (number) => {
    return Number(number || 0).toLocaleString(
      "en-IN"
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const filteredFuel = fuelHistory.filter(
    (fuel) => {
      const keyword = search.toLowerCase();

      const vehicleName =
        `${fuel.vehicle?.brand || ""} ${
          fuel.vehicle?.model || ""
        }`.toLowerCase();

      const registration =
        fuel.vehicle?.registrationNumber?.toLowerCase() ||
        "";

      const fuelType =
        fuel.fuelType?.toLowerCase() || "";

      const station =
        fuel.station?.toLowerCase() || "";

      return (
        vehicleName.includes(keyword) ||
        registration.includes(keyword) ||
        fuelType.includes(keyword) ||
        station.includes(keyword)
      );
    }
  );

  const totalFuelCost = fuelHistory.reduce(
    (sum, fuel) =>
      sum + Number(fuel.amount || 0),
    0
  );

  const totalLitres = fuelHistory.reduce(
    (sum, fuel) =>
      sum + Number(fuel.litres || 0),
    0
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4f7fb 0%, #eef3f8 100%)",
      }}
    >
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 2.5,
            sm: 4,
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box sx={{ mb: 3 }}>

          {/* TOP ROW */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2.5,
            }}
          >
            {/* BACK ARROW */}

            <IconButton
              onClick={() => navigate(-1)}
              aria-label="Go back"
              sx={{
                width: 44,
                height: 44,
                backgroundColor: "#ffffff",
                color: "#1565c0",
                border:
                  "1px solid #dbe3ec",
                boxShadow:
                  "0 3px 10px rgba(15,23,42,0.08)",

                "&:hover": {
                  backgroundColor: "#eaf2ff",
                },
              }}
            >
              <ArrowBack />
            </IconButton>

            {/* ADD FUEL */}

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() =>
                navigate("/add-fuel")
              }
              sx={{
                backgroundColor: "#ef6c00",
                borderRadius: 2,
                px: {
                  xs: 1.5,
                  sm: 2.5,
                },
                py: 1.2,
                textTransform: "none",
                fontWeight: 700,
                boxShadow:
                  "0 5px 15px rgba(239,108,0,0.25)",

                "&:hover": {
                  backgroundColor: "#e65100",
                },
              }}
            >
              Add Fuel
            </Button>
          </Box>

          {/* TITLE */}

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "27px",
                  sm: "32px",
                },
                fontWeight: 800,
                color: "#14213d",
                lineHeight: 1.2,
              }}
            >
              ⛽ Fuel History
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                mt: 0.7,
                fontSize: {
                  xs: "13px",
                  sm: "15px",
                },
              }}
            >
              Track your vehicle fuel usage
              and expenses.
            </Typography>
          </Box>
        </Box>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <StatCard
            icon={<LocalGasStation />}
            title="Fuel Entries"
            value={fuelHistory.length}
            iconColor="#ef6c00"
            background="#fff3e8"
          />

          <StatCard
            icon={<span>₹</span>}
            title="Total Fuel Expense"
            value={`₹${formatCurrency(
              totalFuelCost
            )}`}
            iconColor="#1565c0"
            background="#eaf2ff"
          />

          <StatCard
            icon={<span>L</span>}
            title="Total Litres"
            value={`${totalLitres.toFixed(2)} L`}
            iconColor="#2e7d32"
            background="#edf7ed"
          />
        </Box>

        {/* =================================================
            SEARCH
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            mb: 3,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            border:
              "1px solid #e2e8f0",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#334155",
              mb: 1.2,
            }}
          >
            Find Fuel Records
          </Typography>

          <TextField
            fullWidth
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by vehicle, registration, fuel type or station..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: "#64748b",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 50,
                borderRadius: 2,
                backgroundColor:
                  "#f8fafc",

                "& fieldset": {
                  borderColor: "#dbe3ec",
                },

                "&:hover fieldset": {
                  borderColor: "#90caf9",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />
        </Paper>

        {/* =================================================
            VEHICLE FILTER
        ================================================= */}

        {vehicleId && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2.5,
              border:
                "1px solid #bfdbfe",
              backgroundColor: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Chip
                label="Vehicle Filter Active"
                color="primary"
                size="small"
              />

              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#475569",
                }}
              >
                Showing fuel records for
                one vehicle
              </Typography>
            </Box>

            <Button
              size="small"
              onClick={() =>
                navigate("/fuel")
              }
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Show All Vehicles
            </Button>
          </Paper>
        )}

        {/* =================================================
            RECORD COUNT
        ================================================= */}

        {!loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              <strong
                style={{
                  color: "#1e293b",
                }}
              >
                {filteredFuel.length}
              </strong>{" "}
              fuel{" "}
              {filteredFuel.length === 1
                ? "record"
                : "records"}{" "}
              found
            </Typography>
          </Box>
        )}

        {/* =================================================
            FUEL RECORDS
        ================================================= */}

        {loading ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border:
                "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
              }}
            >
              Loading fuel history...
            </Typography>
          </Paper>
        ) : filteredFuel.length === 0 ? (
          <EmptyFuel />
        ) : (
          <Stack spacing={2}>
            {filteredFuel.map((fuel) => (
              <FuelCard
                key={fuel._id}
                fuel={fuel}
                formatCurrency={
                  formatCurrency
                }
                formatNumber={formatNumber}
                formatDate={formatDate}
                navigate={navigate}
              />
            ))}
          </Stack>
        )}

        {/* =================================================
            BOTTOM DASHBOARD BUTTON
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate("/dashboard")
            }
            sx={{
              minWidth: 220,
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              color: "#1565c0",
              borderColor: "#90caf9",

              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "#eaf2ff",
              },
            }}
          >
            Return to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

/* =================================================
   FUEL CARD
================================================= */

function FuelCard({
  fuel,
  formatCurrency,
  formatNumber,
  formatDate,
  navigate,
}) {
  const vehicle = fuel.vehicle;

  const getFuelColor = () => {
    switch (fuel.fuelType) {
      case "Petrol":
        return "#1976d2";

      case "Diesel":
        return "#455a64";

      case "CNG":
        return "#2e7d32";

      case "Electric":
        return "#7b1fa2";

      case "Hybrid":
        return "#ef6c00";

      default:
        return "#616161";
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border:
          "1px solid #dbe3ec",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        transition:
          "all 0.2s ease",

        "&:hover": {
          boxShadow:
            "0 10px 30px rgba(15,23,42,0.09)",
          transform:
            "translateY(-2px)",
        },
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
        }}
      >
        {/* CARD HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2.5,
                backgroundColor:
                  "#fff3e8",
                color: "#ef6c00",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                flexShrink: 0,
              }}
            >
              <LocalGasStation
                sx={{
                  fontSize: 28,
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "19px",
                  },
                  fontWeight: 800,
                  color: "#1e293b",
                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace:
                    "nowrap",
                }}
              >
                {vehicle?.brand}{" "}
                {vehicle?.model}
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: "13px",
                  mt: 0.2,
                }}
              >
                {vehicle?.registrationNumber}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: {
                xs: "17px",
                sm: "20px",
              },
              fontWeight: 800,
              color: "#ea580c",
              whiteSpace: "nowrap",
            }}
          >
            ₹{formatCurrency(fuel.amount)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* FUEL TYPE */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: "#64748b",
              fontWeight: 600,
              textTransform:
                "uppercase",
            }}
          >
            Fuel Type
          </Typography>

          <Chip
            icon={
              <LocalGasStation />
            }
            label={fuel.fuelType}
            size="small"
            sx={{
              color: "#ffffff",
              backgroundColor:
                getFuelColor(),
              fontWeight: 700,

              "& .MuiChip-icon": {
                color: "#ffffff",
              },
            }}
          />
        </Box>

        {/* DETAILS */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(4, 1fr)",
            },
            gap: 1.5,
          }}
        >
          <DetailItem
            icon={<CalendarToday />}
            title="Fuel Date"
            value={formatDate(
              fuel.fuelDate
            )}
          />

          <DetailItem
            icon={
              <LocalGasStation />
            }
            title="Litres"
            value={`${fuel.litres} L`}
          />

          <DetailItem
            icon={<Speed />}
            title="Odometer"
            value={`${formatNumber(
              fuel.odometer
            )} km`}
          />

          <DetailItem
            icon={
              <DirectionsCar />
            }
            title="Station"
            value={
              fuel.station ||
              "Not specified"
            }
          />
        </Box>

        {/* NOTES */}

        {fuel.notes && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              borderRadius: 2,
              backgroundColor:
                "#fffaf5",
              border:
                "1px solid #ffedd5",
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#9a3412",
                mb: 0.5,
                textTransform:
                  "uppercase",
              }}
            >
              Notes
            </Typography>

            <Typography
              sx={{
                fontSize: "14px",
                color: "#475569",
              }}
            >
              {fuel.notes}
            </Typography>
          </Box>
        )}

        {/* VIEW VEHICLE */}

        {vehicle?._id && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <DirectionsCar />
            }
            onClick={() =>
              navigate(
                `/vehicle/${vehicle._id}`
              )
            }
            sx={{
              mt: 2,
              height: 44,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#1565c0",
              color: "#1565c0",

              "&:hover": {
                borderColor: "#0d47a1",
                backgroundColor:
                  "#eaf2ff",
              },
            }}
          >
            View Vehicle
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/* =================================================
   DETAIL ITEM
================================================= */

function DetailItem({
  icon,
  title,
  value,
}) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: "#f8fafc",
        border:
          "1px solid #eef2f7",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.6,
          mb: 0.7,
        }}
      >
        <Box
          sx={{
            color: "#64748b",
            display: "flex",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: 800,
            color: "#64748b",
            textTransform:
              "uppercase",
          }}
        >
          {title}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: {
            xs: "12px",
            sm: "13px",
          },
          fontWeight: 700,
          color: "#1e293b",
          overflow: "hidden",
          textOverflow:
            "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* =================================================
   STAT CARD
================================================= */

function StatCard({
  icon,
  title,
  value,
  iconColor,
  background,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2,
          sm: 2.2,
        },
        borderRadius: 3,
        border:
          "1px solid #dbe3ec",
        backgroundColor: "#ffffff",
        transition:
          "all 0.2s ease",

        "&:hover": {
          boxShadow:
            "0 6px 20px rgba(15,23,42,0.07)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            backgroundColor:
              background,
            color: iconColor,
            fontSize: "22px",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "20px",
                sm: "22px",
              },
              fontWeight: 800,
              color: "#1e293b",
              mt: 0.2,
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

/* =================================================
   EMPTY STATE
================================================= */

function EmptyFuel() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 4,
          sm: 6,
        },
        textAlign: "center",
        borderRadius: 3,
        border:
          "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
      }}
    >
      <LocalGasStation
        sx={{
          fontSize: 50,
          color: "#94a3b8",
          mb: 1,
        }}
      />

      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#334155",
        }}
      >
        No fuel entries found
      </Typography>

      <Typography
        sx={{
          color: "#64748b",
          mt: 0.5,
        }}
      >
        Your fuel records will
        appear here.
      </Typography>
    </Paper>
  );
}

export default Fuel;
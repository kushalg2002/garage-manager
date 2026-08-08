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
  ElectricCar,
  Search,
  Speed,
  Bolt,
} from "@mui/icons-material";

import Navbar from "../components/Navbar";
import api from "../services/api";

function Charging() {
  const navigate = useNavigate();

  const [chargingHistory, setChargingHistory] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [searchParams] = useSearchParams();

  const vehicleId = searchParams.get("vehicle");

  useEffect(() => {
    fetchCharging();
  }, [vehicleId]);

  // ==========================================
  // FETCH CHARGING
  // ==========================================

  const fetchCharging = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const url = vehicleId
        ? `/charging?vehicle=${vehicleId}`
        : "/charging";

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "Charging API Response:",
        response.data
      );

      setChargingHistory(
        response.data.chargingHistory || []
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load charging history"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMATTERS
  // ==========================================

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

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCharging =
    chargingHistory.filter((charging) => {
      const keyword = search.toLowerCase();

      const vehicleName =
        `${charging.vehicle?.brand || ""} ${
          charging.vehicle?.model || ""
        }`.toLowerCase();

      const registration =
        charging.vehicle?.registrationNumber?.toLowerCase() ||
        "";

      const station =
        charging.station?.toLowerCase() || "";

      return (
        vehicleName.includes(keyword) ||
        registration.includes(keyword) ||
        station.includes(keyword)
      );
    });

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalChargingCost =
    chargingHistory.reduce(
      (sum, charging) =>
        sum + Number(charging.amount || 0),
      0
    );

  const totalUnits =
    chargingHistory.reduce(
      (sum, charging) =>
        sum + Number(charging.units || 0),
      0
    );

  // ==========================================
  // RETURN
  // ==========================================

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
        {/* ==========================================
            HEADER
        ========================================== */}

        <Box sx={{ mb: 3 }}>
          {/* TOP ROW */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              mb: 2.5,
            }}
          >
            {/* BACK */}

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

            {/* ADD CHARGING */}

<Button
  variant="contained"
  startIcon={<Add />}
  onClick={() => navigate("/add-charging")}
  sx={{
    backgroundColor: "#7b1fa2",
    borderRadius: 2,
    px: {
      xs: 1.5,
      sm: 2.5,
    },
    py: 1.2,
    textTransform: "none",
    fontWeight: 700,
    boxShadow:
      "0 5px 15px rgba(123,31,162,0.25)",

    "&:hover": {
      backgroundColor: "#6a1b9a",
    },
  }}
>
  Add Charging
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
              ⚡ Charging History
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
              Track your EV charging usage
              and expenses.
            </Typography>
          </Box>
        </Box>

        {/* ==========================================
            STATISTICS
        ========================================== */}

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
            icon={<Bolt />}
            title="Charging Entries"
            value={chargingHistory.length}
            iconColor="#7b1fa2"
            background="#f3e5f5"
          />

          <StatCard
            icon={<span>₹</span>}
            title="Total Charging Expense"
            value={`₹${formatCurrency(
              totalChargingCost
            )}`}
            iconColor="#1565c0"
            background="#eaf2ff"
          />

          <StatCard
            icon={<Bolt />}
            title="Total Energy"
            value={`${totalUnits.toFixed(
              2
            )} kWh`}
            iconColor="#2e7d32"
            background="#edf7ed"
          />
        </Box>

        {/* ==========================================
            SEARCH
        ========================================== */}

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
            Find Charging Records
          </Typography>

          <TextField
            fullWidth
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by vehicle, registration or charging station..."
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
                  borderColor: "#7b1fa2",
                },
              },
            }}
          />
        </Paper>

        {/* ==========================================
            VEHICLE FILTER
        ========================================== */}

        {vehicleId && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2.5,
              border:
                "1px solid #d8b4e2",
              backgroundColor: "#faf5fc",
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
                size="small"
                sx={{
                  backgroundColor:
                    "#7b1fa2",
                  color: "#ffffff",
                  fontWeight: 700,
                }}
              />

              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#475569",
                }}
              >
                Showing charging records
                for one vehicle
              </Typography>
            </Box>

            <Button
              size="small"
              onClick={() =>
                navigate("/charging")
              }
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#7b1fa2",
              }}
            >
              Show All Vehicles
            </Button>
          </Paper>
        )}

        {/* ==========================================
            RECORD COUNT
        ========================================== */}

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
                {filteredCharging.length}
              </strong>{" "}
              charging{" "}
              {filteredCharging.length ===
              1
                ? "record"
                : "records"}{" "}
              found
            </Typography>
          </Box>
        )}

        {/* ==========================================
            CHARGING RECORDS
        ========================================== */}

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
              Loading charging history...
            </Typography>
          </Paper>
        ) : filteredCharging.length ===
          0 ? (
          <EmptyCharging />
        ) : (
          <Stack spacing={2}>
            {filteredCharging.map(
              (charging) => (
                <ChargingCard
                  key={charging._id}
                  charging={charging}
                  formatCurrency={
                    formatCurrency
                  }
                  formatNumber={
                    formatNumber
                  }
                  formatDate={formatDate}
                  navigate={navigate}
                />
              )
            )}
          </Stack>
        )}

        {/* ==========================================
            BOTTOM DASHBOARD BUTTON
        ========================================== */}

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

// ==========================================
// CHARGING CARD
// ==========================================

function ChargingCard({
  charging,
  formatCurrency,
  formatNumber,
  formatDate,
  navigate,
}) {
  const vehicle = charging.vehicle;

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
        {/* HEADER */}

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
                  "#f3e5f5",
                color: "#7b1fa2",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                flexShrink: 0,
              }}
            >
              <Bolt
                sx={{
                  fontSize: 30,
                }}
              />
            </Box>

            <Box
              sx={{
                minWidth: 0,
              }}
            >
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
                {
                  vehicle?.registrationNumber
                }
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
              color: "#7b1fa2",
              whiteSpace: "nowrap",
            }}
          >
            ₹
            {formatCurrency(
              charging.amount
            )}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* TYPE */}

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
            Energy Type
          </Typography>

          <Chip
            icon={<Bolt />}
            label="Electric"
            size="small"
            sx={{
              color: "#ffffff",
              backgroundColor:
                "#7b1fa2",
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
            title="Charging Date"
            value={formatDate(
              charging.chargingDate
            )}
          />

          <DetailItem
            icon={<Bolt />}
            title="Energy"
            value={`${formatNumber(
              charging.units
            )} kWh`}
          />

          <DetailItem
            icon={<Speed />}
            title="Odometer"
            value={`${formatNumber(
              charging.odometer
            )} km`}
          />

          <DetailItem
            icon={<DirectionsCar />}
            title="Station"
            value={
              charging.station ||
              "Not specified"
            }
          />
        </Box>

        {/* NOTES */}

        {charging.notes && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              borderRadius: 2,
              backgroundColor:
                "#faf5fc",
              border:
                "1px solid #f0dff5",
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#7b1fa2",
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
              {charging.notes}
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
              borderColor: "#7b1fa2",
              color: "#7b1fa2",

              "&:hover": {
                borderColor: "#6a1b9a",
                backgroundColor:
                  "#faf5fc",
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

// ==========================================
// DETAIL ITEM
// ==========================================

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
          whiteSpace:
            "nowrap",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// ==========================================
// STAT CARD
// ==========================================

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

// ==========================================
// EMPTY STATE
// ==========================================

function EmptyCharging() {
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
      <Bolt
        sx={{
          fontSize: 55,
          color: "#b0bec5",
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
        No charging entries found
      </Typography>

      <Typography
        sx={{
          color: "#64748b",
          mt: 0.5,
        }}
      >
        Your EV charging records
        will appear here.
      </Typography>
    </Paper>
  );
}

export default Charging;
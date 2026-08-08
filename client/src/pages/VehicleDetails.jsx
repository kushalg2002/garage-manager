import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  DirectionsCar,
  TwoWheeler,
  LocalGasStation,
  ElectricCar,
  Build,
  Speed,
  CalendarToday,
  CurrencyRupee,
  Add,
  Edit,
  Bolt,
} from "@mui/icons-material";

import Navbar from "../components/Navbar";
import api from "../services/api";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [fuelHistory, setFuelHistory] = useState([]);
  const [chargingHistory, setChargingHistory] =
    useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH DATA
  // ==========================================

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Vehicle
      const vehicleResponse =
        await api.get(`/vehicles/${id}`, {
          headers,
        });

      // Services
      const serviceResponse =
        await api.get(
          `/services/vehicle/${id}`,
          { headers }
        );

      // Fuel
      const fuelResponse =
        await api.get(
          `/fuel/vehicle/${id}`,
          { headers }
        );

      setVehicle(
        vehicleResponse.data.vehicle
      );

      setServices(
        serviceResponse.data.services || []
      );

      setFuelHistory(
        fuelResponse.data.fuelHistory || []
      );

      // ========================================
      // CHARGING
      // ========================================

      try {
        const chargingResponse =
          await api.get(
            `/charging/vehicle/${id}`,
            { headers }
          );

        setChargingHistory(
          chargingResponse.data.chargingHistory ||
            chargingResponse.data.charging ||
            chargingResponse.data.data ||
            []
        );
      } catch (chargingError) {
        // Charging route may not exist for
        // non-EV vehicles.
        console.log(
          "Charging history not available:",
          chargingError
        );

        setChargingHistory([]);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load vehicle data"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VEHICLE TYPE
  // ==========================================

  const isEV =
    String(vehicle?.fuelType || "")
      .toLowerCase() === "electric" ||
    String(vehicle?.fuelType || "")
      .toLowerCase() === "ev";

  const isTwoWheeler =
    String(vehicle?.vehicleType || "")
      .toLowerCase()
      .includes("2");

  // ==========================================
  // TOTAL COSTS
  // ==========================================

  const totalServiceCost = services.reduce(
    (sum, service) =>
      sum + Number(service.cost || 0),
    0
  );

  const totalFuelCost = fuelHistory.reduce(
    (sum, fuel) =>
      sum + Number(fuel.amount || 0),
    0
  );

  const totalChargingCost =
    chargingHistory.reduce(
      (sum, charging) =>
        sum +
        Number(charging.amount || 0),
      0
    );

  const totalExpense =
    totalServiceCost +
    totalFuelCost +
    totalChargingCost;

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
    if (!date) return "—";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FUEL COLOR
  // ==========================================

  const getFuelColor = () => {
    switch (
      String(vehicle?.fuelType || "")
        .toLowerCase()
    ) {
      case "petrol":
        return "#1976d2";

      case "diesel":
        return "#455a64";

      case "cng":
        return "#2e7d32";

      case "electric":
      case "ev":
        return "#7b1fa2";

      default:
        return "#616161";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f4f7fb",
        }}
      >
        <Navbar />

        <Container
          maxWidth="lg"
          sx={{ py: 5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              border:
                "1px solid #e2e8f0",
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "17px",
              }}
            >
              Loading vehicle details...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  // ==========================================
  // VEHICLE NOT FOUND
  // ==========================================

  if (!vehicle) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f4f7fb",
        }}
      >
        <Navbar />

        <Container
          maxWidth="lg"
          sx={{ py: 5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              mb={2}
            >
              Vehicle not found
            </Typography>

            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Back to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
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
        {/* ======================================
            BACK
        ====================================== */}

        <Button
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/dashboard")
          }
          sx={{
            mb: 2,
            color: "#475569",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back to Vehicles
        </Button>

        {/* ======================================
            VEHICLE HEADER
        ====================================== */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border:
              "1px solid #e2e8f0",
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
              color: "#ffffff",
              p: {
                xs: 2.5,
                sm: 4,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
              }}
            >
              {/* VEHICLE NAME */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 3,
                    backgroundColor:
                      "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                  }}
                >
                  {isTwoWheeler ? (
                    <TwoWheeler
                      sx={{
                        fontSize: 38,
                      }}
                    />
                  ) : (
                    <DirectionsCar
                      sx={{
                        fontSize: 38,
                      }}
                    />
                  )}
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "24px",
                        sm: "30px",
                      },
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {vehicle.brand}{" "}
                    {vehicle.model}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      opacity: 0.9,
                      fontSize: "15px",
                    }}
                  >
                    {
                      vehicle.registrationNumber
                    }
                  </Typography>
                </Box>
              </Box>

              {/* FUEL */}

              <Chip
                icon={
                  isEV ? (
                    <ElectricCar />
                  ) : (
                    <LocalGasStation />
                  )
                }
                label={
                  isEV
                    ? "EV"
                    : vehicle.fuelType
                }
                sx={{
                  backgroundColor:
                    "rgba(255,255,255,0.18)",
                  color: "#ffffff",
                  fontWeight: 700,

                  "& .MuiChip-icon": {
                    color: "#ffffff",
                  },
                }}
              />
            </Box>
          </Box>

          {/* ====================================
              VEHICLE INFORMATION
          ==================================== */}

          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
            }}
          >
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
              <InfoBox
                icon={<CalendarToday />}
                title="YEAR"
                value={vehicle.year}
              />

              <InfoBox
                icon={<Speed />}
                title="ODOMETER"
                value={`${formatNumber(
                  vehicle.odometer
                )} km`}
              />

              <InfoBox
                icon={<Build />}
                title="SERVICES"
                value={services.length}
              />

              <InfoBox
                icon={
                  isEV ? (
                    <Bolt />
                  ) : (
                    <LocalGasStation />
                  )
                }
                title={
                  isEV
                    ? "CHARGING"
                    : "FUEL ENTRIES"
                }
                value={
                  isEV
                    ? chargingHistory.length
                    : fuelHistory.length
                }
              />
            </Box>
          </CardContent>
        </Card>

        {/* ======================================
            QUICK ACTIONS
        ====================================== */}

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "21px",
              fontWeight: 700,
              color: "#14213d",
              mb: 1.5,
            }}
          >
            Quick Actions
          </Typography>

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
            {/* SERVICE */}

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() =>
                navigate(
                  `/add-service/${vehicle._id}`
                )
              }
              sx={{
                py: 1.3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor:
                  "#1565c0",

                "&:hover": {
                  backgroundColor:
                    "#0d47a1",
                },
              }}
            >
              Add Service
            </Button>

            {/* FUEL OR CHARGING */}

            {isEV ? (
              <Button
                variant="contained"
                startIcon={<Bolt />}
                onClick={() =>
                  navigate(
                    `/add-charging/${vehicle._id}`
                  )
                }
                sx={{
                  py: 1.3,
                  borderRadius: 2,
                  textTransform:
                    "none",
                  fontWeight: 600,
                  backgroundColor:
                    "#7b1fa2",

                  "&:hover": {
                    backgroundColor:
                      "#6a1b9a",
                  },
                }}
              >
                Add Charging
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={
                  <LocalGasStation />
                }
                onClick={() =>
                  navigate(
                    `/add-fuel/${vehicle._id}`
                  )
                }
                sx={{
                  py: 1.3,
                  borderRadius: 2,
                  textTransform:
                    "none",
                  fontWeight: 600,
                  backgroundColor:
                    "#ef6c00",

                  "&:hover": {
                    backgroundColor:
                      "#e65100",
                  },
                }}
              >
                Add Fuel
              </Button>
            )}

            {/* EDIT */}

            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() =>
                navigate(
                  `/edit-vehicle/${vehicle._id}`
                )
              }
              sx={{
                py: 1.3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Edit Vehicle
            </Button>

            {/* ALL VEHICLES */}

            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() =>
                navigate("/dashboard")
              }
              sx={{
                py: 1.3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              All Vehicles
            </Button>
          </Box>
        </Box>

        {/* ======================================
            EXPENSE OVERVIEW
        ====================================== */}

        <Typography
          sx={{
            fontSize: "21px",
            fontWeight: 700,
            color: "#14213d",
            mb: 1.5,
          }}
        >
          Expense Overview
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 1.5,
            mb: 4,
          }}
        >
          <ExpenseCard
            title="Service Cost"
            value={`₹${formatCurrency(
              totalServiceCost
            )}`}
            icon={<Build />}
            iconColor="#6d28d9"
            background="#f5f3ff"
          />

          {isEV ? (
            <ExpenseCard
              title="Charging Cost"
              value={`₹${formatCurrency(
                totalChargingCost
              )}`}
              icon={<Bolt />}
              iconColor="#7b1fa2"
              background="#faf5ff"
            />
          ) : (
            <ExpenseCard
              title="Fuel Cost"
              value={`₹${formatCurrency(
                totalFuelCost
              )}`}
              icon={
                <LocalGasStation />
              }
              iconColor="#ea580c"
              background="#fff7ed"
            />
          )}

          <ExpenseCard
            title="Total Expense"
            value={`₹${formatCurrency(
              totalExpense
            )}`}
            icon={<CurrencyRupee />}
            iconColor="#1565c0"
            background="#eff6ff"
          />
        </Box>

        {/* ======================================
            SERVICE HISTORY
        ====================================== */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border:
              "1px solid #e2e8f0",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#14213d",
                  }}
                >
                  🔧 Service History
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "14px",
                    mt: 0.3,
                  }}
                >
                  {services.length} service
                  {services.length !== 1
                    ? "s"
                    : ""}{" "}
                  recorded
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                onClick={() =>
                  navigate(
                    `/add-service/${vehicle._id}`
                  )
                }
                sx={{
                  borderRadius: 2,
                  textTransform:
                    "none",
                }}
              >
                Add
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {services.length === 0 ? (
              <EmptyState
                icon={<Build />}
                title="No service records"
                text="Add your first service record for this vehicle."
              />
            ) : (
              <Stack spacing={1.5}>
                {services.map(
                  (service) => (
                    <Paper
                      key={service._id}
                      elevation={0}
                      sx={{
                        p: {
                          xs: 1.5,
                          sm: 2,
                        },
                        borderRadius: 2,
                        border:
                          "1px solid #e2e8f0",
                        backgroundColor:
                          "#f8fafc",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize:
                                "17px",
                              fontWeight:
                                700,
                              color:
                                "#1e293b",
                            }}
                          >
                            {
                              service.serviceName
                            }
                          </Typography>

                          <Typography
                            sx={{
                              color:
                                "#64748b",
                              fontSize:
                                "14px",
                              mt: 0.5,
                            }}
                          >
                            {service.garageName ||
                              "Garage not specified"}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontWeight: 700,
                            color:
                              "#6d28d9",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          ₹
                          {formatCurrency(
                            service.cost
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display:
                            "flex",
                          gap: 1,
                          flexWrap:
                            "wrap",
                          mt: 1.5,
                        }}
                      >
                        <Chip
                          size="small"
                          icon={
                            <CalendarToday />
                          }
                          label={formatDate(
                            service.serviceDate
                          )}
                        />

                        <Chip
                          size="small"
                          icon={<Speed />}
                          label={`${formatNumber(
                            service.odometer
                          )} km`}
                        />
                      </Box>

                      {service.notes && (
                        <Typography
                          sx={{
                            mt: 1.5,
                            fontSize:
                              "14px",
                            color:
                              "#64748b",
                          }}
                        >
                          {service.notes}
                        </Typography>
                      )}
                    </Paper>
                  )
                )}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* ======================================
            EV CHARGING HISTORY
        ====================================== */}

        {isEV && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border:
                "1px solid #e2e8f0",
              mb: 3,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#14213d",
                    }}
                  >
                    ⚡ Charging History
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "14px",
                      mt: 0.3,
                    }}
                  >
                    {chargingHistory.length} charging
                    {chargingHistory.length !==
                    1
                      ? " entries"
                      : " entry"}{" "}
                    recorded
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={() =>
                    navigate(
                      `/add-charging/${vehicle._id}`
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform:
                      "none",
                    backgroundColor:
                      "#7b1fa2",

                    "&:hover": {
                      backgroundColor:
                        "#6a1b9a",
                    },
                  }}
                >
                  Add
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {chargingHistory.length ===
              0 ? (
                <EmptyState
                  icon={<Bolt />}
                  title="No charging records"
                  text="Add your first charging entry for this vehicle."
                />
              ) : (
                <Stack spacing={1.5}>
                  {chargingHistory.map(
                    (charging) => (
                      <Paper
                        key={
                          charging._id
                        }
                        elevation={0}
                        sx={{
                          p: {
                            xs: 1.5,
                            sm: 2,
                          },
                          borderRadius: 2,
                          border:
                            "1px solid #e9d5ff",
                          backgroundColor:
                            "#faf5ff",
                        }}
                      >
                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 1,
                              }}
                            >
                              <Bolt
                                sx={{
                                  color:
                                    "#7b1fa2",
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize:
                                    "17px",
                                  fontWeight:
                                    700,
                                  color:
                                    "#1e293b",
                                }}
                              >
                                {charging.units}{" "}
                                kWh
                              </Typography>
                            </Box>

                            <Typography
                              sx={{
                                color:
                                  "#64748b",
                                fontSize:
                                  "14px",
                                mt: 0.5,
                              }}
                            >
                              {charging.station ||
                                "Charging station not specified"}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              fontWeight:
                                700,
                              color:
                                "#7b1fa2",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            ₹
                            {formatCurrency(
                              charging.amount
                            )}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display:
                              "flex",
                            gap: 1,
                            flexWrap:
                              "wrap",
                            mt: 1.5,
                          }}
                        >
                          <Chip
                            size="small"
                            icon={
                              <Speed />
                            }
                            label={`${formatNumber(
                              charging.odometer
                            )} km`}
                          />

                          <Chip
                            size="small"
                            icon={
                              <CalendarToday />
                            }
                            label={formatDate(
                              charging.chargingDate
                            )}
                          />
                        </Box>

                        {charging.notes && (
                          <Typography
                            sx={{
                              mt: 1.5,
                              fontSize:
                                "14px",
                              color:
                                "#64748b",
                            }}
                          >
                            {
                              charging.notes
                            }
                          </Typography>
                        )}
                      </Paper>
                    )
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        )}

        {/* ======================================
            FUEL HISTORY
        ====================================== */}

        {!isEV && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border:
                "1px solid #e2e8f0",
              mb: 3,
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#14213d",
                    }}
                  >
                    ⛽ Fuel History
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "14px",
                      mt: 0.3,
                    }}
                  >
                    {fuelHistory.length} fuel
                    {fuelHistory.length !==
                    1
                      ? " entries"
                      : " entry"}{" "}
                    recorded
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={() =>
                    navigate(
                      `/add-fuel/${vehicle._id}`
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform:
                      "none",
                    backgroundColor:
                      "#ef6c00",

                    "&:hover": {
                      backgroundColor:
                        "#e65100",
                    },
                  }}
                >
                  Add
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {fuelHistory.length ===
              0 ? (
                <EmptyState
                  icon={
                    <LocalGasStation />
                  }
                  title="No fuel records"
                  text="Add your first fuel entry for this vehicle."
                />
              ) : (
                <Stack spacing={1.5}>
                  {fuelHistory.map(
                    (fuel) => (
                      <Paper
                        key={fuel._id}
                        elevation={0}
                        sx={{
                          p: {
                            xs: 1.5,
                            sm: 2,
                          },
                          borderRadius: 2,
                          border:
                            "1px solid #e2e8f0",
                          backgroundColor:
                            "#fffaf5",
                        }}
                      >
                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box>
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
                                sx={{
                                  color:
                                    "#ef6c00",
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize:
                                    "17px",
                                  fontWeight:
                                    700,
                                  color:
                                    "#1e293b",
                                }}
                              >
                                {
                                  fuel.fuelType
                                }
                              </Typography>
                            </Box>

                            <Typography
                              sx={{
                                color:
                                  "#64748b",
                                fontSize:
                                  "14px",
                                mt: 0.5,
                              }}
                            >
                              {fuel.station ||
                                "Fuel station not specified"}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              fontWeight:
                                700,
                              color:
                                "#ea580c",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            ₹
                            {formatCurrency(
                              fuel.amount
                            )}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display:
                              "flex",
                            gap: 1,
                            flexWrap:
                              "wrap",
                            mt: 1.5,
                          }}
                        >
                          <Chip
                            size="small"
                            label={`${fuel.litres} L`}
                          />

                          <Chip
                            size="small"
                            icon={
                              <Speed />
                            }
                            label={`${formatNumber(
                              fuel.odometer
                            )} km`}
                          />

                          <Chip
                            size="small"
                            icon={
                              <CalendarToday />
                            }
                            label={formatDate(
                              fuel.fuelDate
                            )}
                          />
                        </Box>

                        {fuel.notes && (
                          <Typography
                            sx={{
                              mt: 1.5,
                              fontSize:
                                "14px",
                              color:
                                "#64748b",
                            }}
                          >
                            {fuel.notes}
                          </Typography>
                        )}
                      </Paper>
                    )
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        )}

        {/* ======================================
            BOTTOM
        ====================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "center",
            pb: 3,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate("/dashboard")
            }
            sx={{
              borderRadius: 2,
              px: 4,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// ==========================================
// INFO BOX
// ==========================================

function InfoBox({
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.7,
          mb: 0.5,
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
            fontSize: "11px",
            fontWeight: 700,
            color: "#64748b",
          }}
        >
          {title}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// ==========================================
// EXPENSE CARD
// ==========================================

function ExpenseCard({
  title,
  value,
  icon,
  iconColor,
  background,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2.5,
        border:
          "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            backgroundColor:
              background,
            color: iconColor,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
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
                xs: "17px",
                sm: "20px",
              },
              fontWeight: 700,
              color: "#1e293b",
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

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 4,
      }}
    >
      <Box
        sx={{
          color: "#94a3b8",
          mb: 1,
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          color: "#334155",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

export default VehicleDetails;
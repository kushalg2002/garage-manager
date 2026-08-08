import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  DirectionsCar,
  ElectricBike,
  ElectricCar,
  LocalGasStation,
  Search,
  Add,
  Build,
} from "@mui/icons-material";

import api from "../services/api";
import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";
import DashboardStats from "../components/mui/DashboardStats";

function Dashboard() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState("All");

  const [selectedType, setSelectedType] = useState("All");

  const [showExpenses, setShowExpenses] = useState(false);

  const [chargingHistory, setChargingHistory] = useState([]);

  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalServices: 0,
    totalFuelEntries: 0,
    totalExpense: 0,
    vehicleExpenses: [],
  });

  useEffect(() => {
    fetchVehicles();
    fetchDashboardStats();
    fetchCharging();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
  "VEHICLES FROM API:",
  response.data.vehicles
);

      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Failed to load vehicles"
        );
      } else {
        alert("Failed to load vehicles");
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

      console.log(
        "Dashboard API response:",
        response.data
      );

      console.log(
        "Vehicle Expenses:",
        response.data.stats?.vehicleExpenses
      );

      setStats(
        response.data.stats || {
          totalVehicles: 0,
          totalServices: 0,
          totalFuelEntries: 0,
          totalExpense: 0,
          vehicleExpenses: [],
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCharging = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/charging", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChargingHistory(
        response.data.chargingHistory || []
      );
    } catch (error) {
      console.error("Charging fetch error:", error);
    }
  };

  /*
   * Supports values such as:
   * "2 Wheeler"
   * "2 Wheeler"
   * "2-wheeler"
   * "2Wheeler"
   *
   * and:
   * "4 Wheeler"
   * "4 Wheeler"
   * "4-wheeler"
   */
  const getVehicleType = (vehicle) => {
    const type = String(
      vehicle?.vehicleType || ""
    ).toLowerCase();

    if (
      type.includes("2") ||
      type.includes("two")
    ) {
      return "2 Wheeler";
    }

    if (
      type.includes("4") ||
      type.includes("four")
    ) {
      return "4 Wheeler";
    }

    // Existing vehicles created before vehicleType
    // was added are treated as 4 wheelers.
    return "4 Wheeler";
  };

  const twoWheelers = useMemo(
    () =>
      vehicles.filter(
        (vehicle) =>
          getVehicleType(vehicle) ===
          "2 Wheeler"
      ),
    [vehicles]
  );

  const fourWheelers = useMemo(
    () =>
      vehicles.filter(
        (vehicle) =>
          getVehicleType(vehicle) ===
          "4 Wheeler"
      ),
    [vehicles]
  );

  const selectedVehicles = useMemo(() => {
    if (selectedType === "2 Wheeler") {
      return twoWheelers;
    }

    if (selectedType === "4 Wheeler") {
      return fourWheelers;
    }

    return vehicles;
  }, [
    selectedType,
    vehicles,
    twoWheelers,
    fourWheelers,
  ]);

  const selectedVehicleIds = useMemo(
    () =>
      new Set(
        selectedVehicles.map((vehicle) =>
          String(vehicle._id)
        )
      ),
    [selectedVehicles]
  );

  /*
   * Vehicle-wise expense data from backend
   */
  const selectedVehicleExpenses = useMemo(() => {
    return (stats.vehicleExpenses || []).filter(
      (item) =>
        selectedVehicleIds.has(
          String(item.vehicleId)
        )
    );
  }, [
    stats.vehicleExpenses,
    selectedVehicleIds,
  ]);

  const selectedServiceCount =
    selectedVehicleExpenses.reduce(
      (sum, vehicle) =>
        sum +
        Number(vehicle.serviceCount || 0),
      0
    );

  const selectedFuelCount =
    selectedVehicleExpenses.reduce(
      (sum, vehicle) =>
        sum +
        Number(vehicle.fuelCount || 0),
      0
    );

  const selectedServiceExpense =
    selectedVehicleExpenses.reduce(
      (sum, vehicle) =>
        sum +
        Number(vehicle.serviceCost || 0),
      0
    );

  const selectedFuelExpense =
    selectedVehicleExpenses.reduce(
      (sum, vehicle) =>
        sum +
        Number(vehicle.fuelCost || 0),
      0
    );

  const selectedChargingHistory =
    chargingHistory.filter((charging) =>
      selectedVehicleIds.has(
        String(
          charging.vehicle?._id ||
            charging.vehicle
        )
      )
    );

  const selectedChargingCount =
    selectedChargingHistory.length;

  const selectedChargingExpense =
    selectedChargingHistory.reduce(
      (sum, charging) =>
        sum +
        Number(charging.amount || 0),
      0
    );

  const selectedTotalExpense =
    selectedVehicleExpenses.reduce(
      (sum, vehicle) =>
        sum +
        Number(vehicle.totalExpense || 0),
      0
    ) + selectedChargingExpense;

  /*
   * Fuel counts
   */
  const petrolCount = selectedVehicles.filter(
    (vehicle) =>
      String(vehicle.fuelType || "")
        .toLowerCase() === "petrol"
  ).length;

  const dieselCount = selectedVehicles.filter(
    (vehicle) =>
      String(vehicle.fuelType || "")
        .toLowerCase() === "diesel"
  ).length;

  const cngCount = selectedVehicles.filter(
    (vehicle) =>
      String(vehicle.fuelType || "")
        .toLowerCase() === "cng"
  ).length;

  const evCount = selectedVehicles.filter(
    (vehicle) => {
      const fuel = String(
        vehicle.fuelType || ""
      ).toLowerCase();

      return (
        fuel === "ev" ||
        fuel === "electric" ||
        fuel === "electric vehicle"
      );
    }
  ).length;

  const chargingCount =
    selectedType === "All"
      ? chargingHistory.length
      : selectedChargingCount;

  /*
   * Search + fuel filter
   */
  const filteredVehicles =
    selectedVehicles.filter((vehicle) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        vehicle.brand
          ?.toLowerCase()
          .includes(keyword) ||
        vehicle.model
          ?.toLowerCase()
          .includes(keyword) ||
        vehicle.registrationNumber
          ?.toLowerCase()
          .includes(keyword);

      const vehicleFuel = String(
        vehicle.fuelType || ""
      ).toLowerCase();

      const normalizedFilter =
        String(fuelFilter || "").toLowerCase();

      const matchesFuel =
        fuelFilter === "All" ||
        vehicleFuel === normalizedFilter ||
        (normalizedFilter === "ev" &&
          [
            "electric",
            "ev",
            "electric vehicle",
          ].includes(vehicleFuel));

      return matchesSearch && matchesFuel;
    });

  /*
   * Main dashboard
   */
  const openVehicleType = (type) => {
    setSelectedType(type);
    setSearch("");
    setFuelFilter("All");
    setShowExpenses(false);

    setTimeout(() => {
      document
        .getElementById("my-vehicles")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /*
   * Return to main dashboard
   */
  const goBackToAllVehicles = () => {
    setSelectedType("All");
    setSearch("");
    setFuelFilter("All");
    setShowExpenses(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Fuel filters for vehicle list
   */
 const fuelFilters =
  selectedType === "2 Wheeler"
    ? [
        {
          name: "All",
          icon: (
            <DirectionsCar fontSize="small" />
          ),
        },
        {
          name: "Petrol",
          icon: (
            <LocalGasStation fontSize="small" />
          ),
        },
        {
          name: "EV",
          icon: (
            <ElectricBike fontSize="small" />
          ),
        },
      ]
    : selectedType === "4 Wheeler"
    ? [
        {
          name: "All",
          icon: (
            <DirectionsCar fontSize="small" />
          ),
        },
        {
          name: "Petrol",
          icon: (
            <LocalGasStation fontSize="small" />
          ),
        },
        {
          name: "Diesel",
          icon: (
            <LocalGasStation fontSize="small" />
          ),
        },
        {
          name: "CNG",
          icon: (
            <LocalGasStation fontSize="small" />
          ),
        },
        {
          name: "EV",
          icon: (
            <ElectricCar fontSize="small" />
          ),
        },
      ]
    : [
        {
          name: "All",
          icon: (
            <DirectionsCar fontSize="small" />
          ),
        },
        {
          name: "Petrol",
          icon: (
            <LocalGasStation fontSize="small" />
          ),
        },
        {
          name: "Diesel",
          icon: (
            <LocalGasStation fontSize="small" />
          ),
        },
        {
          name: "CNG",
          icon: (
            <LocalGasStation fontSize="small" />
          ),
        },
        {
          name: "EV",
          icon: (
            <ElectricCar fontSize="small" />
          ),
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
        {/* HEADER */}

        <Box
          sx={{
            mb: 3,
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
          <Box
            sx={{
              textAlign: "left",
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
                fontSize: {
                  xs: "17px",
                  sm: "19px",
                },
                mb: 0.3,
                fontWeight: 800,
              }}
            >
              Welcome back 👋
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "30px",
                  sm: "30px",
                },
                fontWeight: 800,
                color: "#14213d",
                lineHeight: 1.2,
              }}
            >
              Kushalgowda N R
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: "#64748b",
                fontSize: {
                  xs: "15px",
                  sm: "17px",
                },
                fontWeight: 800,
              }}
            >
              Manage your vehicles, services
              and fuel expenses in one place.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            href="/add-vehicle"
            sx={{
              alignSelf: {
                xs: "flex-start",
                md: "auto",
              },
              height: 46,
              px: 2.5,
              borderRadius: 2,
              backgroundColor: "#1565c0",
              fontWeight: 700,
              textTransform: "none",
              boxShadow:
                "0 5px 15px rgba(21,101,192,0.20)",

              "&:hover": {
                backgroundColor: "#0d47a1",
              },
            }}
          >
            Add Vehicle
          </Button>
        </Box>

        {/* ===================================== */}
        {/* MAIN VEHICLE TYPE DASHBOARD */}
        {/* ===================================== */}

        {selectedType === "All" && (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },
                gap: 2,
                mb: 4,
              }}
            >
              <DashboardStats
                title="Total Vehicles"
                value={
                  stats.totalVehicles ||
                  vehicles.length
                }
                onClick={() => {
                  setSearch("");
                  setFuelFilter("All");
                  setShowExpenses(false);

                  document
                    .getElementById(
                      "my-vehicles"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              />

              <DashboardStats
                title="🏍️ 2 Wheelers"
                value={twoWheelers.length}
                onClick={() =>
                  openVehicleType(
                    "2 Wheeler"
                  )
                }
              />

              <DashboardStats
                title="🚗 4 Wheelers"
                value={fourWheelers.length}
                onClick={() =>
                  openVehicleType(
                    "4 Wheeler"
                  )
                }
              />
            </Box>
          </>
        )}

        {/* ===================================== */}
        {/* CATEGORY DASHBOARD */}
        {/* ===================================== */}

        {selectedType !== "All" && (
          <>
            {/* BACK BUTTON + TITLE */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Button
                onClick={
                  goBackToAllVehicles
                }
                startIcon={<ArrowBack />}
                sx={{
                  minWidth: "auto",
                  color: "#1565c0",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 1.5,
                }}
              >
                All Vehicles
              </Button>

              <Divider
                orientation="vertical"
                flexItem
              />

              <Typography
                sx={{
                  fontSize: {
                    xs: "22px",
                    sm: "28px",
                  },
                  fontWeight: 800,
                  color: "#14213d",
                }}
              >
                {selectedType ===
                "2 Wheeler"
                  ? "🏍️ 2 Wheeler"
                  : "🚗 4 Wheeler"}
              </Typography>
            </Box>

            {/* CATEGORY STATS */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "repeat(3, 1fr)",
                  md:
                    selectedType ===
                    "2 Wheeler"
                      ? "repeat(3, 1fr)"
                      : "repeat(4, 1fr)",
                },
                gap: 2,
                mb: 4,
              }}
            >
              {/* PETROL */}

              <DashboardStats
                title="Petrol"
                value={petrolCount}
                onClick={() => {
                  setFuelFilter(
                    "Petrol"
                  );
                  setSearch("");
                  setShowExpenses(
                    false
                  );
                }}
              />

              {/* 4 WHEELER DIESEL */}

              {selectedType ===
                "4 Wheeler" && (
                <DashboardStats
                  title="Diesel"
                  value={dieselCount}
                  onClick={() => {
                    setFuelFilter(
                      "Diesel"
                    );
                    setSearch("");
                    setShowExpenses(
                      false
                    );
                  }}
                />
              )}

              {/* 4 WHEELER CNG */}

              {selectedType ===
                "4 Wheeler" && (
                <DashboardStats
                  title="CNG"
                  value={cngCount}
                  onClick={() => {
                    setFuelFilter(
                      "CNG"
                    );
                    setSearch("");
                    setShowExpenses(
                      false
                    );
                  }}
                />
              )}

              {/* EV */}

              <DashboardStats
                title="EV"
                value={evCount}
                onClick={() => {
                  setFuelFilter("EV");
                  setSearch("");
                  setShowExpenses(
                    false
                  );
                }}
              />

              {/* SERVICES */}

              <DashboardStats
                title="Services"
                value={selectedServiceCount}
                onClick={() => {
                  setShowExpenses(
                    false
                  );
                }}
              />

              {/* FUEL */}

              <DashboardStats
                title="Fuel"
                value={selectedFuelCount}
                onClick={() => {
                  setShowExpenses(
                    false
                  );
                }}
              />

              {/* CHARGING */}

              <DashboardStats
                title="Charging"
                value={chargingCount}
                onClick={() => {
                  setShowExpenses(false);
                  navigate("/charging");
                }}
              />

              {/* EXPENSES */}

              <DashboardStats
                title="Expenses"
                value={`₹${Number(
                  selectedTotalExpense ||
                    0
                ).toLocaleString(
                  "en-IN"
                )}`}
                onClick={() =>
                  setShowExpenses(
                    !showExpenses
                  )
                }
              />
            </Box>
          </>
        )}

        {/* ===================================== */}
        {/* EXPENSE BREAKDOWN */}
        {/* ===================================== */}

        {showExpenses &&
          selectedType !== "All" && (
            <Paper
              elevation={0}
              sx={{
                mb: 4,
                p: {
                  xs: 2,
                  sm: 3,
                },
                borderRadius: 3,
                border:
                  "1px solid #e2e8f0",
                backgroundColor:
                  "#ffffff",
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
                  gap: 1,
                  mb: 3,
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
                    💰 Expense Breakdown
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      mt: 0.5,
                    }}
                  >
                    {selectedType} service,
                    fuel and charging expenses
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#1565c0",
                  }}
                >
                  ₹
                  {Number(
                    selectedTotalExpense ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </Typography>
              </Box>

              {selectedVehicleExpenses
                .length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    backgroundColor:
                      "#f8fafc",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#64748b",
                    }}
                  >
                    No vehicle expense
                    data available.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {selectedVehicleExpenses.map(
                    (vehicle) => (
                      <Box
                        key={
                          vehicle.vehicleId
                        }
                        sx={{
                          border:
                            "1px solid #e2e8f0",
                          borderRadius: 3,
                          p: 2.5,
                          backgroundColor:
                            "#f8fafc",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize:
                              "18px",
                            fontWeight: 700,
                            color:
                              "#14213d",
                          }}
                        >
                          {selectedType ===
                          "2 Wheeler"
                            ? "🏍️"
                            : "🚗"}{" "}
                          {vehicle.brand}{" "}
                          {vehicle.model}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              "13px",
                            color:
                              "#64748b",
                            mb: 2,
                          }}
                        >
                          {
                            vehicle.registrationNumber
                          }
                        </Typography>

                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            mb: 1.2,
                          }}
                        >
                          <Typography>
                            🔧 Service
                          </Typography>

                          <Typography fontWeight={600}>
                            ₹
                            {Number(
                              vehicle.serviceCost ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            mb: 1.5,
                          }}
                        >
                          <Typography>
                            ⛽ Fuel
                          </Typography>

                          <Typography fontWeight={600}>
                            ₹
                            {Number(
                              vehicle.fuelCost ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1.5,
                          }}
                        >
                          <Typography>
                            ⚡ Charging
                          </Typography>

                          <Typography fontWeight={600}>
                            ₹
                            {selectedChargingHistory
                              .filter(
                                (charging) =>
                                  String(
                                    charging.vehicle?._id ||
                                      charging.vehicle
                                  ) ===
                                  String(vehicle.vehicleId)
                              )
                              .reduce(
                                (sum, charging) =>
                                  sum +
                                  Number(
                                    charging.amount || 0
                                  ),
                                0
                              )
                              .toLocaleString("en-IN")}
                          </Typography>
                        </Box>

                        <Divider
                          sx={{
                            mb: 1.5,
                          }}
                        />

                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                          }}
                        >
                          <Typography fontWeight={700}>
                            Total Expense
                          </Typography>

                          <Typography
                            fontWeight={700}
                            sx={{
                              color:
                                "#1565c0",
                              fontSize:
                                "18px",
                            }}
                          >
                            ₹
                            {(
                              Number(
                                vehicle.totalExpense || 0
                              ) +
                              selectedChargingHistory
                                .filter(
                                  (charging) =>
                                    String(
                                      charging.vehicle?._id ||
                                        charging.vehicle
                                    ) ===
                                    String(vehicle.vehicleId)
                                )
                                .reduce(
                                  (sum, charging) =>
                                    sum +
                                    Number(charging.amount || 0),
                                  0
                                )
                            ).toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Paper>
          )}

        {/* ===================================== */}
        {/* SEARCH + FILTER */}
        {/* ===================================== */}

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: 3,
            border:
              "1px solid #e2e8f0",
            backgroundColor:
              "#ffffff",
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
              gap: 1,
              mb: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#14213d",
                }}
              >
                Find Your Vehicle
              </Typography>

              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#64748b",
                  mt: 0.3,
                }}
              >
                Search and filter your
                vehicles
              </Typography>
            </Box>

            <Chip
              label={`${filteredVehicles.length} ${
                filteredVehicles.length ===
                1
                  ? "Vehicle"
                  : "Vehicles"
              }`}
              sx={{
                fontWeight: 600,
                backgroundColor:
                  "#eaf2ff",
                color: "#1565c0",
              }}
            />
          </Box>

          <TextField
            fullWidth
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by brand, model or registration number"
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root":
                {
                  height: 52,
                  borderRadius: 2,
                  backgroundColor:
                    "#f8fafc",
                },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color:
                        "#64748b",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#475569",
              mb: 1,
            }}
          >
            Filter by fuel type
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {fuelFilters.map(
              (fuel) => (
                <Chip
                  key={fuel.name}
                  icon={fuel.icon}
                  label={fuel.name}
                  clickable
                  onClick={() =>
                    setFuelFilter(
                      fuel.name
                    )
                  }
                  sx={{
                    height: 38,
                    px: 0.8,
                    borderRadius: 2,
                    fontWeight: 600,
                    border:
                      "1px solid #e2e8f0",
                    backgroundColor:
                      fuelFilter ===
                      fuel.name
                        ? "#1565c0"
                        : "#f8fafc",
                    color:
                      fuelFilter ===
                      fuel.name
                        ? "#ffffff"
                        : "#475569",
                  }}
                />
              )
            )}
          </Box>
        </Paper>

        {/* ===================================== */}
        {/* VEHICLES */}
        {/* ===================================== */}

        <Box
          id="my-vehicles"
          sx={{
            mb: 2,
          }}
        >
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
            {selectedType ===
            "All"
              ? "My Vehicles"
              : `My ${selectedType}s`}
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              mt: 0.5,
            }}
          >
            {filteredVehicles.length} vehicle
            {filteredVehicles.length !==
            1
              ? "s"
              : ""}{" "}
            found
          </Typography>
        </Box>

        {/* LOADING */}

        {loading && (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              border:
                "1px solid #e5e7eb",
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

        {/* EMPTY */}

        {!loading &&
          filteredVehicles.length ===
            0 && (
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
                  "1px solid #e5e7eb",
                backgroundColor:
                  "#ffffff",
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
                Try changing your search
                or fuel filter.
              </Typography>

              <Button
                variant="contained"
                startIcon={<Add />}
                href="/add-vehicle"
                sx={{
                  textTransform:
                    "none",
                  borderRadius: 2,
                }}
              >
                Add Vehicle
              </Button>
            </Paper>
          )}

        {/* VEHICLE CARDS */}

        {!loading &&
          filteredVehicles.length >
            0 && (
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
              {filteredVehicles.map(
                (vehicle) => (
                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                  />
                )
              )}
            </Box>
          )}
      </Container>
    </Box>
  );
}

export default Dashboard;
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Chip,
  Box,
  Divider,
} from "@mui/material";

import {
  DirectionsCar,
  LocalGasStation,
  CalendarToday,
  Speed,
  Build,
  Add,
  Visibility,
  Edit,
  Delete,
  History,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import api from "../services/api";

function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await api.delete(
        `/vehicles/${vehicle._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  const getFuelColor = () => {
    switch (vehicle.fuelType) {
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
        width: "100%",
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        transition: "all 0.25s ease",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow:
            "0 12px 30px rgba(15, 23, 42, 0.10)",
          borderColor: "#cbd5e1",
        },
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },
          pt: 2.5,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              minWidth: 52,
              borderRadius: 2.5,
              backgroundColor: "#eaf2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DirectionsCar
              sx={{
                fontSize: 30,
                color: "#1565c0",
              }}
            />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "19px",
                  sm: "21px",
                },
                fontWeight: 700,
                color: "#14213d",
                lineHeight: 1.25,
                wordBreak: "break-word",
              }}
            >
              {vehicle.brand} {vehicle.model}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: "14px",
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              {vehicle.registrationNumber}
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<LocalGasStation />}
          label={vehicle.fuelType}
          size="small"
          sx={{
            flexShrink: 0,
            color: "#ffffff",
            backgroundColor: getFuelColor(),
            fontWeight: 600,

            "& .MuiChip-icon": {
              color: "#ffffff",
              fontSize: 17,
            },
          }}
        />
      </Box>

      <Divider />

      <CardContent
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },
          py: 2.5,
        }}
      >
        {/* Vehicle Information */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "1fr 1fr",
            },
            gap: 1.5,
          }}
        >
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
                gap: 0.8,
                mb: 0.5,
              }}
            >
              <CalendarToday
                sx={{
                  fontSize: 17,
                  color: "#64748b",
                }}
              />

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                YEAR
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: "16px",
                color: "#1e293b",
                fontWeight: 700,
              }}
            >
              {vehicle.year}
            </Typography>
          </Box>

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
                gap: 0.8,
                mb: 0.5,
              }}
            >
              <Speed
                sx={{
                  fontSize: 18,
                  color: "#64748b",
                }}
              />

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                ODOMETER
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: "16px",
                color: "#1e293b",
                fontWeight: 700,
              }}
            >
              {Number(
                vehicle.odometer || 0
              ).toLocaleString("en-IN")}{" "}
              km
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      {/* Primary Action */}
      <CardActions
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },
          pt: 0,
          pb: 1.5,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          startIcon={<Visibility />}
          onClick={() =>
            navigate(`/vehicle/${vehicle._id}`)
          }
          sx={{
            py: 1.2,
            borderRadius: 2,
            backgroundColor: "#1565c0",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "15px",

            "&:hover": {
              backgroundColor: "#0d47a1",
            },
          }}
        >
          View Vehicle
        </Button>
      </CardActions>

      {/* Quick Actions */}
      <Box
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },
          pb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            color: "#94a3b8",
            fontWeight: 600,
            mb: 1,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Quick Actions
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "1fr 1fr",
            },
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Build />}
            onClick={() =>
              navigate(
                `/add-service/${vehicle._id}`
              )
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#cbd5e1",
              color: "#334155",
            }}
          >
            Add Service
          </Button>

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() =>
              navigate(
                `/add-fuel/${vehicle._id}`
              )
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#fed7aa",
              color: "#c2410c",
            }}
          >
            Add Fuel
          </Button>

          <Button
            variant="outlined"
            startIcon={<History />}
            onClick={() =>
              navigate(
                `/services?vehicle=${vehicle._id}`
              )
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#ddd6fe",
              color: "#6d28d9",
            }}
          >
            Services
          </Button>

          <Button
            variant="outlined"
            startIcon={<LocalGasStation />}
            onClick={() =>
              navigate(
                `/fuel?vehicle=${vehicle._id}`
              )
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#bfdbfe",
              color: "#1d4ed8",
            }}
          >
            Fuel History
          </Button>
        </Box>

        {/* Edit / Delete */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 1.5,
          }}
        >
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={() =>
              navigate(
                `/edit-vehicle/${vehicle._id}`
              )
            }
            sx={{
              textTransform: "none",
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            Edit
          </Button>

          <Button
            size="small"
            startIcon={<Delete />}
            onClick={handleDelete}
            sx={{
              textTransform: "none",
              color: "#dc2626",
              fontWeight: 600,
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

export default VehicleCard;
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";

import {
  DirectionsCar,
  LocalGasStation,
  CalendarToday,
  Speed,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import api from "../services/api";

function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await api.delete(`/vehicles/${vehicle._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          <DirectionsCar
            sx={{
              mr: 1,
              verticalAlign: "middle",
            }}
          />
          {vehicle.brand} {vehicle.model}
        </Typography>

        <Stack spacing={1}>
          <Typography>
            <strong>Registration:</strong>{" "}
            {vehicle.registrationNumber}
          </Typography>

          <Typography>
            <CalendarToday
              sx={{
                fontSize: 18,
                mr: 1,
                verticalAlign: "middle",
              }}
            />
            <strong>Year:</strong> {vehicle.year}
          </Typography>

          <Chip
            icon={<LocalGasStation />}
            label={vehicle.fuelType}
            color="primary"
            sx={{ width: "fit-content" }}
          />

          <Typography>
            <Speed
              sx={{
                fontSize: 18,
                mr: 1,
                verticalAlign: "middle",
              }}
            />
            <strong>Odometer:</strong> {vehicle.odometer} km
          </Typography>
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          p: 2,
        }}
      >
        {/* Edit */}
        <Button
          variant="contained"
          onClick={() =>
            navigate(`/edit-vehicle/${vehicle._id}`)
          }
        >
          Edit
        </Button>

        {/* Delete */}
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>

        {/* Vehicle Details */}
        <Button
          variant="contained"
          color="success"
          onClick={() =>
            navigate(`/vehicle/${vehicle._id}`)
          }
        >
          View Details
        </Button>

        {/* Add Service */}
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            navigate(`/add-service/${vehicle._id}`)
          }
        >
          🔧 Add Service
        </Button>

        {/* Service History */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() =>
            navigate(`/services?vehicle=${vehicle._id}`)
          }
        >
          📋 Services
        </Button>

        {/* Add Fuel */}
        <Button
          variant="outlined"
          color="warning"
          onClick={() =>
            navigate(`/add-fuel/${vehicle._id}`)
          }
        >
          ⛽ Add Fuel
        </Button>

        {/* Fuel History */}
        <Button
          variant="outlined"
          color="info"
          onClick={() =>
            navigate(`/fuel?vehicle=${vehicle._id}`)
          }
        >
          📋 Fuel History
        </Button>
      </CardActions>
    </Card>
  );
}

export default VehicleCard;
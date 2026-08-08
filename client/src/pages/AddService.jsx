import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  
  TextField,
  Typography,
} from "@mui/material";
import api from "../services/api";

function AddService() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDate: "",
    garageName: "",
    cost: "",
    odometer: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.post(
        "/services",
        {
          vehicle: vehicleId,
          serviceName: formData.serviceName,
          serviceDate: formData.serviceDate,
          garageName: formData.garageName,
          cost: Number(formData.cost),
          odometer: Number(formData.odometer),
          notes: formData.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Service Added Successfully");

      navigate(`/vehicle/${vehicleId}`);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add service"
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",

      "& fieldset": {
        borderColor: "#c4c4c4",
      },

      "&:hover fieldset": {
        borderColor: "#1976d2",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
    },

    "& .MuiInputBase-input": {
      color: "#333333",
      backgroundColor: "#ffffff",
    },

    "& .MuiInputBase-input::placeholder": {
      color: "#777777",
      opacity: 1,
    },

    "& .MuiInputLabel-root": {
      color: "#555555",
      backgroundColor: "#ffffff",
      padding: "0 4px",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#1976d2",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: "#ffffff",
        }}
      >
        <CardContent
          sx={{
            padding: {
              xs: 3,
              sm: 4,
              md: 5,
            },
          }}
        >
          {/* Title */}
          <Typography
            variant="h3"
            fontWeight="500"
            textAlign="center"
            sx={{
              color: "#222222",
              mb: 1,
              fontSize: {
                xs: "36px",
                sm: "44px",
                md: "48px",
              },
            }}
          >
            🔧 Add Service
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{
              color: "#333333",
              mb: 5,
              fontSize: "18px",
            }}
          >
            Add a new service record for this vehicle.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Service Name */}
            <TextField
              fullWidth
              required
              label="Service Name"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="Example: General Service"
              sx={fieldStyle}
            />

            {/* Service Date */}
<TextField
              fullWidth
              required
              label="Service Date"
              name="serviceDate"
              type="date"
              value={formData.serviceDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  backgroundColor: "white",
                  padding: "0 8px",
                },
              }}
            />


            {/* Garage Name */}
            <TextField
              fullWidth
              required
              label="Garage Name"
              name="garageName"
              value={formData.garageName}
              onChange={handleChange}
              placeholder="Example: Aravind Motors"
              sx={fieldStyle}
            />

            {/* Cost */}
            <TextField
              fullWidth
              required
              label="Cost"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              placeholder="Enter service cost"
              inputProps={{
                min: 0,
              }}
              sx={fieldStyle}
            />

            {/* Odometer */}
            <TextField
              fullWidth
              required
              label="Odometer"
              name="odometer"
              type="number"
              value={formData.odometer}
              onChange={handleChange}
              placeholder="Enter current odometer"
              inputProps={{
                min: 0,
              }}
              sx={fieldStyle}
            />

            {/* Notes */}
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter service details"
              multiline
              rows={4}
              sx={fieldStyle}
            />

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 1,
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: "16px",
                }}
              >
                {loading ? "Saving..." : "Add Service"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                fullWidth
                onClick={() =>
                  navigate(`/vehicle/${vehicleId}`)
                }
                sx={{
                  py: 1.5,
                  fontSize: "16px",
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

export default AddService;
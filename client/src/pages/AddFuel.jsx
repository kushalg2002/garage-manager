import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import api from "../services/api";

function AddFuel() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fuelType: "",
    litres: "",
    amount: "",
    odometer: "",
    fuelDate: "",
    station: "",
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
        "/fuel",
        {
          vehicle: vehicleId,
          fuelType: formData.fuelType,
          litres: Number(formData.litres),
          amount: Number(formData.amount),
          odometer: Number(formData.odometer),
          fuelDate: formData.fuelDate,
          station: formData.station,
          notes: formData.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Fuel Entry Added Successfully");

      navigate(`/vehicle/${vehicleId}`);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add fuel entry"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: { xs: 2, md: 4 },
      }}
    >
      <Card
        sx={{
          maxWidth: 650,
          mx: "auto",
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            ⛽ Add Fuel
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}
          >
            Add a new fuel entry for this vehicle.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <TextField
              fullWidth
              required
              select
              label="Fuel Type"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
            >
              <MenuItem value="Petrol">Petrol</MenuItem>
              <MenuItem value="Diesel">Diesel</MenuItem>
              <MenuItem value="CNG">CNG</MenuItem>
              <MenuItem value="Electric">Electric</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </TextField>

            <TextField
              fullWidth
              required
              label="Litres"
              name="litres"
              type="number"
              value={formData.litres}
              onChange={handleChange}
              inputProps={{
                step: "0.01",
                min: "0",
              }}
              placeholder="Enter litres"
            />

            <TextField
              fullWidth
              required
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              inputProps={{
                min: "0",
              }}
              placeholder="Enter amount"
            />

            <TextField
              fullWidth
              required
              label="Odometer"
              name="odometer"
              type="number"
              value={formData.odometer}
              onChange={handleChange}
              inputProps={{
                min: "0",
              }}
              placeholder="Enter current odometer"
            />

            {/* FIXED DATE FIELD */}
            <TextField
              fullWidth
              required
              label="Fuel Date"
              name="fuelDate"
              type="date"
              value={formData.fuelDate}
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

            <TextField
              fullWidth
              required
              label="Fuel Station"
              name="station"
              value={formData.station}
              onChange={handleChange}
              placeholder="Example: Indian Oil"
            />

            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Example: Full Tank"
              multiline
              rows={4}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="warning"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? "Saving..." : "Add Fuel"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={() =>
                  navigate(`/vehicle/${vehicleId}`)
                }
                fullWidth
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

export default AddFuel;
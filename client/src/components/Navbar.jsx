import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background:
          "linear-gradient(90deg, #0d47a1 0%, #1976d2 50%, #1565c0 100%)",
        borderBottom: "3px solid #64b5f6",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 64,
            sm: 70,
          },
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* LOGO + APP NAME */}

        <Box
          component={Link}
          to="/dashboard"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            textDecoration: "none",
            color: "#fff",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: {
                xs: 42,
                sm: 48,
              },
              height: {
                xs: 42,
                sm: 48,
              },
              borderRadius: 2,
              background:
                "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              boxShadow:
                "0 3px 10px rgba(0,0,0,0.20)",
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/knr-logo.svg"
              alt="KNR Logo"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: {
                xs: "19px",
                sm: "24px",
              },
              fontWeight: 800,
              whiteSpace: "nowrap",
              letterSpacing: "-0.3px",
            }}
          >
            Garage Manager
          </Typography>
        </Box>

        {/* NAVIGATION */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 0.5,
              sm: 1,
              md: 1.2,
            },
          }}
        >
          {/* DASHBOARD */}

          <Button
            component={Link}
            to="/dashboard"
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: {
                xs: "10px",
                sm: "13px",
              },
              textTransform: "uppercase",
              minWidth: "auto",
              px: {
                xs: 1,
                sm: 1.5,
              },
              borderRadius: 2,

              backgroundColor:
                location.pathname === "/dashboard"
                  ? "rgba(255,255,255,0.18)"
                  : "transparent",

              "&:hover": {
                backgroundColor:
                  "rgba(76,175,80,0.25)",
              },
            }}
          >
            Dashboard
          </Button>

          {/* ADD VEHICLE */}

          <Button
            component={Link}
            to="/add-vehicle"
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: {
                xs: "10px",
                sm: "13px",
              },
              textTransform: "uppercase",
              minWidth: "auto",
              px: {
                xs: 1,
                sm: 1.5,
              },
              borderRadius: 2,

              backgroundColor:
                location.pathname === "/add-vehicle"
                  ? "#ff9800"
                  : "rgba(255,152,0,0.18)",

              border:
                "1px solid rgba(255,193,7,0.35)",

              "&:hover": {
                backgroundColor: "#fb8c00",
              },
            }}
          >
            Add Vehicle
          </Button>

          {/* LOGOUT */}

          <Button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: {
                xs: "10px",
                sm: "13px",
              },
              textTransform: "uppercase",
              minWidth: "auto",
              px: {
                xs: 1.3,
                sm: 2,
              },
              py: 0.8,
              borderRadius: 2,

              background:
                "linear-gradient(135deg, #ef5350, #d32f2f)",

              boxShadow:
                "0 3px 8px rgba(211,47,47,0.30)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #e53935, #b71c1c)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
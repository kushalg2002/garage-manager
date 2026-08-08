import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <IconButton
      onClick={() => navigate(-1)}
      sx={{
        width: 42,
        height: 42,
        mb: 2,
        color: "#1565c0",
        backgroundColor: "#ffffff",
        border: "1px solid #dbe3ec",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",

        "&:hover": {
          backgroundColor: "#eaf2ff",
        },
      }}
    >
      <ArrowBack />
    </IconButton>
  );
}

export default BackButton;
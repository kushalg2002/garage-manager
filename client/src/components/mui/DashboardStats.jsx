import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

function DashboardStats({
  title,
  value,
  onClick,
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: "100%",
        minWidth: 0,
        borderRadius: 3,
        boxShadow: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        overflow: "hidden",

        "&:hover": onClick
          ? {
              transform: "translateY(-2px)",
              boxShadow: 5,
            }
          : {},
      }}
    >
      <CardContent
        sx={{
          textAlign: "center",
          py: {
            xs: 2,
            sm: 2.5,
          },
          px: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "14px",
              sm: "16px",
            },
            color: "#111827",
            fontWeight: 500,
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontWeight: 700,
            color: "#1976d2",
            fontSize: {
              xs: "32px",
              sm: "40px",
            },
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardStats;
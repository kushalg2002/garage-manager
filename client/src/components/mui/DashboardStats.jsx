import { Card, CardContent, Typography } from "@mui/material";

function DashboardStats({ title, value }) {
  return (
    <Card
      sx={{
        minWidth: 220,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography color="text.secondary">
          {title}
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardStats;

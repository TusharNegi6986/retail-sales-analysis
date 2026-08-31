const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db/db");
const kpiRoutes = require("./routes/kpiRoutes");
const revenueRoutes = require("./routes/revenueRoutes");
const categoryRoutes = require("./routes/categories");    
const deliveryRoutes = require("./routes/delivery");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/kpis", kpiRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/delivery", deliveryRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Retail Analytics API is running",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database() AS database, current_user AS user",
    );

    res.json({
      message: "PostgreSQL connection successful",
      database: result.rows[0].database,
      user: result.rows[0].user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

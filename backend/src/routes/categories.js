const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { state } = req.query;

    const query = `
      SELECT
          COALESCE(
              p.product_category_name,
              'Unknown'
          ) AS category,

          COUNT(*) AS units_sold,

          ROUND(
              SUM(oi.price)::numeric,
              2
          ) AS revenue,

          ROUND(
              AVG(oi.price)::numeric,
              2
          ) AS avg_selling_price

      FROM raw.order_items oi

      JOIN raw.products p
          ON oi.product_id = p.product_id

      JOIN raw.orders o
          ON oi.order_id = o.order_id

      JOIN raw.customers c
          ON o.customer_id = c.customer_id

      WHERE
          p.product_category_name IS NOT NULL
          AND ($1::text IS NULL OR c.customer_state = $1::text)

      GROUP BY p.product_category_name

      ORDER BY revenue DESC;
    `;

    const result = await pool.query(query, [
      state || null,
    ]);

    res.json(result.rows);

  } catch (error) {
    console.error("Category API error:", error);

    res.status(500).json({
      error: "Failed to fetch category data",
    });
  }
});

module.exports = router;
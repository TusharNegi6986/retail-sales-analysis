const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/monthly", async (req, res) => {
  try {
    const query = `
  SELECT
      TO_CHAR(
          DATE_TRUNC('month', o.order_purchase_timestamp),
          'YYYY-MM'
      ) AS month,

      ROUND(
          SUM(p.payment_value)::numeric,
          2
      ) AS revenue,

      COUNT(DISTINCT o.order_id) AS orders

  FROM raw.orders o

  JOIN raw.payments p
      ON o.order_id = p.order_id

  WHERE o.order_purchase_timestamp IS NOT NULL

  GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)

  ORDER BY DATE_TRUNC('month', o.order_purchase_timestamp);
`;

    const result = await pool.query(query);

    res.json(result.rows);

  } catch (error) {
    console.error("Monthly revenue query error:", error);

    res.status(500).json({
      message: "Failed to fetch monthly revenue"
    });
  }
});
router.get("/by-state", async (req, res) => {
  try {
    const query = `
      SELECT
          c.customer_state AS state,
          ROUND(
              SUM(p.payment_value)::numeric,
              2
          ) AS revenue,
          COUNT(DISTINCT o.order_id) AS orders

      FROM raw.customers c

      JOIN raw.orders o
          ON c.customer_id = o.customer_id

      JOIN raw.payments p
          ON o.order_id = p.order_id

      GROUP BY c.customer_state

      ORDER BY revenue DESC;
    `;

    const result = await pool.query(query);

    res.json(result.rows);

  } catch (error) {
    console.error("Revenue by state query error:", error);

    res.status(500).json({
      message: "Failed to fetch revenue by state"
    });
  }
});
router.get("/categories", async (req, res) => {
  try {
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

      GROUP BY
          p.product_category_name

      ORDER BY revenue DESC;
    `;

    const result = await pool.query(query);

    res.json(result.rows);

  } catch (error) {
    console.error("Category query error:", error);

    res.status(500).json({
      message: "Failed to fetch category data"
    });
  }
});
router.get("/delivery/trend", async (req, res) => {
  try {
    const query = `
      SELECT
          TO_CHAR(
              DATE_TRUNC('month', order_purchase_timestamp),
              'YYYY-MM'
          ) AS month,

          ROUND(
              AVG(
                  EXTRACT(
                      EPOCH FROM (
                          order_delivered_customer_date
                          - order_purchase_timestamp
                      )
                  ) / 86400.0
              )::numeric,
              2
          ) AS average_delivery_days,

          COUNT(*) AS orders

      FROM raw.orders

      WHERE order_purchase_timestamp IS NOT NULL
        AND order_delivered_customer_date IS NOT NULL

      GROUP BY
          DATE_TRUNC('month', order_purchase_timestamp)

      ORDER BY
          DATE_TRUNC('month', order_purchase_timestamp);
    `;

    const result = await pool.query(query);

    res.json(result.rows);

  } catch (error) {
    console.error("Delivery trend query error:", error);

    res.status(500).json({
      message: "Failed to fetch delivery trend"
    });
  }
});
module.exports = router;
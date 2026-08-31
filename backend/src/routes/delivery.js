const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/trend", async (req, res) => {
  try {
    const { state } = req.query;

    const query = `
      SELECT
          TO_CHAR(
              DATE_TRUNC(
                  'month',
                  o.order_delivered_customer_date
              ),
              'YYYY-MM'
          ) AS month,

          ROUND(
              AVG(
                  EXTRACT(
                      EPOCH FROM (
                          o.order_delivered_customer_date
                          - o.order_purchase_timestamp
                      )
                  ) / 86400.0
              )::numeric,
              2
          ) AS average_delivery_days

      FROM raw.orders o

      JOIN raw.customers c
          ON o.customer_id = c.customer_id

      WHERE
          o.order_purchase_timestamp IS NOT NULL
          AND o.order_delivered_customer_date IS NOT NULL
          AND o.order_delivered_customer_date >= o.order_purchase_timestamp
          AND ($1::text IS NULL OR c.customer_state = $1::text)
      GROUP BY DATE_TRUNC(
          'month',
          o.order_delivered_customer_date
      )

      ORDER BY DATE_TRUNC(
          'month',
          o.order_delivered_customer_date
      );
    `;

    const result = await pool.query(query, [
      state || null,
    ]);

    res.json(result.rows);

  } catch (error) {
    console.error("Delivery trend API error:", error);

    res.status(500).json({
      error: "Failed to fetch delivery trend",
    });
  }
});

router.get("/reliability", async (req, res) => {
  try {
    const { state } = req.query;

    const query = `
      WITH delivery_analysis AS (
        SELECT
          o.order_id,
          EXTRACT(
            EPOCH FROM (
              o.order_delivered_customer_date
              - o.order_estimated_delivery_date
            )
          ) / 86400.0 AS variance_days

        FROM raw.orders o

        JOIN raw.customers c
          ON o.customer_id = c.customer_id

        WHERE
          o.order_estimated_delivery_date IS NOT NULL
          AND o.order_delivered_customer_date IS NOT NULL
          AND o.order_delivered_customer_date >= o.order_purchase_timestamp
          AND ($1::text IS NULL OR c.customer_state = $1::text)
      )

      SELECT
        COUNT(*) AS delivered_orders,

        COUNT(*) FILTER (
          WHERE variance_days > 0
        ) AS late_orders,

        COUNT(*) FILTER (
          WHERE variance_days <= 0
        ) AS on_time_or_early_orders,

        ROUND(
          (
            100.0 *
            COUNT(*) FILTER (
              WHERE variance_days > 0
            )
            / NULLIF(COUNT(*), 0)
          )::numeric,
          2
        ) AS late_rate_percent

      FROM delivery_analysis;
    `;

    const result = await pool.query(query, [
      state || null,
    ]);

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Delivery reliability API error:", error);

    res.status(500).json({
      error: "Failed to fetch delivery reliability",
    });
  }
});

module.exports = router;
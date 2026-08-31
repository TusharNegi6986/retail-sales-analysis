const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = `
      WITH customer_orders AS (
          SELECT
              c.customer_unique_id,
              COUNT(DISTINCT o.order_id) AS order_count
          FROM raw.customers c
          JOIN raw.orders o
              ON c.customer_id = o.customer_id
          GROUP BY c.customer_unique_id
      ),

      customer_types AS (
          SELECT
              customer_unique_id,
              CASE
                  WHEN order_count = 1
                  THEN 'One-Time Customer'
                  ELSE 'Repeat Customer'
              END AS customer_type
          FROM customer_orders
      ),

      customer_revenue AS (
          SELECT
              c.customer_unique_id,
              SUM(p.payment_value) AS revenue
          FROM raw.customers c
          JOIN raw.orders o
              ON c.customer_id = o.customer_id
          JOIN raw.payments p
              ON o.order_id = p.order_id
          GROUP BY c.customer_unique_id
      ),

      customer_analysis AS (
          SELECT
              ct.customer_unique_id,
              ct.customer_type,
              COALESCE(cr.revenue, 0) AS revenue
          FROM customer_types ct
          LEFT JOIN customer_revenue cr
              ON ct.customer_unique_id = cr.customer_unique_id
      ),

      revenue AS (
          SELECT
              SUM(payment_value) AS total_revenue
          FROM raw.payments
      ),

      orders AS (
          SELECT
              COUNT(DISTINCT order_id) AS total_orders
          FROM raw.orders
      ),

      delivery AS (
          SELECT
              AVG(
                  order_delivered_customer_date
                  - order_purchase_timestamp
              ) AS avg_delivery_interval
          FROM raw.orders
          WHERE order_purchase_timestamp IS NOT NULL
            AND order_delivered_customer_date IS NOT NULL
      )

      SELECT
          r.total_revenue,

          o.total_orders,

          ROUND(
              r.total_revenue / NULLIF(o.total_orders, 0),
              2
          ) AS aov,

          ROUND(
              100.0 *
              SUM(
                  CASE
                      WHEN ca.customer_type = 'Repeat Customer'
                      THEN ca.revenue
                      ELSE 0
                  END
              )
              / NULLIF(r.total_revenue, 0),
              2
          ) AS repeat_revenue_share,

          ROUND(
              EXTRACT(
                  EPOCH FROM d.avg_delivery_interval
              ) / 86400.0,
              2
          ) AS average_delivery_days

      FROM revenue r
      CROSS JOIN orders o
      CROSS JOIN delivery d
      CROSS JOIN customer_analysis ca

      GROUP BY
          r.total_revenue,
          o.total_orders,
          d.avg_delivery_interval;
    `;

    const result = await pool.query(query);

    res.json(result.rows[0]);

  } catch (error) {
    console.error("KPI query error:", error);

    res.status(500).json({
      message: "Failed to fetch KPI data"
    });
  }
});

module.exports = router;
/*
=========================================
Retail Analytics Project
Business Analysis Queries
=========================================

Author: Tushar Negi
Database: PostgreSQL
Dataset: Olist Brazilian E-Commerce
*/


/* ============================================================
   RETAIL ANALYTICS - BUSINESS QUERIES
   Database: retail_analytics
   Schema: raw

   Purpose:
   Answer key business questions using the Olist retail dataset.
   ============================================================ */


/* ============================================================
   BUSINESS QUESTION 1
   Which states generate the most revenue?

   Tables:
   - customers → customer_state
   - orders → customer_id, order_id
   - payments → order_id, payment_value
   ============================================================ */

SELECT
    c.customer_state,
    SUM(p.payment_value) AS revenue
FROM raw.customers AS c
JOIN raw.orders AS o
    ON c.customer_id = o.customer_id
JOIN raw.payments AS p
    ON o.order_id = p.order_id
GROUP BY c.customer_state
ORDER BY revenue DESC;


/* ============================================================
   BUSINESS QUESTION 2
   Which states have the highest number of orders?

   Tables:
   - customers → customer_state
   - orders → order_id
   ============================================================ */

SELECT
    c.customer_state,
    COUNT(o.order_id) AS total_orders
FROM raw.customers AS c
JOIN raw.orders AS o
    ON c.customer_id = o.customer_id
GROUP BY c.customer_state
ORDER BY total_orders DESC;


/* ============================================================
   BUSINESS QUESTION 3
   What is the average order value (AOV) by state?

   Formula:
   AOV = Total Revenue / Total Orders
   ============================================================ */

SELECT
    c.customer_state,
    SUM(p.payment_value) AS total_revenue,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(p.payment_value) / COUNT(DISTINCT o.order_id) AS average_order_value
FROM raw.customers AS c
JOIN raw.orders AS o
    ON c.customer_id = o.customer_id
JOIN raw.payments AS p
    ON o.order_id = p.order_id
GROUP BY c.customer_state
ORDER BY average_order_value DESC;


/* ============================================================
   BUSINESS QUESTION 4
   Which product categories generate the most revenue?

   Tables:
   - products → product_id, product_category_name
   - order_items → product_id, order_id
   - payments → order_id, payment_value
   ============================================================ */

SELECT
    p.product_category_name,
    SUM(pay.payment_value) AS revenue
FROM raw.products AS p
JOIN raw.order_items AS oi
    ON p.product_id = oi.product_id
JOIN raw.payments AS pay
    ON oi.order_id = pay.order_id
GROUP BY p.product_category_name
ORDER BY revenue DESC;


/* ============================================================
   BUSINESS QUESTION 5
   Which product categories sell the most units?

   Each order_item represents one purchased item.
   ============================================================ */

SELECT
    p.product_category_name,
    COUNT(oi.order_item_id) AS total_units
FROM raw.products AS p
JOIN raw.order_items AS oi
    ON p.product_id = oi.product_id
GROUP BY p.product_category_name
ORDER BY total_units DESC;


/* ============================================================
   BUSINESS QUESTION 6
   What percentage of customers are repeat customers?

   A repeat customer is defined as a customer with
   more than one order.

   customer_unique_id is used because customer_id can represent
   different customer records for the same actual customer.
   ============================================================ */

WITH customer_orders AS (
    SELECT
        c.customer_unique_id,
        COUNT(o.order_id) AS order_count
    FROM raw.customers AS c
    JOIN raw.orders AS o
        ON c.customer_id = o.customer_id
    GROUP BY c.customer_unique_id
)

SELECT
    COUNT(*) AS total_customers,
    SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END) AS repeat_customers,
    ROUND(
        SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END) * 100.0
        / COUNT(*),
        2
    ) AS repeat_customer_rate
FROM customer_orders;


/* ============================================================
   BUSINESS QUESTION 7
   How much revenue comes from one-time vs repeat customers?

   One Time Customer:
   customer has exactly one order

   Repeated Customer:
   customer has more than one order
   ============================================================ */

WITH customer_orders AS (
    SELECT
        c.customer_unique_id,
        COUNT(o.order_id) AS order_count
    FROM raw.customers AS c
    JOIN raw.orders AS o
        ON c.customer_id = o.customer_id
    GROUP BY c.customer_unique_id
),

customer_revenue AS (
    SELECT
        c.customer_unique_id,
        SUM(p.payment_value) AS revenue
    FROM raw.customers AS c
    JOIN raw.orders AS o
        ON c.customer_id = o.customer_id
    JOIN raw.payments AS p
        ON o.order_id = p.order_id
    GROUP BY c.customer_unique_id
)

SELECT
    CASE
        WHEN co.order_count > 1 THEN 'Repeated Customer'
        ELSE 'One Time Customer'
    END AS customer_type,
    COUNT(*) AS customers,
    SUM(cr.revenue) AS total_revenue
FROM customer_orders AS co
JOIN customer_revenue AS cr
    ON co.customer_unique_id = cr.customer_unique_id
GROUP BY customer_type
ORDER BY total_revenue DESC;


/* ============================================================
   BUSINESS QUESTION 8
   What is the total revenue generated by the business?

   payment_value is used as the source of monetary transactions.
   ============================================================ */

SELECT
    SUM(payment_value) AS total_revenue
FROM raw.payments;


/* ============================================================
   BUSINESS QUESTION 9
   Which individual products generate the most revenue?

   Revenue is calculated from item price.

   Tables:
   - products → product_id
   - order_items → product_id, price
   ============================================================ */

SELECT
    p.product_id,
    SUM(oi.price) AS sales
FROM raw.products AS p
JOIN raw.order_items AS oi
    ON p.product_id = oi.product_id
GROUP BY p.product_id
ORDER BY sales DESC;


/* ============================================================
   BUSINESS QUESTION 10
   Which individual products sell the most units?

   Each order item represents one purchased unit.
   ============================================================ */

SELECT
    p.product_id,
    COUNT(oi.order_id) AS total_units
FROM raw.products AS p
JOIN raw.order_items AS oi
    ON p.product_id = oi.product_id
GROUP BY p.product_id
ORDER BY total_units DESC;


/* ============================================================
   BUSINESS QUESTION 11
   How does revenue change month by month?

   DATE_TRUNC('month') converts timestamps into monthly periods.
   ============================================================ */

SELECT
    DATE_TRUNC('month', o.order_purchase_timestamp) AS month,
    SUM(p.payment_value) AS revenue
FROM raw.orders AS o
JOIN raw.payments AS p
    ON o.order_id = p.order_id
GROUP BY month
ORDER BY month;


/* ============================================================
   BUSINESS QUESTION 12
   How many orders are placed each month?

   This measures monthly order volume.
   ============================================================ */

SELECT
    DATE_TRUNC('month', o.order_purchase_timestamp) AS month,
    COUNT(o.order_id) AS order_count
FROM raw.orders AS o
GROUP BY month
ORDER BY month;


/* ============================================================
   BUSINESS QUESTION 13
   How long does it take to deliver an order?

   Delivery time:
   delivered date - purchase date

   Result is converted from seconds to days.
   ============================================================ */

SELECT
    AVG(
        EXTRACT(
            EPOCH FROM (
                order_delivered_customer_date
                - order_purchase_timestamp
            )
        ) / 86400
    ) AS average_delivery_days
FROM raw.orders
WHERE order_delivered_customer_date IS NOT NULL;


/* ============================================================
   BUSINESS QUESTION 14
   How does average delivery time change month by month?
   ============================================================ */

SELECT
    DATE_TRUNC('month', order_purchase_timestamp) AS month,
    AVG(
        EXTRACT(
            EPOCH FROM (
                order_delivered_customer_date
                - order_purchase_timestamp
            )
        ) / 86400
    ) AS average_delivery_days
FROM raw.orders
WHERE order_delivered_customer_date IS NOT NULL
GROUP BY month
ORDER BY month;


/* ============================================================
   BUSINESS QUESTION 15
   Is delivery time associated with customer review scores?

   We compare:
   - review_score
   - number of orders
   - average delivery time

   IMPORTANT:
   This shows association, not causation.
   ============================================================ */

SELECT
    r.review_score,
    COUNT(DISTINCT r.order_id) AS total_orders,
    AVG(
        EXTRACT(
            EPOCH FROM (
                o.order_delivered_customer_date
                - o.order_purchase_timestamp
            )
        ) / 86400
    ) AS average_delivery_days
FROM raw.reviews AS r
JOIN raw.orders AS o
    ON r.order_id = o.order_id
WHERE o.order_delivered_customer_date IS NOT NULL
GROUP BY r.review_score
ORDER BY r.review_score;
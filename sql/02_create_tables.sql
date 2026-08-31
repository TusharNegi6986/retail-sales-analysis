-- ===========================================
-- Table: customers
-- ===========================================

CREATE TABLE raw.customers(
	customer_id Varchar(32) Primary key,
	customer_unique_id Varchar(32) NOT NULL,
	customer_zip_code_prefix INTEGER,
    customer_city VARCHAR(100),
    customer_state CHAR(2)
)
-- ===========================================
-- Table: products
-- ===========================================

CREATE TABLE raw.products(
    product_id Varchar(32) Primary key,
    product_category_name Varchar(100),
    product_name_lenght INTEGER,
    product_description_lenght INTEGER,
    product_photos_qty INTEGER,
    product_weight_g NUMERIC(10,2),
    product_length_cm NUMERIC(10,2),
    product_height_cm NUMERIC(10,2),
    product_width_cm NUMERIC(10,2)
)

-- ===========================================
-- Table: Sellers
-- ===========================================

CREATE TABLE raw.sellers (
    seller_id VARCHAR(32) NOT NULL,
    seller_zip_code_prefix INTEGER NOT NULL,
    seller_city VARCHAR(100) NOT NULL,
    seller_state CHAR(2) NOT NULL,

    CONSTRAINT pk_sellers
        PRIMARY KEY (seller_id)
);

-- ===========================================
-- Table: Payments  
-- ===========================================
CREATE TABLE raw.payments (

    order_id VARCHAR(32) NOT NULL,
    payment_sequential INTEGER NOT NULL,
    payment_type VARCHAR(15) NOT NULL,
    payment_installments INTEGER NOT NULL,
    payment_value NUMERIC(10,2) NOT NULL,

    CONSTRAINT pk_payments
        PRIMARY KEY (order_id, payment_sequential),
    CONSTRAINT fk_payments_orders
        FOREIGN KEY (order_id)
        REFERENCES raw.orders(order_id)
);

-- ===========================================
-- Table: reviews
-- ===========================================
CREATE TABLE raw.reviews (
    review_id VARCHAR(32) NOT NULL,
    order_id VARCHAR(32) NOT NULL,
    review_score INTEGER NOT NULL,
    review_comment_title TEXT,
    review_comment_message TEXT,
    review_creation_date TIMESTAMP NOT NULL,
    review_answer_timestamp TIMESTAMP NOT NULL,

    CONSTRAINT pk_reviews
        PRIMARY KEY(review_id),

    CONSTRAINT fk_reviews_orders
        FOREIGN KEY(order_id)
        REFERENCES raw.orders(order_id)

);

-- ===========================================
-- Table: orders
-- ===========================================

CREATE TABLE raw.orders (
    order_id VARCHAR(32),
    customer_id VARCHAR(32) NOT NULL,
    order_status VARCHAR(20),
    order_purchase_timestamp TIMESTAMP,
    order_approved_at TIMESTAMP,
    order_delivered_carrier_date TIMESTAMP,
    order_delivered_customer_date TIMESTAMP,
    order_estimated_delivery_date TIMESTAMP,
    CONSTRAINT pk_orders
        PRIMARY KEY(order_id),
    CONSTRAINT fk_orders_customer
        FOREIGN KEY(customer_id)
        REFERENCES raw.customers(customer_id)

);

-- ===========================================
-- Table: order_items
-- ===========================================

CREATE TABLE raw.order_items (
    order_id VARCHAR(32),
    order_item_id INTEGER,
    product_id VARCHAR(32) NOT NULL,
    seller_id VARCHAR(32) NOT NULL,
    shipping_limit_date TIMESTAMP,
    price NUMERIC(10,2),
    freight_value NUMERIC(10,2),
    CONSTRAINT pk_order_items
        PRIMARY KEY (order_id, order_item_id),
    CONSTRAINT fk_orderitems_orders
        FOREIGN KEY (order_id)
        REFERENCES raw.orders(order_id),
    CONSTRAINT fk_orderitems_products
        FOREIGN KEY (product_id)
        REFERENCES raw.products(product_id),
    CONSTRAINT fk_orderitems_sellers
        FOREIGN KEY (seller_id)
        REFERENCES raw.sellers(seller_id)
);

-- ===========================================
-- Table: product_category_translation
-- ===========================================

CREATE TABLE raw.product_category_translation (
    product_category_name TEXT NOT NULL,
    product_category_name_english TEXT NOT NULL,
    CONSTRAINT pk_translation
        PRIMARY KEY (product_category_name)
);                                
-- ===========================================
-- Table: geolocation
-- ===========================================

CREATE TABLE raw.geolocation (
    geolocation_zip_code_prefix INTEGER NOT NULL,
    geolocation_lat NUMERIC(10,6) NOT NULL,
    geolocation_lng NUMERIC(10,6) NOT NULL,
    geolocation_city VARCHAR(100) NOT NULL,
    geolocation_state char(2) NOT NULL
);


SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'raw'
ORDER BY table_name;










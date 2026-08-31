Data Audit

Customers
Rows:99441
Columns:5
Primary Key:customer_id
Missing Values:0
Duplicate Rows:0
Notes:
- No missing values.
- No duplicate rows.
- Customer IDs appear unique.


Orders
Rows:99441
Columns:8
Primary Key: order_id
Missing Values:
- order_approved_at: 160
- order_delivered_carrier_date: 1,783
- order_delivered_customer_date: 2,965
Duplicate Rows:0
Notes:
- Missing values are present in approval and delivery-related timestamp columns.
- No duplicate rows.

Order Items
Rows:112650
Columns:7
Primary Key:(order_id, order_item_id)
Missing Values:0
Duplicate Rows:0
Notes:
- No missing values.
- No duplicate rows.

Products
Rows:32951
Columns:9
Primary Key:product_id
Missing Values:
-product_id                      0
-product_category_name         610
-product_name_lenght           610
-product_description_lenght    610
-product_photos_qty            610
-product_weight_g                2
-product_length_cm               2
-product_height_cm               2
-product_width_cm                2

Duplicate Rows:0
Notes:
- product_id is unique
- all columns except product_id have null values
- No Duplicate values

Payments
Rows:103886
Columns:5
Primary Key:
No single-column primary key.
Potential composite key:
(order_id, payment_sequential)
Missing Values: 0
Duplicate Rows: 0
Notes:
- No missing values.
- No duplicate rows.

Reviews
Rows:99224
Columns:7
Primary Key: review_id                
Missing Values:
- review_comment_title       87656
- review_comment_message     58247
Duplicate Rows: 0
Notes:
- No Duplicate Values
- Only review_comment_title,review_comment_message contains null values

Sellers
Rows:3095
Columns:4
Primary Key:seller_id
Missing Values:0
Duplicate Rows:0
Notes:
- No missing values.
- No duplicate rows.

Geolocation
Rows:1000163
Columns:5
Primary Key:none
Missing Values:0
Duplicate Rows:261831
Notes:
- No missing values.
- 261831 duplicate values.
- geolocation_lat and geolocation_lng have negative numerical values

product_category_name_translation
Rows:71
Columns:2
Primary Key:product_category_name
Missing Values:0
Duplicate Rows:0
Notes:
- No missing values.
- No duplicate rows.

Overall Summary

• Most datasets have no duplicate rows.
• Missing values are mainly found in the Orders, Products, and Reviews tables.
• The Geolocation dataset contains a large number of duplicate records that will require further investigation.
• Some tables (Order Items and Payments) use composite keys rather than a single primary key.
• Overall, the datasets appear suitable for relational modeling and further analysis after cleaning.
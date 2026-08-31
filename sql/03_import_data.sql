/*
=========================================
03_import.sql
=========================================

Data Import Notes

- Database: PostgreSQL
- Tool: pgAdmin 4 Import/Export Wizard
- Format: CSV
- Header: Enabled
- Encoding: UTF-8
- Delimiter: ,

Import Order:

1. customers
2. sellers
3. products
4. product_category_name_translation
5. geolocation
6. orders
7. reviews
8. payments
9. order_items

Reason:
Parent tables were imported before child tables to satisfy foreign key constraints.

Notes:
- Initially, imports failed because the Header option was disabled.
- Importing order_items before orders caused a foreign key constraint error.
- These issues were resolved by enabling the CSV header option and following the correct import order.
*/
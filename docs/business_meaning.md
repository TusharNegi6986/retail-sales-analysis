___________________________________________________________BUSINESS MEANING__________________________________________________________________________

1) Customers Table
Column	                    Business Meaning
customer_id	                Unique identifier assigned to each customer record. Used to link customers with their orders.
customer_unique_id	        Identifier representing the actual customer. A single customer may have multiple customer_id values 
                            if they placed  orders using different accounts or addresses.
customer_zip_code_prefix	First five digits of the customer's ZIP code, used for geographic analysis.
customer_city	            City where the customer is located.
customer_state	            Two-letter abbreviation of the Brazilian state where the customer resides.





2) Orders Table

| Column                        | Business Meaning                           |
| ----------------------------- | ------------------------------------------ |
| order_id                      | Unique identifier for each order           |
| customer_id                   | Customer who placed the order              |
| order_status                  | Current order state                        |
| order_purchase_timestamp      | When the customer completed checkout       |
| order_approved_at             | When payment/order was approved            |
| order_delivered_carrier_date  | When the package was handed to the carrier |
| order_delivered_customer_date | When the customer received the package     |
| order_estimated_delivery_date | Promised delivery date                     |

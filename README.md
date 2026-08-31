# End-to-End Retail Analytics

A full-stack retail analytics application built using PostgreSQL, SQL,
Node.js, Express, React, and Tableau.

## Project Overview

This project transforms raw Brazilian e-commerce data into validated
business analytics and exposes those analytics through a REST API and
interactive React application.

The project demonstrates an end-to-end workflow:

Dataset → PostgreSQL → SQL Analytics → Express API → React

Tableau is also used as an independent BI artifact for executive-level
analytics and visualization.

## Business Questions

- How is overall revenue performing?
- Which states generate the most revenue?
- Which product categories contribute the most sales?
- How is delivery performance changing over time?
- What proportion of deliveries arrive late?
- How dependent is revenue on repeat customers?

## Key Metrics

| Metric | Value |
|---|---:|
| Total Revenue | R$ 16,008,872.12 |
| Total Orders | 99,441 |
| Average Order Value | R$ 160.99 |
| Repeat Revenue Share | 5.90% |
| Average Delivery Time | 12.56 days |
| Late Order Rate | 8.11% |

## Tech Stack

### Database
- PostgreSQL

### Analytics
- SQL
- Tableau Public

### Backend
- Node.js
- Express.js
- PostgreSQL `pg`

### Frontend
- React
- Vite
- Recharts
- React Router
- CSS

## Architecture

Dataset
↓
PostgreSQL
↓
SQL Analytics
↓
Express REST API
↓
React Application

Tableau connects independently to PostgreSQL as the BI visualization layer.

## Application Features

### Executive Dashboard
- Revenue
- Orders
- Average Order Value
- Repeat Revenue Share
- Average Delivery Time
- Monthly revenue and order trends
- Revenue by state

### Analytics
- State filtering
- Category revenue performance
- Delivery trend
- Delivery reliability
- Late-order analysis

## API Endpoints

GET /api/kpis

GET /api/revenue/monthly

GET /api/revenue/by-state

GET /api/categories

GET /api/delivery/trend

GET /api/delivery/reliability

State-filtered examples:

GET /api/categories?state=SP

GET /api/delivery/trend?state=SP

GET /api/delivery/reliability?state=SP

## Key Insights

- São Paulo is the largest revenue-generating state.
- Repeat customers contribute only 5.90% of total revenue.
- Average delivery time is 12.56 days.
- 8.11% of analyzed deliveries were later than the estimated delivery date.
- Revenue is distributed across a broad range of products rather than being dominated by a small number of products.

## Project Structure

[insert repository tree]

## Setup

### Backend

```bash
cd backend
npm install

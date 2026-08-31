const API_BASE_URL = "http://localhost:5000/api";

export async function fetchKPIs() {
  const response = await fetch(`${API_BASE_URL}/kpis`);

  if (!response.ok) {
    throw new Error("Failed to fetch KPI data");
  }

  return response.json();
}

export async function fetchMonthlyPerformance() {
  const response = await fetch(`${API_BASE_URL}/revenue/monthly`);

  if (!response.ok) {
    throw new Error("Failed to fetch monthly performance");
  }

  return response.json();
}

export async function fetchRevenueByState() {
  const response = await fetch(`${API_BASE_URL}/revenue/by-state`);

  if (!response.ok) {
    throw new Error("Failed to fetch revenue by state");
  }

  return response.json();
}

export async function fetchCategories(state = "") {
  const url = state
    ? `${API_BASE_URL}/categories?state=${encodeURIComponent(state)}`
    : `${API_BASE_URL}/categories`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch category data");
  }

  return response.json();
}

export async function fetchDeliveryTrend(state = "") {
  const url = state
    ? `${API_BASE_URL}/delivery/trend?state=${encodeURIComponent(state)}`
    : `${API_BASE_URL}/delivery/trend`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch delivery trend");
  }

  return response.json();
}

export async function fetchDeliveryReliability(state = "") {
  const url = state
    ? `${API_BASE_URL}/delivery/reliability?state=${encodeURIComponent(state)}`
    : `${API_BASE_URL}/delivery/reliability`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch delivery reliability");
  }

  return response.json();
}

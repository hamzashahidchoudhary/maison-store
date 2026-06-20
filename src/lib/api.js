// src/lib/api.js
// Reads API URL from environment variable
// Locally: uses http://localhost:4000/api
// In production (Vercel): uses your Railway backend URL

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const getToken = () => localStorage.getItem('maison_token')

const request = async (endpoint, options = {}) => {
  const token = getToken()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.')
  }

  return data
}

// ─── Auth ─────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  login: (body) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  me: () => request('/auth/me'),
}

// ─── Products ─────────────────────────────────────────
export const productsAPI = {
  getAll: (category) => request(`/products${category && category !== 'all' ? `?category=${category}` : ''}`),
  getOne: (id) => request(`/products/${id}`),
}

// ─── Orders ───────────────────────────────────────────
export const ordersAPI = {
  create: (body) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  getAll: () => request('/orders'),
  getOne: (id) => request(`/orders/${id}`),
}

// ─── Reviews ──────────────────────────────────────────
export const reviewsAPI = {
  getAll: (productId) => request(`/products/${productId}/reviews`),
  create: (productId, body) => request(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  delete: (productId, reviewId) => request(`/products/${productId}/reviews/${reviewId}`, {
    method: 'DELETE',
  }),
}

// ─── Payments ─────────────────────────────────────────
export const paymentsAPI = {
  createIntent: (amount) => request('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  }),
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("leftoverlink_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Listings
  getListings: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/listings?${query}`, {
      method: "GET",
      headers: getHeaders(), // Optional, but good if you want to see protected fields
    });
    return handleResponse(response);
  },

  createListing: async (listingData) => {
    const response = await fetch(`${API_URL}/listings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(listingData),
    });
    return handleResponse(response);
  },

  // Location
  updateUserLocation: async (coordinates, address) => {
    const response = await fetch(`${API_URL}/location`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ coordinates, address }),
    });
    return handleResponse(response);
  },

  claimListing: async (id, message) => {
    const response = await fetch(`${API_URL}/listings/${id}/claim`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message }),
    });
    return handleResponse(response);
  },
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // Create an error object
    const error = new Error(data.message || "API Error");
    // Attach the validation errors array from the backend to the error object
    error.errors = data.errors;
    throw error;
  }
  return data;
};

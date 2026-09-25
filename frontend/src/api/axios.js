import axios from 'axios';

// Base URL comes from the .env file (see .env.example). Falls back to
// localhost:5000 for local development if it isn't set.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL });

export default api;

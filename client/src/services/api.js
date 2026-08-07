import axios from "axios";

const api = axios.create({
  baseURL: "https://garage-manager-api.onrender.com/api",
});

export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "https://garage-manager-kmr5.onrender.com/api",
});

export default api;
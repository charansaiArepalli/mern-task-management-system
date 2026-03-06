import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-task-management-system-lzuo.onrender.com/api"
});

export default API;
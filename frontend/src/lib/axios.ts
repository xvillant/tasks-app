import { useUserStore } from "@/store/userStore";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

axiosClient.interceptors.request.use((config) => {
  const user = useUserStore.getState().user;
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default axiosClient;

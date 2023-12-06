import axios from "axios";
import Cookies from "js-cookie";

const baseURL =
  import.meta.env.MODE === "production"
    ? "https://chatman-api.fly.dev"
    : "http://127.0.0.1:3000";
export const ENDPOINTS = {
  signup: "/api/user/signup",
  login: "/api/user/login",
  userData: "/api/user/me",
  sessionStatus: "/api/user/session-status",
  searchUsers: "/api/user/search",
  conversation: "/api/conversation",
  messages: "/api/message",
  clearMessages: "/api/message/clear",
  uploadImage: "/api/upload/img",
};
export const CHATMAN_API = axios.create({
  baseURL,
});
export const CHATMAN_PRIVATE_API = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
});

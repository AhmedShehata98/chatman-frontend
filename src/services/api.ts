import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "http://127.0.0.1:3000";
export const ENDPOINTS = {
  signup: "/api/user/signup",
  login: "/api/user/login",
  userData: "/api/user/me",
  sessionStatus: "/api/user/session-status",
  searchUsers: "/api/user/search",
  conversation: "/api/conversation",
  messages: "/api/message",
  uploadImage: "/api/upload/img",
};
export const CHATMAN_API = axios.create({
  baseURL: undefined,
});
export const CHATMAN_PRIVATE_API = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
});

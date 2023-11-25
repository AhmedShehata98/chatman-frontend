import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "http://127.0.0.1:7000";
export const ENDPOINTS = {
  signup: "/api/user/signup",
  login: "/api/user/login",
  userData: "/api/user/info",
  searchUsers: "/api/user/search",
  chatRooms: "/api/chat/rooms",
  messages: "/api/messages",
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

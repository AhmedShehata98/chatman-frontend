import { io } from "socket.io-client";
const baseURL =
  import.meta.env.MODE === "production"
    ? "https://chatman-api.fly.dev"
    : "http://127.0.0.1:3000";
console.log(import.meta.env.MODE);
export const chatManWebSocket = io(baseURL);

import { io } from "socket.io-client";

export const chatManWebSocket = io("http://localhost:7000");

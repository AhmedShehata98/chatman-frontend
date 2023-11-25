import { createBrowserRouter } from "react-router-dom";
import { ROUTES_LIST } from "./routes-list";
import RegisterPage from "../pages/RegisterPage";
import AppRoot from "../pages/AppRoot";
import ChatPage from "../pages/ChatPage";
import CallPage from "../pages/CallPage";
// import { getAllRooms } from "../services/chat.api";
// import Cookies from "js-cookie";

export const router = createBrowserRouter([
  {
    path: ROUTES_LIST.register,
    element: <RegisterPage />,
  },
  {
    path: ROUTES_LIST.app,
    element: <AppRoot />,
    children: [
      {
        index: true,
        element: <ChatPage />,
        // loader: Cookies.get("token") ? getAllRooms : undefined,
      },
      {
        path: ROUTES_LIST.call,
        element: <CallPage />,
      },
    ],
  },
]);

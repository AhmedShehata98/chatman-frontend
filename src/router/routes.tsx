import { createBrowserRouter } from "react-router-dom";
import { ROUTES_LIST } from "./routes-list";
import RegisterPage from "../pages/RegisterPage";
import AppRoot from "../pages/AppRoot";
import ChatPage from "../pages/ChatPage";
import CallPage from "../pages/CallPage";
import ChatRoom from "../pages/ChatRoom";
import { userConversations } from "../services/conversation.api";
// import { getAllRooms } from "../services/chat.api";
import Cookies from "js-cookie";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Personalization from "../pages/Personalization";
import { getUserData } from "../services/auth.api";

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
        path: ROUTES_LIST.chatRoom,
        element: <ChatPage />,
        loader: () => userConversations(Cookies.get("token")),
        errorElement: <RegisterPage />,
        children: [
          {
            path: `${ROUTES_LIST.chatRoom}/:roomId`,
            element: <ChatRoom />,
          },
        ],
      },
      {
        path: ROUTES_LIST.call,
        element: <CallPage />,
      },
      {
        path: ROUTES_LIST.settings,
        element: <Settings />,
        loader: () => getUserData(Cookies.get("token") as string),
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: ROUTES_LIST.personalization,
            element: <Personalization />,
          },
        ],
      },
    ],
  },
]);

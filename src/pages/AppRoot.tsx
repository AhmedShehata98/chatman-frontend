import { useRecoilState } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import MainLayout from "../layout/MainLayout";
import { useMutation } from "@tanstack/react-query";
import { changeSessionStatus, getUserData } from "../services/auth.api";
import Cookies from "js-cookie";
import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";
import AppLoadingIndicator from "../components/AppLoadingIndicator";

const AppRoot = () => {
  const [_, setAuthState] = useRecoilState(authStateAtom);
  const { state } = useNavigation();
  const navigator = useNavigate();
  const location = useLocation();
  const { mutate } = useMutation({
    mutationKey: ["user-data"],
    mutationFn: (token: string) => getUserData(token),
    // retry: 5,
  });
  const { mutate: mutateSessionStatus } = useMutation({
    mutationKey: ["session-status"],
    mutationFn: (statusStatus: {
      lastSeenDate: number;
      status: UserStatusType;
    }) => changeSessionStatus({ ...statusStatus }),
    // retry: 5,
  });

  const handleAuthWebSocket = (token: string) => {
    chatManWebSocket.emit(wsEventsKeys.auth, { token });
  };
  const handleSetUserData = (token: string) => {
    const isLoggedIn = Cookies.get("isLoggedIn") === "true" ? true : false;

    mutate(token, {
      onSuccess: (user) => {
        setAuthState({ token, isLoggedIn, user: user });
        handleAuthWebSocket(token);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  useEffect(() => {
    const isLoggedIn = Cookies.get("isLoggedIn") === "true" ? true : false;
    const token = Cookies.get("token");

    if (!isLoggedIn || token === null) {
      navigator(ROUTES_LIST.register);
    } else {
      if (location.pathname.endsWith("/"))
        return navigator(ROUTES_LIST.chatRoom);
    }
    if (isLoggedIn && token) {
      handleSetUserData(token);
      return () => {
        chatManWebSocket.off(wsEventsKeys.auth);
      };
    }
  }, [Cookies.get("isLoggedIn"), Cookies.get("token")]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token)
      mutateSessionStatus(
        { lastSeenDate: Date.now(), status: "ONLINE" },
        {
          onSuccess: (data) => {
            console.log(data);
          },
        },
      );
    return () => {
      if (token)
        mutateSessionStatus(
          { lastSeenDate: Date.now(), status: "OFFLINE" },
          {
            onSuccess: (data) => {
              console.log(data);
            },
          },
        );
      console.log("clean up session");
    };
  }, [Cookies.get("token")]);

  if (state === "loading") {
    return <AppLoadingIndicator />;
  }
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AppRoot;

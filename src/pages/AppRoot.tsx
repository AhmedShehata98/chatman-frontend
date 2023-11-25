import { useRecoilState } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import MainLayout from "../layout/MainLayout";
import { useMutation } from "@tanstack/react-query";
import { getUserData } from "../services/auth.api";
import Cookies from "js-cookie";
import { chatManWebSocket } from "../services/ws";

const AppRoot = () => {
  const [_, setAuthState] = useRecoilState(authStateAtom);
  const navigator = useNavigate();
  const { mutate } = useMutation({
    mutationKey: ["user-data"],
    mutationFn: (token: string) => getUserData(token),
    retry: 5,
  });

  useEffect(() => {
    const isLoggedIn = Cookies.get("isLoggedIn") === "true" ? true : false;
    const token = Cookies.get("token");

    if (!isLoggedIn || token === null) return navigator(ROUTES_LIST.register);
    if (isLoggedIn && token) {
      mutate(token, {
        onSuccess: (user) => {
          setAuthState({ token, isLoggedIn, user: user.data });
          chatManWebSocket.emit("authentication", { token });
        },
        onError: (err) => {
          console.log(err);
        },
      });
      return () => {
        chatManWebSocket.off("authentication");
      };
    }
  }, [Cookies.get("isLoggedIn"), Cookies.get("token")]);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AppRoot;

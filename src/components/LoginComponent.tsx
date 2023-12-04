import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import { useMutation } from "@tanstack/react-query";
import { getUserData, login } from "../services/auth.api";
import { useSetRecoilState } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import LoadingIndicator from "./LoadingIndicator";

function LoginComponent() {
  const setLoginState = useSetRecoilState(authStateAtom);
  const navigate = useNavigate();
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["login"],
    mutationFn: (loginParams: Login) => login(loginParams),
  });

  const { mutate: mutateGetUserInfo } = useMutation({
    mutationKey: ["user-data"],
    mutationFn: (token: string) => getUserData(token),
  });

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const fd = new FormData(ev.currentTarget);
    try {
      const loginData = await mutateAsync({
        password: fd.get("password") as string,
        email: fd.get("email") as string,
      });
      if (loginData) {
        mutateGetUserInfo(loginData.token, {
          onSuccess: function (data) {
            setLoginState({
              isLoggedIn: true,
              token: loginData.token,
              user: data,
            });
            if (!data) {
              throw new Error(`received data :${data}`);
            }
            navigate(ROUTES_LIST.chatRoom);
          },
          onError: function (err) {
            console.log(err);
          },
        });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      action=""
      className="flex w-full flex-col rounded-md bg-white px-16 py-4 shadow-lg max-md:px-10 max-md:py-6"
    >
      <h3 className="mb-6 mt-12 text-lg font-semibold capitalize text-zinc-600">
        please fill login information
      </h3>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="email address..."
        className="focus:border-secondary-200 mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:outline-none"
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="**************"
        className="focus:border-secondary-200 mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        title="click to login"
        className="bg-secondary-200 mb-6 mt-5 flex items-center justify-center gap-4 rounded-md px-4 py-5 text-xl font-semibold capitalize text-white shadow hover:brightness-125"
      >
        {isPending ? (
          <>
            <span className="inline-block h-8 w-8">
              <LoadingIndicator dir="row" />
            </span>
            <small>sending ...</small>
          </>
        ) : (
          "login"
        )}
      </button>
      <Link
        to={`${ROUTES_LIST.register}?sec=signup`}
        className="text-secondary-200 text-center capitalize underline"
      >
        You don't have an account yet ?.. create one
      </Link>
    </form>
  );
}

export default LoginComponent;

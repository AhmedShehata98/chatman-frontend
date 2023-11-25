import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import { useMutation } from "@tanstack/react-query";
import { createAccount, getUserData } from "../services/auth.api";
import { useSetRecoilState } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import LoadingIndicator from "./LoadingIndicator";

function SignUpComponent() {
  const setLoginState = useSetRecoilState(authStateAtom);
  const navigate = useNavigate();
  const { isPending, mutateAsync: mutateSignup } = useMutation({
    mutationKey: ["signup"],
    mutationFn: (signupParams: Signup) => createAccount(signupParams),
  });
  const { mutateAsync: mutateGetUserInfo } = useMutation({
    mutationKey: ["user-data"],
    mutationFn: (token: string) => getUserData(token),
  });

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    try {
      const signupData = await mutateSignup({
        email: fd.get("email") as string,
        fullName: fd.get("fullName") as string,
        password: fd.get("password") as string,
        phone: fd.get("phone") as string,
        username: `@${fd.get("username")}`,
      });

      if (signupData) {
        const user = await mutateGetUserInfo(signupData.token);
        setLoginState({
          isLoggedIn: true,
          token: signupData.token,
          user: user.data,
        });
        navigate(ROUTES_LIST.app);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      action=""
      className="flex w-full flex-col rounded-md bg-white px-16 py-4 shadow-lg"
    >
      <h3 className="mb-6 mt-12 text-lg font-semibold capitalize text-zinc-600">
        please fill login information
      </h3>
      <input
        type="text"
        name="fullName"
        id="fullName"
        placeholder="full name..."
        className="mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:border-[#00A884] focus:outline-none"
      />
      <input
        type="text"
        name="username"
        id="username"
        placeholder="username..."
        className="mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:border-[#00A884] focus:outline-none"
      />
      <input
        type="email"
        name="email"
        id="email"
        placeholder="email address..."
        className="mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:border-[#00A884] focus:outline-none"
      />
      <input
        type="tel"
        name="phone"
        id="phone"
        placeholder="phone number..."
        className="mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:border-[#00A884] focus:outline-none"
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="**************"
        className="mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:border-[#00A884] focus:outline-none"
      />
      <button
        type="submit"
        title="click to login"
        disabled={isPending}
        className="mb-6 mt-5 flex flex-row items-center justify-center gap-4 rounded-md bg-[#017561] px-4 py-5 text-xl font-semibold capitalize text-white shadow hover:brightness-125 disabled:bg-[#00332b]"
      >
        {isPending ? (
          <>
            <span className="inline-block h-8 w-8">
              <LoadingIndicator dir="row" />
            </span>
            <small>sending ...</small>
          </>
        ) : (
          "create account"
        )}
      </button>
      <Link
        to={`${ROUTES_LIST.register}?sec=login`}
        className="text-center capitalize text-[#017561] underline"
      >
        have already account ? login
      </Link>
    </form>
  );
}

export default SignUpComponent;

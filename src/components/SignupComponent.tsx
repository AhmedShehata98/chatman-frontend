import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import { useMutation } from "@tanstack/react-query";
import { createAccount, getUserData } from "../services/auth.api";
import { useSetRecoilState } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import LoadingIndicator from "./LoadingIndicator";
import { uploadImage } from "../services/upload.api";
import clsx from "clsx";

function SignUpComponent() {
  const setLoginState = useSetRecoilState(authStateAtom);
  const navigate = useNavigate();
  const [profileImgPreview, setProfileImgPreview] = useState<null | string>(
    null,
  );
  const { isPending, mutateAsync: mutateSignup } = useMutation({
    mutationKey: ["signup"],
    mutationFn: (signupParams: Signup) => createAccount(signupParams),
  });
  const { mutateAsync: mutateGetUserInfo } = useMutation({
    mutationKey: ["user-data"],
    mutationFn: (token: string) => getUserData(token),
  });
  const { isPending: isPendingUploadImg, mutate: uploadProfileImage } =
    useMutation({
      mutationKey: ["upload-user-profile-img"],
      mutationFn: (file: FormData) => uploadImage(file),
    });

  const handleUploadImage = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    const fd = new FormData();
    if (!files) return;
    if (files?.length < 1) return;
    fd.set("file", files[0]);

    uploadProfileImage(fd, {
      onSuccess: (data) => {
        setProfileImgPreview(data.secure_url);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    try {
      const signupData = await mutateSignup({
        email: fd.get("email") as string,
        fullName: fd.get("fullName") as string,
        password: fd.get("password") as string,
        profilePictureUrl: profileImgPreview as string,
      });

      if (signupData) {
        const user = await mutateGetUserInfo(signupData.token);
        setLoginState({
          isLoggedIn: true,
          token: signupData.token,
          user: user,
        });
        navigate(ROUTES_LIST.chatRoom);
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
      <h3 className="mb-6 mt-6 text-lg font-semibold capitalize text-zinc-500">
        fill your information and create your account
      </h3>
      <span className="my-4 flex h-32 w-32 items-center justify-center self-center overflow-hidden rounded-full bg-zinc-200">
        <input
          hidden
          type="file"
          onChange={handleUploadImage}
          name="profileImageUrl"
          id="profileImage"
        />
        <img
          src={profileImgPreview!}
          alt="profile"
          className={`${clsx(
            profileImgPreview ? "flex" : "hidden",
          )} aspect-square max-w-full items-center justify-center rounded-full border-4 border-zinc-700 object-cover object-center`}
        />
        <label
          htmlFor="profileImage"
          className={`${clsx(
            profileImgPreview ? "hidden" : "flex",
          )} cursor-pointer items-center justify-center text-4xl text-secondary-200 hover:brightness-150`}
        >
          <span
            className={`${clsx(
              isPendingUploadImg
                ? "pointer-events-none inline-block"
                : "hidden",
            )} animate-spin`}
          >
            <i className="fi fi-rr-spinner"></i>
          </span>
          <span
            className={`${clsx(
              isPendingUploadImg ? "hidden" : false,
            )}inline-block h-full w-full`}
          >
            <i className="fi fi-rr-user-add"></i>
          </span>
        </label>
      </span>
      <input
        type="text"
        name="fullName"
        id="fullName"
        placeholder="full name..."
        className="mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:border-secondary-200 focus:outline-none"
      />
      <input
        type="email"
        name="email"
        id="email"
        placeholder="email address..."
        className="mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:border-secondary-200 focus:outline-none"
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="**************"
        className="mb-5 w-full rounded-md border-2 bg-[#f9f9fa] px-6 py-4 shadow-sm focus:border-secondary-200 focus:outline-none"
      />
      <button
        type="submit"
        title="click to login"
        disabled={isPending}
        className="mb-6 mt-5 flex flex-row items-center justify-center gap-4 rounded-md bg-secondary-200 px-4 py-5 text-xl font-semibold capitalize text-white shadow hover:brightness-125 disabled:bg-[#00332b]"
      >
        {isPending ? (
          <>
            <span className="inline-block h-8 w-8">
              <LoadingIndicator dir="row" isShown className="h-8 w-8" />
            </span>
            <small>sending ...</small>
          </>
        ) : (
          "create account"
        )}
      </button>
      <Link
        to={`${ROUTES_LIST.register}?sec=login`}
        className="text-center capitalize text-secondary-200 underline"
      >
        have already account ? login
      </Link>
    </form>
  );
}

export default SignUpComponent;

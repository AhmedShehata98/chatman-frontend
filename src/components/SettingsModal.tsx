import React from "react";
import useClickOutside from "../hooks/useClickOutside";
import Avatar from "./Avatar";
import { useRecoilState } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../services/upload.api";
import clsx from "clsx";

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};
function SettingsModal({ setShowModal }: Props) {
  const { modalRef } = useClickOutside({ setShowModal });
  const [{ user }, setAuth] = useRecoilState(authStateAtom);
  const [src, setSrc] = React.useState(user?.profilePictureUrl || null);
  const [isPreview, setIsPreview] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File>();

  const { mutate: startUpload, isPending: isUploading } = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: (file: FormData) => uploadImage(file),
  });

  const handleGetImage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (files && files?.length >= 1) {
      setIsPreview(true);
      setImageFile(files[0]);
      setSrc(URL.createObjectURL(files[0]));
    }
  };

  const handleUpload = () => {
    const fd = new FormData();
    fd.set("file", imageFile!);
    startUpload(fd, {
      onSuccess: (data) => {
        setSrc(data.secure_url);
        setAuth((currVal) => {
          let newUser = { ...currVal.user };
          newUser.profilePictureUrl = data.secure_url;

          return { ...currVal, newUser };
        });
        setIsPreview(false);
      },
    });
  };
  return (
    <div ref={modalRef} className="flex h-full w-full flex-col">
      <span className="relative flex w-full items-center justify-center rounded-md bg-primary-300 px-3 py-10">
        <Avatar
          fullName={user?.fullName || "n a"}
          status={user?.status}
          showStatus
          src={src}
          className={`h-36 w-36 border-4 ${clsx({
            "animate-pulse grayscale": isUploading,
          })}`}
        />
        <input
          type="file"
          onChange={handleGetImage}
          hidden
          name="profile-img"
          id="profile-img"
        />
        {isPreview && (
          <button
            type="button"
            onClick={handleUpload}
            className="absolute right-4 top-4 cursor-pointer rounded-full bg-sky-600 p-4 text-2xl leading-3 text-white shadow-lg hover:brightness-125"
          >
            <i className="fi fi-rr-check"></i>
          </button>
        )}
        {!isPreview && (
          <label
            htmlFor="profile-img"
            className="absolute right-4 top-4 cursor-pointer rounded-full bg-secondary-200 p-4 text-2xl leading-3 text-white shadow-lg hover:brightness-125"
          >
            <i className="fi fi-rr-edit"></i>
          </label>
        )}
      </span>
    </div>
  );
}

export default SettingsModal;

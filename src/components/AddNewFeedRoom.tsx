import {
  FormEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import LandscapeModal from "./LandscapeModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "../services/upload.api";
import clsx from "clsx";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { addFeed } from "../services/feeds.api";
import useClickOutside from "../hooks/useClickOutside";

function AddNewFeedRoom({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { modalRef } = useClickOutside({ setShowModal });
  const { user: me } = useRecoilValue(authStateAtom);
  const [feedPicture, setFeedPicture] = useState("");
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    mutateAsync: uploadImageAsync,
    isPending: isUploading,
    isSuccess: isUploaded,
  } = useMutation({
    mutationKey: ["upload-img"],
    mutationFn: (file: FormData) => uploadImage(file),
  });
  const {
    mutate: addNewFeed,
    isPending: addingNewFeed,
    // isSuccess: addedNewFeed,
  } = useMutation({
    mutationKey: ["add-feed"],
    mutationFn: (feed: CreateFeed) => addFeed(feed),
  });

  const handleGetImage = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (!files || files.length <= 0) return;

    setImageFile(files[0]);
    setFeedPicture(URL.createObjectURL(files[0]));
  };

  const handleUploadImage = () => {
    const fd = new FormData();
    fd.set("file", imageFile!);
    uploadImageAsync(fd, {
      onSuccess: (data) => {
        setFeedPicture(data.secure_url);
      },
    });
  };

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const feedName = fd.get("feedName");
    const feedDescription = fd.get("feedDescription");
    const isPrivateFeed = fd.get("isPrivate") === "on" ? true : false;

    if (!me) return;
    if (!feedName) return;
    if (isPrivateFeed === null || isPrivateFeed === undefined) return;
    const data = {
      feedName: feedName?.toString(),
      description: feedDescription?.toString(),
      isPrivate: isPrivateFeed,
      feedCover: feedPicture === "" ? undefined : feedPicture?.toString(),
      owner: me?._id.toString(),
    };

    addNewFeed(data, {
      onSuccess: () => {
        setShowModal(false);
        queryClient.invalidateQueries({ queryKey: ["feeds"] });
      },
    });
  };
  return (
    <LandscapeModal ref={modalRef}>
      <span className="flex w-full items-center justify-start gap-4">
        <button
          type="button"
          className="rounded bg-red-600 px-4 py-2 text-xl leading-3 text-white"
          onClick={() => setShowModal(false)}
        >
          <i className="fi fi-sr-arrow-left"></i>
        </button>
        <p className="text-center text-lg font-medium capitalize text-white">
          add new feed-room
        </p>
      </span>
      <span className="relative my-5 flex w-full items-center justify-center rounded-md bg-primary-100">
        {feedPicture !== "" && !isUploaded && (
          <span className="absolute left-4 top-4 z-[5] flex items-center justify-center gap-2">
            <button
              type="button"
              className="rounded-md bg-red-500 px-3 py-3 text-xl leading-3 shadow-lg hover:brightness-125"
              onClick={() => setFeedPicture("")}
            >
              <i className="fi fi-rr-trash-xmark"></i>
            </button>
            <button
              type="button"
              className="rounded-md bg-sky-500 px-3 py-3 text-xl leading-3 shadow-lg hover:brightness-125"
              onClick={handleUploadImage}
            >
              <i className="fi fi-sr-check"></i>
            </button>
          </span>
        )}
        {feedPicture !== "" && isUploading && (
          <div className="absolute left-1/2 top-1/2 z-[5] flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-secondary-100 border-l-transparent"></span>
          </div>
        )}
        {feedPicture === "" && (
          <>
            <label
              htmlFor="feed-room-picture"
              className="my-10 flex h-36 w-36 cursor-pointer items-center justify-center rounded-full bg-secondary-100 text-5xl shadow-lg hover:brightness-125"
            >
              <i className="fi fi-rr-graphic-style"></i>
            </label>
            <input
              type="file"
              hidden
              name="feedCover"
              id="feed-room-picture"
              onChange={handleGetImage}
            />
          </>
        )}
        {feedPicture !== "" && (
          <img
            src={feedPicture}
            className={`${clsx({
              "brightness-50": isUploading,
            })} h-56 w-full rounded-md object-cover object-center shadow-xl`}
            alt="feedPicture"
          />
        )}
      </span>
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-col gap-3"
      >
        <span className="mt-3 flex items-center justify-start gap-3">
          <label htmlFor="isPrivate" className="capitalize text-white">
            make it private feed ?
          </label>
          <input
            type="checkbox"
            name="isPrivate"
            id="isPrivate"
            className=" accent-secondary-100"
          />
        </span>
        <input
          type="text"
          name="feedName"
          id="feedName"
          placeholder="type feed name ..."
          className="w-full border border-transparent bg-primary-100 px-3 py-4 text-white focus:border-secondary-200 focus:bg-primary-300 focus:outline-none"
          required
        />
        <textarea
          name="feedDescription"
          id="feedDescription"
          className="w-full border border-transparent bg-primary-100 px-3 py-4 text-white focus:border-secondary-200 focus:bg-primary-300 focus:outline-none"
          placeholder="type feed bio .."
          required
        />
        <button
          type="submit"
          className="mt-auto flex w-full items-center justify-center gap-4 rounded-md bg-secondary-100 px-5 py-3 hover:brightness-125 disabled:bg-secondary-200 disabled:text-slate-300"
          disabled={addingNewFeed}
        >
          {addingNewFeed && (
            <>
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-400 border-t-transparent"></span>
              <p className="text-lg font-medium capitalize">adding feed ..</p>
            </>
          )}
          {!addingNewFeed && (
            <>
              <span className="text-2xl leading-3">
                <i className="fi fi-rr-square-plus"></i>
              </span>
              <p className="text-lg font-medium capitalize">create a feed</p>
            </>
          )}
        </button>
      </form>
    </LandscapeModal>
  );
}

export default AddNewFeedRoom;

import Avatar from "./Avatar";
import { formatDate } from "../utils/utils";
import { MouseEventHandler, useState } from "react";
import clsx from "clsx";
import useClickOutside from "../hooks/useClickOutside";

type Props = {
  feedName: string;
  feedCover: string;
  createdAt: string;
  followersLength: number;
  handleOpen: MouseEventHandler;
  isActive: boolean;
};
function FeedCard({
  isActive,
  createdAt,
  feedCover,
  feedName,
  handleOpen,
}: Props) {
  const [isShowOptionsMenu, setIsShowOptionsMenu] = useState(false);
  const { modalRef } = useClickOutside({ setShowModal: setIsShowOptionsMenu });
  return (
    <li
      className={`${clsx({
        "bg-secondary-200 bg-opacity-40 hover:bg-secondary-200 hover:bg-opacity-40":
          isActive,
      })} flex w-full flex-col items-center justify-start gap-3 px-4 py-3 hover:bg-primary-300`}
    >
      <div className="flex w-full items-center justify-center gap-3">
        <Avatar
          fullName={feedName}
          showStatus={false}
          src={feedCover || null}
          className={`h-14 w-14 cursor-pointer ${clsx({
            "pointer-events-none": isActive,
          })}`}
          onClick={handleOpen}
        />
        <div className="flex flex-grow flex-col gap-2">
          <p
            className={`inline-block max-w-full cursor-pointer overflow-hidden truncate font-medium text-white ${clsx(
              { "pointer-events-none": isActive },
            )}`}
            onClick={handleOpen}
          >
            {feedName}
          </p>
          <code className="text-slate-400">{formatDate(createdAt)}</code>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 bg-opacity-20 text-xl leading-3 text-secondary-100 hover:brightness-125"
          onClick={() => setIsShowOptionsMenu((p) => !p)}
        >
          <i className="fi fi-rr-angle-down"></i>
        </button>
      </div>
      <div
        ref={modalRef}
        className={`${clsx(
          isShowOptionsMenu
            ? "pointer-events-auto h-auto translate-y-0 opacity-100"
            : "pointer-events-none h-0 -translate-y-8 overflow-hidden opacity-0",
        )} flex w-full items-center justify-between divide-x divide-slate-500 transition-all duration-500`}
      >
        <button
          type="button"
          className="flex flex-grow items-center justify-center gap-3 rounded-sm bg-primary-100 py-2 font-medium capitalize text-white hover:brightness-150"
        >
          <i className="fi fi-rr-remove-user"></i>
          <p>un-follow</p>
        </button>
        <button
          type="button"
          className={`flex flex-grow items-center justify-center gap-3 rounded-sm bg-primary-100 py-2 font-medium capitalize text-white hover:brightness-150 ${clsx(
            { "pointer-events-none": isActive },
          )}`}
          onClick={handleOpen}
        >
          <i className="fi fi-rs-eye"></i>
          <p>open</p>
        </button>
      </div>
    </li>
  );
}

export default FeedCard;

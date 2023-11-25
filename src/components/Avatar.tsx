import clsx from "clsx";
import React from "react";

type Props = {
  fullName: string;
  src: string | null;
  onClick?: React.MouseEventHandler;
  className?: string;
  isOnline?: boolean;
  showStatus: boolean;
};
function Avatar({
  showStatus = false,
  isOnline,
  onClick,
  fullName,
  className,
  src = null,
}: Props) {
  function extractNameChars(fullName: string) {
    const shortcut = {
      fName: fullName.split(" ")[0].charAt(0),
      lName: fullName.split(" ")[1].charAt(0),
    };
    return `${shortcut.fName}${shortcut.lName}`;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-md ${clsx(
        className,
      )}`}
    >
      <span
        className={`absolute -bottom-1 left-0 inline-block h-5 w-5 rounded-full ${clsx(
          isOnline ? "bg-emerald-400" : "bg-zinc-500",
          !showStatus && "hidden",
        )}`}
      ></span>
      {src === null ? (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-orange-400 text-2xl uppercase">
          {fullName ? extractNameChars(fullName) : "NA"}
        </span>
      ) : (
        <img
          src={src}
          alt="avatar"
          className="max-w-full object-cover object-center"
        />
      )}
    </button>
  );
}

export default Avatar;

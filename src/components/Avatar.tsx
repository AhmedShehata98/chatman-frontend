import clsx from "clsx";
import React from "react";

type Props = {
  fullName: string;
  src: string | null;
  onClick?: React.MouseEventHandler;
  className?: string;
  status?: "OFFLINE" | "ONLINE" | "IDLE";
  showStatus: boolean;
};
function Avatar({
  showStatus = false,
  status,
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
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 ${clsx(
        className,
      )}`}
    >
      <span
        className={`absolute -bottom-1 left-0 inline-block h-5 w-5 rounded-full ${clsx(
          { "bg-emerald-400": status === "ONLINE" },
          { "bg-zinc-500": status === "OFFLINE" },
          { "bg-sky-700": status === "IDLE" },
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
          className="aspect-square w-full overflow-hidden rounded-full object-cover object-center"
        />
      )}
    </button>
  );
}

export default Avatar;

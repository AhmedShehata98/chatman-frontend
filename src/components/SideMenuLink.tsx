import clsx from "clsx";
import React, { MouseEventHandler } from "react";
import { Link, To } from "react-router-dom";

type Props = {
  to: To;
  isActive: boolean;
  children: React.ReactNode;
  onClick: MouseEventHandler;
};
function SideMenuLink({ onClick, to, isActive, children }: Props) {
  return (
    <Link
      to={to}
      className={clsx(
        isActive
          ? "relative flex w-full cursor-pointer items-center justify-start gap-3 rounded-md bg-zinc-600 px-3 py-3 text-xl capitalize text-zinc-200 shadow-md after:absolute after:left-0 after:top-1/2 after:h-1/2 after:w-1.5 after:-translate-y-1/2 after:rounded-2xl after:bg-secondary-100 after:content-['']"
          : "relative flex w-full cursor-pointer items-center justify-start gap-3 rounded-md px-3 py-3 text-xl capitalize text-zinc-200 shadow-md hover:bg-zinc-700",
      )}
      id="side-menu-link"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default SideMenuLink;

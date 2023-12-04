import clsx from "clsx";
import React from "react";
import { Link, To } from "react-router-dom";

type Props = {
  to: To;
  isActive: boolean;
  children: React.ReactNode;
};
function SidebarLink({ to, isActive, children }: Props) {
  return (
    <Link
      to={to}
      className={clsx(
        isActive
          ? "after:bg-secondary-100 relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-zinc-600 shadow-md after:absolute after:left-0 after:top-1/2 after:h-1/2 after:w-1.5 after:-translate-y-1/2 after:rounded-2xl after:content-['']"
          : "relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-md shadow-md hover:bg-zinc-700",
      )}
    >
      {children}
    </Link>
  );
}

export default SidebarLink;

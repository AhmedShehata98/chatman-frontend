import React from "react";
import FeedSideMenu from "./FeedSideMenu";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import mainAppBg from "../assets/main-app-bg.jpg";

function FeedsLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <article className="flex w-full items-start justify-start">
      <FeedSideMenu />
      <div
        style={{ backgroundImage: `url(${mainAppBg})` }}
        className={`${clsx({
          "max-lg:z-[-1]": !Boolean(location.state),
        })} flex h-dynamic-screen w-full flex-col items-center justify-start overflow-y-hidden bg-cover bg-center bg-no-repeat max-lg:absolute max-lg:inset-0 max-lg:w-full`}
      >
        {children}
      </div>
    </article>
  );
}

export default FeedsLayout;

import React, { MouseEventHandler, forwardRef } from "react";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";

function ConversationHeader({ children }: { children: React.ReactNode }) {
  return <header className="chat__header">{children}</header>;
}

export default ConversationHeader;

type FeedInformationType = {
  feedCover: string | undefined;
  feedName: string | undefined;
  followersCount: number | undefined;
};
const FeedInformation = forwardRef<HTMLDivElement, FeedInformationType>(
  ({ feedName, followersCount, feedCover }, ref) => {
    return (
      <div ref={ref} className="flex items-center justify-start gap-4">
        <Avatar
          fullName={feedName || "n a"}
          showStatus={false}
          src={feedCover || null}
          className="h-16 w-16 max-md:h-12 max-md:w-12"
        />
        <span>
          <p className="font-medium capitalize text-white max-md:text-sm">
            {feedName}
          </p>
          <code className="text-sm text-slate-300 max-md:text-xs">
            {followersCount === 0 && "no followers"}
            {followersCount &&
              followersCount >= 1 &&
              `${followersCount} - followers`}
          </code>
        </span>
      </div>
    );
  },
);
const backButton = forwardRef<HTMLButtonElement, { backTo: string }>(
  ({ backTo }, ref) => {
    const navigate = useNavigate();

    return (
      <button
        type="button"
        ref={ref}
        onClick={() => navigate(backTo)}
        className="h-10 w-10 rounded-full text-3xl leading-3 text-white hover:bg-secondary-100 hover:bg-opacity-50 max-md:h-8 max-md:w-8 max-md:text-xl"
      >
        <i className="fi fi-rr-arrow-small-left"></i>
      </button>
    );
  },
);
const FollowButton = forwardRef<
  HTMLButtonElement,
  { onClick: MouseEventHandler }
>(({ onClick }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className="flex items-center justify-center gap-3 rounded-md bg-secondary-100 px-6 py-3 text-lg font-medium capitalize leading-3 hover:brightness-125"
      onClick={onClick}
    >
      <i className="fi fi-sr-add"></i>
      <p>follow</p>
    </button>
  );
});

const OptionsMenuButton = forwardRef<
  HTMLButtonElement,
  { onClick: MouseEventHandler }
>(({ onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="h-12 w-12 text-2xl text-white max-md:text-xl"
    >
      <i className="fi fi-sr-menu-dots-vertical"></i>
    </button>
  );
});

ConversationHeader.FeedInformation = FeedInformation;
ConversationHeader.backButton = backButton;
ConversationHeader.FollowButton = FollowButton;
ConversationHeader.OptionsMenuButton = OptionsMenuButton;

import { ReactNode, useEffect, useState } from "react";

import Avatar from "./Avatar";
import { chatManWebSocket } from "../services/ws";
import UserTyping from "./userTyping/UserTyping";
import { wsEventsKeys } from "../constants/wsConstants";
import { useNavigate } from "react-router-dom";

type Props = {
  userLabel: ReactNode;
  callButtons: ReactNode;
  searchButton: ReactNode;
};
function ChatHeader({ userLabel, callButtons, searchButton }: Props) {
  const navigator = useNavigate();
  return (
    <div className="flex h-[85px] w-full items-center justify-between bg-primary-100 px-6 py-3 shadow-md max-lg:gap-2 max-md:px-2">
      <span className="flex items-center gap-3">
        <button
          type="button"
          title="back"
          onClick={() => navigator(-1)}
          className="rounded-md p-1.5 text-3xl text-zinc-200 hover:bg-slate-600"
        >
          <i className="fi fi-rr-arrow-small-left"></i>
        </button>
        {userLabel}
      </span>
      <span className="flex items-center justify-center">
        {callButtons}
        {searchButton}
      </span>
    </div>
  );
}

export default ChatHeader;

ChatHeader.UserLabel = UserLabel;
ChatHeader.CallButtons = CallButtons;
ChatHeader.SearchButton = SearchButton;

type UserLabelProps = {
  img: string | null;
  fullName: string;
  status: "OFFLINE" | "ONLINE" | "IDLE";
  lastSeenDate: string;
};
function UserLabel({ img, fullName, status, lastSeenDate }: UserLabelProps) {
  const [userTyping, setUserTyping] = useState({
    isTyping: false,
    name: "",
  });
  const [isShowingLastSeenDate, setIsShowingLastSeenDate] = useState(true);

  useEffect(() => {
    chatManWebSocket.on(wsEventsKeys.typing, (payload) => {
      setUserTyping({ isTyping: payload.isTyping, name: payload.fullName });
    });
    chatManWebSocket.on(wsEventsKeys.finishTyping, (payload) => {
      setUserTyping({ isTyping: payload.isTyping, name: "" });
    });

    return () => {
      chatManWebSocket.off(wsEventsKeys.typing);
    };
  }, [chatManWebSocket]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowingLastSeenDate(false);
    }, 3500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex items-center justify-start gap-5">
      <Avatar
        showStatus
        status={status}
        src={img}
        fullName={fullName}
        className="h-14 w-14 max-lg:h-12 max-lg:w-12"
      />
      <div className="flex flex-col items-start justify-center gap-1">
        <p className="inline-block overflow-hidden truncate font-bold capitalize text-zinc-200 max-lg:max-w-[10rem] max-sm:max-w-[7rem] lg:max-w-[14rem]">
          {fullName}
        </p>
        {isShowingLastSeenDate ? (
          <p className="text-zinc-400 max-lg:text-sm">{lastSeenDate}</p>
        ) : null}
        {userTyping && userTyping.isTyping ? (
          <UserTyping username={userTyping.name} />
        ) : null}
      </div>
    </div>
  );
}
function CallButtons() {
  return (
    <div className="flex w-max items-center justify-center divide-x divide-zinc-600 overflow-hidden rounded-md">
      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center bg-zinc-700 text-2xl text-white hover:bg-zinc-600 max-lg:h-12 max-lg:w-12"
      >
        <i className="fi fi-rr-phone-call"></i>
      </button>
      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center bg-zinc-700 text-2xl text-white hover:bg-zinc-600 max-lg:h-12 max-lg:w-12"
      >
        <i className="fi fi-rr-video-camera-alt"></i>
      </button>
    </div>
  );
}
function SearchButton() {
  return (
    <button
      type="button"
      className="flex h-14 w-14 items-center justify-center text-2xl text-zinc-300 hover:bg-zinc-600 max-lg:h-12 max-lg:w-12"
    >
      <i className="fi fi-rr-search"></i>
    </button>
  );
}

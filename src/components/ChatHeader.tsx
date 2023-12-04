import { ReactNode, useEffect, useState } from "react";

import Avatar from "./Avatar";
import { chatManWebSocket } from "../services/ws";
import UserTyping from "./userTyping/UserTyping";
import { wsEventsKeys } from "../constants/wsConstants";

type Props = {
  userLabel: ReactNode;
  callButtons: ReactNode;
  searchButton: ReactNode;
};
function ChatHeader({ userLabel, callButtons, searchButton }: Props) {
  return (
    <div className="flex w-full items-center justify-between bg-[#111B21] px-6 py-3 shadow-md">
      {userLabel}
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
        className="h-14 w-14"
      />
      <div className="flex flex-col items-start justify-center gap-1">
        <p className="inline-block font-bold capitalize text-zinc-200">
          {fullName}
        </p>
        {isShowingLastSeenDate ? (
          <p className="text-zinc-400">{lastSeenDate}</p>
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
        className="flex h-14 w-14 items-center justify-center bg-zinc-700 text-2xl text-white hover:bg-zinc-600"
      >
        <i className="fi fi-rr-phone-call"></i>
      </button>
      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center bg-zinc-700 text-2xl text-white hover:bg-zinc-600"
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
      className="flex h-14 w-14 items-center justify-center text-2xl text-zinc-300 hover:bg-zinc-600"
    >
      <i className="fi fi-rr-search"></i>
    </button>
  );
}

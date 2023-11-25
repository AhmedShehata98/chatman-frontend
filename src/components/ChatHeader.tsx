import { ReactNode, useEffect, useState } from "react";

import Avatar from "./Avatar";
import { chatManWebSocket } from "../services/ws";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { useQueryClient } from "@tanstack/react-query";
import UserTyping from "./userTyping/UserTyping";

type Props = {
  userLabel: ReactNode;
  callButtons: ReactNode;
  searchButton: ReactNode;
};
function ChatHeader({ userLabel, callButtons, searchButton }: Props) {
  const { user } = useRecoilValue(authStateAtom);
  const queryClient = useQueryClient();
  useEffect(() => {
    chatManWebSocket.emit("user-status", { userId: user?._id, status: true });
    queryClient.invalidateQueries({ queryKey: ["user-data"] });
    return () => {
      chatManWebSocket.emit("user-status", {
        userId: user?._id,
        status: false,
      });
      chatManWebSocket.off("user-status");
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
    };
  }, []);
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
  isOnline: boolean;
  lastActivityDate: string;
};
function UserLabel({ img, fullName, isOnline }: UserLabelProps) {
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    chatManWebSocket.on("start-typing", () => {
      setIsTyping(true);
    });
  }, []);
  return (
    <div className="flex items-center justify-start gap-5">
      <Avatar
        showStatus
        isOnline={isOnline}
        src={img}
        fullName={fullName}
        className="h-14 w-14"
      />
      <div className="flex flex-col items-start justify-center gap-1">
        <p className="inline-block font-bold capitalize text-zinc-200">
          {fullName}
        </p>
        {isTyping && <UserTyping username={fullName} />}
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
      className="flex h-14 w-14 items-center justify-center text-2xl  text-white text-zinc-300 hover:bg-zinc-600"
    >
      <i className="fi fi-rr-search"></i>
    </button>
  );
}

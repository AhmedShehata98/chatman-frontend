import clsx from "clsx";
import {
  MouseEventHandler,
  ReactNode,
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

type Props = {
  children: ReactNode;
  onOpenChat: (setCloseMenu: Dispatch<SetStateAction<boolean>>) => void;
  onClearMessages: (setCloseMenu: Dispatch<SetStateAction<boolean>>) => void;
  onDeleteChat: (setCloseMenu: Dispatch<SetStateAction<boolean>>) => void;
};
function UserConversationCard({
  children,
  onClearMessages,
  onDeleteChat,
  onOpenChat,
}: Props) {
  const [isShowActionMenu, setIsShowActionMenu] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClose = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      if (target.contains(actionMenuRef.current)) {
        setIsShowActionMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  return (
    <li className="conversation-card group">
      {children}
      <button
        type="button"
        onClick={() => setIsShowActionMenu((p) => !p)}
        className="aspect-square cursor-pointer rounded-md p-2 text-xl text-secondary-100 hover:bg-secondary-100 hover:bg-opacity-10"
      >
        <i className="fi fi-rr-menu-dots-vertical pointer-events-none"></i>
      </button>
      <div
        ref={actionMenuRef}
        className={`${clsx(
          isShowActionMenu
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-10 opacity-0",
        )} absolute right-8 top-12 z-10 w-48 rounded-sm bg-primary-200 shadow-lg transition-all duration-500`}
      >
        <ul className="grid w-full grid-flow-row gap-2">
          <li
            onClick={() => onOpenChat(setIsShowActionMenu)}
            className="flex cursor-pointer items-center justify-start gap-3 bg-primary-200 px-3 py-4 capitalize leading-3 text-white hover:brightness-150"
          >
            <i className="fi fi-rr-comment-alt"></i>
            <b>open this chat</b>
          </li>
          <li
            onClick={() => onClearMessages(setIsShowActionMenu)}
            className="flex cursor-pointer items-center justify-start gap-3 bg-primary-200 px-3 py-4 capitalize leading-3 text-white hover:brightness-150"
          >
            <i className="fi fi-rs-clean"></i>
            <b>clear messages</b>
          </li>
          <li
            onClick={() => onDeleteChat(setIsShowActionMenu)}
            className="flex cursor-pointer items-center justify-start gap-3 bg-primary-200 px-3 py-4 capitalize leading-3 text-red-600 hover:brightness-150"
          >
            <i className="fi fi-rr-trash"></i>
            <b>delete chat</b>
          </li>
        </ul>
      </div>
    </li>
  );
}
UserConversationCard.LastMessage = LastMessage;
UserConversationCard.UserAvatar = UserAvatar;
UserConversationCard.UserChatDate = UserChatDate;
UserConversationCard.userName = UserName;

function UserName({
  fullName,
  onClick,
}: {
  onClick: MouseEventHandler;
  fullName: string;
}) {
  return (
    <p
      onClick={onClick}
      className="inline-block max-w-[10rem] cursor-pointer overflow-hidden truncate font-semibold capitalize text-white max-lg:max-w-[22rem] max-sm:max-w-[8rem]"
    >
      {fullName}
    </p>
  );
}
function UserChatDate({ messageDate }: { messageDate: string }) {
  return (
    <small className="inline-block max-w-[7rem] overflow-hidden truncate font-semibold text-zinc-400">
      {messageDate}
    </small>
  );
}
function UserAvatar({ img }: { img: string }) {
  return (
    <figure className="grid aspect-square w-20 place-content-center place-items-center overflow-hidden rounded-full">
      <img
        src={img}
        alt="user-avatar"
        className="max-w-full object-cover object-center"
      />
    </figure>
  );
}

function LastMessage({ lastMessage }: { lastMessage: string }) {
  return (
    <p className="inline-block max-w-full overflow-hidden truncate font-semibold text-zinc-400 group-hover:text-zinc-200">
      {lastMessage}
    </p>
  );
}

export default UserConversationCard;

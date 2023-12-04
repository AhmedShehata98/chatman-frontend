import { MouseEventHandler, ReactNode } from "react";

type Props = {
  onClick?: MouseEventHandler;
  children: ReactNode;
};
function UserConversationCard({ onClick, children }: Props) {
  return (
    <li onClick={onClick} className="conversation-card group">
      {children}
    </li>
  );
}
UserConversationCard.LastMessage = LastMessage;
UserConversationCard.UserAvatar = UserAvatar;
UserConversationCard.UserChatDate = UserChatDate;
UserConversationCard.userName = UserName;

function UserName({ fullName }: { fullName: string }) {
  return <p className="font-semibold capitalize text-white ">{fullName}</p>;
}
function UserChatDate({ messageDate }: { messageDate: string }) {
  return <small className="font-semibold text-zinc-400">{messageDate}</small>;
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

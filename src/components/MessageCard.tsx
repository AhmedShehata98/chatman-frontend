import Avatar from "./Avatar";
import clsx from "clsx";

function MessageCard({ message, me }: { message: Message; me: User | null }) {
  return (
    <li
      key={message._id}
      className={`flex max-w-[70%] items-start justify-end gap-3 max-md:max-w-full max-md:justify-start ${clsx(
        message.sender._id !== me?._id
          ? "flex-row-reverse self-end"
          : "self-start",
      )}`}
    >
      <Avatar
        showStatus
        status={message.sender.status}
        src={message.sender.profilePictureUrl || null}
        fullName={message.sender.fullName || "NA-NA"}
        className="max-md:h-10 max-md:w-10"
      />
      <span
        className={`${clsx(
          message.sender._id !== me?._id
            ? "bg-third-200 after:-right-[0.80rem] after:border-b-transparent after:border-l-transparent after:border-r-transparent after:border-t-primary-300"
            : "bg-secondary-200 after:-left-[0.80rem] after:border-b-transparent after:border-l-transparent after:border-r-transparent after:border-t-secondary-200",
        )} relative mx-5 mt-2 flex w-[calc(100%-6.5rem)] max-w-[calc(100%-6.5rem)] flex-col content-end items-end justify-end gap-2 overflow-hidden rounded-md p-4 after:absolute after:top-0 after:h-6 after:w-6 after:border-[1rem] after:content-[''] max-md:me-2 max-md:ms-4`}
      >
        <p className="inline-block max-w-full break-words text-white">
          {message.message}
        </p>
        <small className="font-semibold text-zinc-400 max-md:text-xs">
          {Intl.DateTimeFormat("en-EG", {
            dateStyle: "long",
            timeStyle: "short",
          }).format(new Date(message.createdAt))}
        </small>
      </span>
    </li>
  );
}

export default MessageCard;

import Avatar from "./Avatar";
import clsx from "clsx";

function MessageCard({ message, me }: { message: Message; me: User | null }) {
  return (
    <li
      key={message._id}
      className={`flex max-w-[70%] items-start justify-end gap-3 ${clsx(
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
      />
      <span
        className={`${clsx(
          message.sender._id !== me?._id
            ? "bg-primary-300 after:-right-[0.80rem] after:border-b-transparent after:border-l-transparent after:border-r-transparent after:border-t-primary-300"
            : "bg-secondary-200 after:-left-[0.80rem] after:border-b-transparent after:border-l-transparent after:border-l-transparent after:border-r-transparent after:border-t-secondary-200",
        )} relative mx-5 mt-2 flex flex-col content-end items-end justify-end gap-2 rounded-md p-4 after:absolute after:top-0 after:h-6 after:w-6 after:border-[1rem] after:content-['']`}
      >
        <p className="max-w-full text-white">{message.message}</p>
        <small className="font-semibold text-zinc-400">
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

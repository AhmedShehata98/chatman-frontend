import clsx from "clsx";
import Avatar from "./Avatar";
import { useRef } from "react";

type Props = {
  data: Omit<Post, "_id">;
  className?: string;
};

function PostCard({ data, className }: Props) {
  const optionMenuRef = useRef<HTMLUListElement | null>(null);
  function handleOpenOptionMenu() {
    optionMenuRef.current?.classList.toggle(clsx("hidden"));
  }
  return (
    <li
      className={`flex w-full items-start justify-start gap-3 rounded-md shadow-lg ${clsx(
        className,
      )}`}
    >
      <Avatar
        fullName={data?.feedRoom.feedName}
        className="h-14 w-14 shadow-lg max-lg:h-8 max-lg:w-8"
        src={data?.feedRoom.feedCover || null}
        showStatus={false}
      />
      <div className="flex w-full flex-col items-start justify-start rounded-md bg-primary-100 p-4">
        <div className="relative mb-6 flex w-full items-center justify-between">
          <span className="flex flex-col items-start justify-center">
            <p className="w-fit text-lg font-medium text-orange-500 max-md:text-sm">
              {data?.feedRoom.feedName}
            </p>
            <small className="text-zinc-300 max-md:text-xs">
              {Intl.DateTimeFormat("default", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(data.createdAt))}
            </small>
          </span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-lg text-secondary-100 hover:bg-secondary-100 hover:bg-opacity-20"
            onClick={handleOpenOptionMenu}
          >
            <i className="fi fi-rs-menu-dots-vertical"></i>
          </button>
          <ul
            ref={optionMenuRef}
            className="absolute right-8 top-5 hidden w-48 divide-y divide-secondary-200 rounded-md bg-primary-200 shadow-lg"
          >
            <li className="flex cursor-pointer items-center justify-start gap-3 px-3 py-2 text-white hover:bg-secondary-200 hover:bg-opacity-20">
              <i className="fi fi-rr-trash"></i>
              <p>remove this post</p>
            </li>
          </ul>
        </div>
        <h4 className="mb-3 text-lg font-medium text-white max-md:text-base">
          {data.content.text}
        </h4>
        {data.content?.media !== "" ? (
          <figure className="h-80 w-full overflow-hidden rounded-lg">
            <img
              src={data.content.media}
              alt="post-media"
              className="max-w-full object-cover object-center"
            />
          </figure>
        ) : null}
        <span className="mt-3 flex w-full items-center justify-center gap-5 border-t border-secondary-200 pt-3">
          <button className="flex w-1/3 items-center justify-center gap-3 rounded-md bg-secondary-100 bg-opacity-10 py-4 text-xl font-semibold capitalize leading-3 text-secondary-100 hover:bg-opacity-20 hover:text-white max-md:py-2 max-md:text-base">
            <i className="fi fi-rs-heart"></i>
            <p>like</p>
          </button>
          <button className="flex w-1/3 items-center justify-center gap-3 rounded-md bg-secondary-100 bg-opacity-10 py-4 text-xl font-semibold capitalize leading-3 text-secondary-100 hover:bg-opacity-20 hover:text-white max-md:py-2 max-md:text-base">
            <i className="fi fi-rr-share-square"></i>
            <p>share</p>
          </button>
          <button className="flex w-1/3 items-center justify-center gap-3 rounded-md bg-secondary-100 bg-opacity-10 py-4 text-xl font-semibold capitalize leading-3 text-secondary-100 hover:bg-opacity-20 hover:text-white max-md:py-2 max-md:text-base">
            <i className="fi fi-rr-comment-alt"></i>
            <p>comment</p>
          </button>
        </span>
      </div>
    </li>
  );
}

export default PostCard;

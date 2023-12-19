import clsx from "clsx";
import Avatar from "./Avatar";
import { forwardRef, MouseEventHandler, ReactNode, useState } from "react";
import useAddReaction from "../hooks/useAddReaction";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, getComments } from "../services/posts.api";
import useClickOutside from "../hooks/useClickOutside";
import { useSearchParams } from "react-router-dom";
import TimeAgo from "react-timeago";
import useComments from "../hooks/useComments";
import { nanoid } from "nanoid";

type Props = {
  data: Post;
  className?: string;
};

function PostCard({ data, className }: Props) {
  const { user, token } = useRecoilValue(authStateAtom);
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const { data: initialCommentsList } = useQuery({
    queryKey: ["comments", showComments, data._id],
    queryFn: () =>
      getComments({ postId: data._id as string, limit: 6, page: 1 }),
    enabled: showComments && Boolean(data._id),
  });
  const {
    comments,
    handleAddComment,
    handleReSendComment,
    errorSendComment,
    isPendingComment,
    currentCommentId,
  } = useComments({
    initialComments: initialCommentsList || [],
  });
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [_searchParams, setSearchParams] = useSearchParams();
  const { modalRef: optionMenuRef } = useClickOutside({
    setShowModal: setShowOptionsMenu,
  });
  const { handleAddReaction, reactionsLength } = useAddReaction({
    initialReactions: data.reaction,
    postId: data._id,
    token,
  });

  function handleOpenOptionMenu() {
    setShowOptionsMenu(true);
  }
  const { mutate: sendDeletePost } = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: (postId: string) => deletePost({ postId }),
  });
  // const { mutate: sendUpdatePost } = useMutation({
  //   mutationKey: ["update-post"],
  //   mutationFn: (postId: string) => updatePost({ postId }),
  // });

  const handleDeletePost = (postId: string) => {
    sendDeletePost(postId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["feed-posts"],
        });
        setShowOptionsMenu(false);
      },
    });
  };
  const handleUpdatePost = (_postId: string) => {};
  const handleGetPostDetails = (postId: string) => {
    setSearchParams({ post: postId }, { state: data.feedRoom._id });
  };
  const handleSendComment = (
    comment: { text: string; media: string },
    post: Post,
  ) => {
    if (!user) return;
    const data = {
      _id: nanoid(14),
      commentUser: user,
      postId: post,
      comment,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    };
    handleAddComment(data);
  };
  const handleRetry = (
    comment: { text: string; media: string },
    post: Post,
  ) => {
    if (!data || !user) return;
    handleReSendComment({ comment, commentUser: user?._id, postId: post._id });
  };

  return (
    <li className={`feed-card ${clsx(className)}`}>
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
          {showOptionsMenu && (
            <PostCard.OptionsMenu
              ref={optionMenuRef}
              optionsData={[
                {
                  title: "browse",
                  children: <i className="fi fi-rr-eye"></i>,
                  onClick: () => handleGetPostDetails(data._id),
                  isOwnerUser: Boolean(data.feedRoom.owner === user?._id),
                },
                {
                  title: "report",
                  children: <i className="fi fi-rr-sensor-alert"></i>,
                  isOwnerUser: Boolean(data.feedRoom.owner === user?._id),
                },
                {
                  title: "save",
                  children: <i className="fi fi-rr-bookmark"></i>,
                  isOwnerUser: Boolean(data.feedRoom.owner === user?._id),
                },
                {
                  title: "update post",
                  children: <i className="fi fi-rr-pen-clip"></i>,
                  onClick: () => handleUpdatePost(data._id),
                  isOwnerUser: Boolean(data.feedRoom.owner === user?._id),
                },
                {
                  title: "remove this post",
                  children: <i className="fi fi-rr-trash"></i>,
                  className: "!text-red-500",
                  onClick: () => handleDeletePost(data._id),
                  isOwnerUser: Boolean(data.feedRoom.owner === user?._id),
                },
              ]}
            />
          )}
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
          <button
            onClick={() => handleAddReaction(user)}
            className="flex w-1/3 items-center justify-center gap-3 rounded-md bg-secondary-100 bg-opacity-10 py-4 text-xl font-semibold capitalize leading-3 text-secondary-100 hover:bg-opacity-20 hover:text-white max-md:py-2 max-md:text-base"
          >
            {reactionsLength <= 0 && (
              <>
                <i className="fi fi-rs-heart"></i>
                <p>like</p>
              </>
            )}
            {reactionsLength >= 1 && (
              <>
                <i className="fi fi-sr-heart text-red-700"></i>
                <p>{reactionsLength}</p>
              </>
            )}
          </button>
          <button
            className="flex w-1/3 items-center justify-center gap-3 rounded-md bg-secondary-100 bg-opacity-10 py-4 text-xl font-semibold capitalize leading-3 text-secondary-100 hover:bg-opacity-20 hover:text-white max-md:py-2 max-md:text-base"
            onClick={() => setShowComments((p) => !p)}
          >
            <i className="fi fi-rr-comment-alt"></i>
            <p>comment</p>
          </button>
          <button className="flex w-1/3 items-center justify-center gap-3 rounded-md bg-secondary-100 bg-opacity-10 py-4 text-xl font-semibold capitalize leading-3 text-secondary-100 hover:bg-opacity-20 hover:text-white max-md:py-2 max-md:text-base">
            <i className="fi fi-rr-share-square"></i>
            <p>share</p>
          </button>
        </span>
        {showComments && (
          <PostCard.CommentsList
            onRetry={(comment) => handleRetry(comment, data)}
            comments={comments}
            isError={errorSendComment}
            isPending={isPendingComment}
            currentCommentId={currentCommentId}
            onAddComment={(comment) => handleSendComment(comment, data)}
          />
        )}
      </div>
    </li>
  );
}

export default PostCard;
//
//
// components
//
//

type OptionsMenuType = {
  optionsData: {
    title: string;
    className?: string;
    onClick?: MouseEventHandler;
    children?: ReactNode;
    isOwnerUser: boolean;
  }[];
};
const OptionsMenu = forwardRef<HTMLUListElement, OptionsMenuType>(
  ({ optionsData }, ref) => {
    return (
      <ul ref={ref} className="feed-card__options-menu">
        {optionsData?.map(
          ({ isOwnerUser, title, children, className, onClick }) => {
            return (
              <li
                className={`options-menu__option ${clsx(className, {
                  hidden: !isOwnerUser,
                })}`}
                onClick={onClick}
              >
                {children}
                <p>{title}</p>
              </li>
            );
          },
        )}
      </ul>
    );
  },
);

type CommentsPropsType = {
  comments: Comments[];
  isError: boolean;
  isPending: boolean;
  currentCommentId: string;
  onAddComment: (comment: { text: string; media: string }) => void;
  onRetry: (comment: { text: string; media: string }) => void;
};
const CommentsList = forwardRef<HTMLDivElement, CommentsPropsType>(
  (
    { comments, isError, onAddComment, isPending, onRetry, currentCommentId },
    ref,
  ) => {
    const [commentValue, setCommentValue] = useState({
      text: "",
      media: "",
    });
    const { user } = useRecoilValue(authStateAtom);

    return (
      <div ref={ref} className="flex w-full flex-col">
        <button
          className="w-max self-center px-4 py-3 text-lg font-semibold capitalize text-white underline"
          type="button"
        >
          load more comments ...
        </button>
        <ul className="flex w-full flex-col items-start justify-start gap-3 p-2">
          <div className="flex w-full items-start justify-center gap-5 border-b border-primary-200 pb-2">
            <Avatar
              fullName={user?.fullName || "N A"}
              src={user?.profilePictureUrl || null}
              showStatus
              status={user?.status}
              className="h-10 w-10"
            />
            <div className="flex flex-grow flex-col gap-4 rounded-2xl bg-primary-200 p-2">
              <textarea
                name="commentText"
                id="commentText"
                placeholder="write a comment ..."
                rows={1}
                value={commentValue.text}
                onChange={(ev) =>
                  setCommentValue((prevVal) => ({
                    ...prevVal,
                    text: ev.target.value,
                  }))
                }
                className="flex-grow rounded-md border border-transparent bg-inherit px-3 py-2 text-white focus:border-secondary-100 focus:outline-none focus:brightness-125"
              />
              <div className="flex w-full items-center justify-start gap-2">
                <div className="flex flex-grow items-center justify-start gap-4 px-3">
                  <button
                    type="button"
                    className="text-2xl text-zinc-200 hover:brightness-150"
                  >
                    <i className="fi fi-rs-grin-alt"></i>
                  </button>
                  <button
                    type="button"
                    className="text-2xl text-zinc-200 hover:brightness-150"
                  >
                    <i className="fi fi-rr-picture"></i>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onAddComment(commentValue);
                    setCommentValue({ media: "", text: "" });
                  }}
                  className="h-8 w-8 -rotate-45 rounded-full bg-secondary-200 leading-3 text-white"
                >
                  <i className="fi fi-rs-paper-plane-top"></i>
                </button>
              </div>
            </div>
          </div>
          {comments?.map((comment) => (
            <li
              key={comment._id}
              className={`flex w-full items-start justify-center gap-4`}
            >
              <Avatar
                fullName={comment.commentUser.fullName}
                src={comment.commentUser.profilePictureUrl}
                showStatus
                status={comment.commentUser.status}
                className="h-9 w-9"
              />
              <div className="flex flex-grow flex-col gap-2">
                <span
                  className={`${clsx(
                    {
                      "animate-pulse opacity-30":
                        isPending && comment._id === currentCommentId,
                    },
                    isError && comment._id === currentCommentId
                      ? "bg-red-300 bg-opacity-50"
                      : "bg-primary-200",
                  )} flex flex-col rounded-2xl p-3`}
                >
                  <p className="inline-block py-2 font-bold capitalize leading-3 text-white">
                    {comment.commentUser.fullName}
                  </p>
                  <small className="font-medium leading-5 text-zinc-100">
                    {comment?.comment?.text}
                  </small>
                </span>
                <span className="flex items-center justify-start gap-6 px-3 font-medium text-white">
                  <p className="text-zinc-300">
                    <TimeAgo date={new Date(comment.createdAt)} />
                  </p>
                  <button type="button" className="font-semibold capitalize">
                    like
                  </button>
                  <button type="button" className="font-semibold capitalize">
                    replay
                  </button>
                  <button
                    type="button"
                    className={`${clsx(
                      isError && comment._id === currentCommentId
                        ? "flex"
                        : "hidden",
                    )} ms-auto items-center justify-center gap-2 text-red-600`}
                    onClick={() => onRetry(commentValue)}
                  >
                    <p className="text-sm capitalize text-red-400">
                      network try again
                    </p>
                    <i className="fi fi-rr-refresh"></i>
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

PostCard.OptionsMenu = OptionsMenu;
PostCard.CommentsList = CommentsList;

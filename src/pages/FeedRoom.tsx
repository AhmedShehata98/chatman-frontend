import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { followFeed, getFeedById, isFollower } from "../services/feeds.api";
import Avatar from "../components/Avatar";
import { getAllPosts } from "../services/posts.api";
import ConversationFooterWrapper from "../components/ConversationFooterWrapper";
import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";
import useFeedsMessages from "../hooks/useFeedsMessages";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { feedInputsAtom } from "../atoms/feed.atom";
import PostCard from "../components/PostCard";
import { ROUTES_LIST } from "../router/routes-list";
import LoadingIndicator from "../components/LoadingIndicator";
import clsx from "clsx";

function FeedRoom() {
  const location = useLocation();
  const { user: me, token } = useRecoilValue(authStateAtom);
  const postContent = useRecoilValue(feedInputsAtom);
  const navigate = useNavigate();
  const postsListRef = useRef<HTMLElement | null>(null);

  const { handleCreateFeedPost } = useFeedsMessages({
    feedId: location.state,
    userId: me?._id as string,
  });
  const [limit, _setLimit] = useState(8);
  const {
    data: feedDetails,
    // isLoading: gettingFeedDetails,
    isFetched: FetchedFeedDetails,
  } = useQuery({
    queryKey: ["feed-details", location.state],
    queryFn: () => getFeedById(location.state),
    enabled: Boolean(location.state),
  });
  const { data: isFollowerUser } = useQuery({
    queryKey: ["is-follower", token],
    queryFn: () =>
      isFollower({ feedId: location.state, token: token as string }),
    enabled: Boolean(token),
  });
  const {
    data: PostsData,
    isFetched: isFetchedPosts,
    isLoading: gettingPosts,
  } = useInfiniteQuery({
    queryKey: ["feed-posts", location.state],
    queryFn: ({ pageParam }) =>
      getAllPosts({ feedId: location.state, limit, page: +pageParam }),
    maxPages: limit,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (Math.ceil(lastPage.total / limit) > allPages.length)
        return allPages.length;
      return undefined;
    },
  });
  const { mutate: startFollowFeed } = useMutation({
    mutationKey: ["follow-feed"],
    mutationFn: (feedId: string) =>
      followFeed({ feedId, token: token as string }),
  });

  const handleSendPost = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    handleCreateFeedPost({
      media: postContent.attachmentContent,
      text: postContent.textContent,
    });
  };

  useEffect(() => {
    chatManWebSocket.emit(wsEventsKeys.joinFeeds, { feedId: location.state });
    return () => {
      chatManWebSocket.off(wsEventsKeys.joinFeeds);
    };
  }, [chatManWebSocket]);

  useEffect(() => {
    postsListRef.current?.scrollBy({
      behavior: "smooth",
      top: postsListRef.current?.scrollHeight,
    });
  }, [postsListRef.current?.scrollHeight]);

  console.log(isFollowerUser);

  return (
    <div className="relative flex h-dynamic-screen w-full flex-col items-start justify-between overflow-hidden">
      <header className="z-10 flex w-full items-center justify-start bg-primary-300 px-3 py-2">
        <div className="flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES_LIST.feeds)}
            className="h-10 w-10 rounded-full text-3xl leading-3 text-white hover:bg-secondary-100 hover:bg-opacity-50 max-md:h-8 max-md:w-8 max-md:text-xl"
          >
            <i className="fi fi-rr-arrow-small-left"></i>
          </button>
          <div className="flex items-center justify-start gap-4">
            <Avatar
              fullName={feedDetails?.feedName || "n a"}
              showStatus={false}
              src={feedDetails?.feedCover || null}
              className="h-16 w-16 max-md:h-12 max-md:w-12"
            />
            <span>
              <p className="font-medium capitalize text-white max-md:text-sm">
                {feedDetails?.feedName}
              </p>
              <code className="text-sm text-slate-300 max-md:text-xs">
                {feedDetails?.followers.length === 0 && "no followers"}
                {feedDetails?.followers &&
                  feedDetails?.followers.length >= 1 &&
                  `${feedDetails?.followers.length} - followers`}
              </code>
            </span>
          </div>
        </div>
        <div className="ms-auto flex items-center justify-end">
          {FetchedFeedDetails &&
            !isFollower &&
            feedDetails?.owner !== me?._id && (
              <button
                type="button"
                className="flex items-center justify-center gap-3 rounded-md bg-secondary-100 px-6 py-3 text-lg font-medium capitalize leading-3 hover:brightness-125"
                onClick={() =>
                  startFollowFeed(location.state, {
                    onSuccess: (data) => console.log(data),
                    onError: (err) => console.log(err),
                  })
                }
              >
                <i className="fi fi-sr-add"></i>
                <p>follow</p>
              </button>
            )}
          <button className="h-12 w-12 text-2xl text-white max-md:text-xl">
            <i className="fi fi-sr-menu-dots-vertical"></i>
          </button>
        </div>
      </header>
      <section
        ref={postsListRef}
        className="overlay-layer relative h-[calc(100dvh-7rem)] max-h-[calc(100dvh-7rem)] w-full overflow-y-auto"
      >
        <div
          className={`${clsx(
            gettingPosts
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-6 opacity-0",
          )} fixed left-2/3 z-20 mt-4 -translate-x-3/4 rounded-full bg-primary-200 p-3 transition-all duration-500`}
        >
          <LoadingIndicator isShown={true} />
        </div>

        <ul className="relative z-10 flex max-w-3xl flex-col gap-4 p-9 max-md:p-3">
          {isFetchedPosts &&
            PostsData?.pages?.map((page) =>
              page.posts.map((post) => (
                <PostCard
                  data={{
                    ...post,
                  }}
                />
              )),
            )}
        </ul>
        {isFetchedPosts &&
          PostsData?.pages &&
          PostsData?.pages?.[0].posts.length <= 0 && (
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-200 bg-opacity-60 px-5 py-3 font-medium capitalize text-white">
              <p>there is no posts in this feed room yet .</p>
            </div>
          )}
      </section>
      {!isFollower && feedDetails?.owner !== me?._id && (
        <div className="z-10 flex w-full items-center justify-start bg-primary-300 px-3 py-4">
          <button
            type="button"
            className="mx-auto flex items-center justify-center gap-3 text-xl font-medium capitalize text-secondary-100"
          >
            <p>follow </p>
            <i className="fi fi-sr-add leading-3"></i>
          </button>
        </div>
      )}
      {!FetchedFeedDetails || feedDetails?.owner !== me?._id ? null : (
        <ConversationFooterWrapper onSubmit={handleSendPost} />
      )}
    </div>
  );
}

export default FeedRoom;

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { followFeed, getFeedById, isFollower } from "../services/feeds.api";
import { getAllPosts } from "../services/posts.api";
import ConversationFooterWrapper, {
  FormInputType,
} from "../components/ConversationFooterWrapper";
import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";
import useFeedsMessages from "../hooks/useFeedsMessages";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import PostCard from "../components/PostCard";
import { ROUTES_LIST } from "../router/routes-list";
import LoadingIndicator from "../components/LoadingIndicator";
import clsx from "clsx";
import PostDetails from "./PostDetails";
import ConversationHeader from "../components/ConversationHeader";

function FeedRoom() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user: me, token } = useRecoilValue(authStateAtom);
  const postsListRef = useRef<HTMLElement | null>(null);

  const { handleCreateFeedPost } = useFeedsMessages({
    feedId: location.state,
  });
  const [limit, _setLimit] = useState(8);
  const {
    data: feedDetails,
    // isLoading: gettingFeedDetails,
    isFetched: FetchedFeedDetails,
  } = useQuery({
    queryKey: ["feed-details", location.state],
    queryFn: () =>
      getFeedById({ feedId: location.state, token: token as string }),
    enabled: Boolean(location.state) && token !== null,
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

  const handleSendPost = (message: FormInputType, reset: Function) => {
    handleCreateFeedPost(
      {
        media: message.mediaContent as string,
        text: message.textContent,
      },
      reset,
    );
  };

  const handleFollowFeed = () => {
    startFollowFeed(location.state, {
      onSuccess: (data) => console.log(data),
      onError: (err) => console.log(err),
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
  }, []);

  return (
    <div className="feed-room">
      <ConversationHeader>
        <div className="flex items-center justify-start gap-3">
          <ConversationHeader.backButton backTo={ROUTES_LIST.feeds} />
          <ConversationHeader.FeedInformation
            feedCover={feedDetails?.feedCover}
            feedName={feedDetails?.feedName}
            followersCount={feedDetails?.followers.length}
          />
        </div>
        <div className="ms-auto flex items-center justify-end">
          {FetchedFeedDetails &&
            !isFollower &&
            feedDetails?.owner !== me?._id && (
              <ConversationHeader.FollowButton onClick={handleFollowFeed} />
            )}
          <ConversationHeader.OptionsMenuButton onClick={() => {}} />
        </div>
      </ConversationHeader>
      <section ref={postsListRef} className="chat__body">
        <div
          className={`${clsx(
            gettingPosts
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-6 opacity-0",
          )} fixed left-2/3 z-20 mt-4 -translate-x-3/4 rounded-full bg-primary-200 p-3 transition-all duration-500`}
        >
          <LoadingIndicator isShown={true} />
        </div>

        <ul className="feed-list">
          {isFetchedPosts &&
            PostsData?.pages?.map((page) =>
              page.posts.map((post) => (
                <PostCard
                  key={post._id}
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
      {!isFollowerUser && feedDetails?.owner !== me?._id && (
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
      {FetchedFeedDetails && feedDetails?.owner === me?._id && (
        <ConversationFooterWrapper
          sendData={(message, reset) => handleSendPost(message, reset)}
        />
      )}
      {searchParams.get("post") !== null && <PostDetails />}
    </div>
  );
}

export default FeedRoom;

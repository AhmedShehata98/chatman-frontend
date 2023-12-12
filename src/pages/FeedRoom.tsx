import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFeedById } from "../services/feeds.api";
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

function FeedRoom() {
  const location = useLocation();
  const { user: me } = useRecoilValue(authStateAtom);
  const postContent = useRecoilValue(feedInputsAtom);
  const navigate = useNavigate();

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
  const { data: PostsData, isFetched: isFetchedPosts } = useInfiniteQuery({
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

  return (
    <div className="relative flex h-dynamic-screen w-full flex-col items-start justify-between overflow-hidden">
      <header className="z-10 flex w-full items-center justify-start bg-primary-300 px-3 py-2">
        <div className="flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES_LIST.feeds)}
            className="h-10 w-10 rounded-full text-3xl leading-3 text-white hover:bg-secondary-100 hover:bg-opacity-50"
          >
            <i className="fi fi-rr-arrow-small-left"></i>
          </button>
          <div className="flex items-center justify-start gap-4">
            <Avatar
              fullName={feedDetails?.feedName || "n a"}
              showStatus={false}
              src={feedDetails?.feedCover || null}
              className="h-16 w-16"
            />
            <span>
              <p className="font-medium capitalize text-white">
                {feedDetails?.feedName}
              </p>
              <code className="text-sm text-slate-300">
                {feedDetails?.followers.length === 0 && "no followers"}
                {feedDetails?.followers &&
                  feedDetails?.followers.length >= 1 &&
                  `${feedDetails?.followers.length} - followers`}
              </code>
            </span>
          </div>
        </div>
        <button className="ms-auto h-12 w-12 text-2xl text-white">
          <i className="fi fi-sr-menu-dots-vertical"></i>
        </button>
      </header>
      <section className="relative h-[calc(100dvh-7rem)] max-h-[calc(100dvh-7rem)] w-full overflow-y-auto after:fixed after:inset-0 after:z-[5] after:bg-primary-200 after:bg-opacity-50 after:content-['']">
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
      {!FetchedFeedDetails || feedDetails?.owner !== me?._id ? null : (
        <ConversationFooterWrapper onSubmit={handleSendPost} />
      )}
    </div>
  );
}

export default FeedRoom;

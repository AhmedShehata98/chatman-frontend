import { useState } from "react";
import FeedCard from "./FeedCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllFeeds } from "../services/feeds.api";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";

function FeedRoomList() {
  const [limit, _setLimit] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useRecoilValue(authStateAtom);
  const { data: feedListData } = useInfiniteQuery({
    queryKey: ["feeds"],
    queryFn: ({ pageParam }) =>
      getAllFeeds({ limit: 10, page: +pageParam, token: token as string }),
    refetchOnMount: false,
    retry: 2,
    enabled: Boolean(token),
    getNextPageParam: (lastPage, allPages) => {
      if (Math.ceil(lastPage.total / limit) > allPages.length)
        return allPages.length;
      return undefined;
    },
    initialPageParam: 1,
  });

  const handleOpenFeed = (feed: IFeed) => {
    if (!feed) return;

    navigate(`${ROUTES_LIST.feeds}/${feed.feedName}`, { state: feed._id });
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <h3 className="mt-6 px-2 text-2xl font-medium capitalize text-white">
        feeds
      </h3>
      <ul className="flex max-h-[90dvh] w-full flex-col items-start justify-start gap-2 rounded-md">
        {feedListData?.pages.map((page) =>
          page.data.map(function (feed) {
            return (
              <FeedCard
                key={feed._id}
                feedName={feed.feedName}
                createdAt={feed.createdAt}
                feedCover={feed.feedCover}
                followersLength={0}
                handleOpen={() => handleOpenFeed(feed)}
                isActive={location.state?.includes(feed._id)}
              />
            );
          }),
        )}
      </ul>
    </div>
  );
}

export default FeedRoomList;

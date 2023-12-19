import Portal from "../components/Portal";
import { useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../services/posts.api";
import useClickOutside from "../hooks/useClickOutside";

function PostDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { modalRef } = useClickOutside({
    setShowModal: () => setSearchParams({}),
  });
  const {
    data: postDetails,
    isLoading: isGettingPostDetails,
    isFetched: isFetchedPostDetails,
  } = useQuery({
    queryKey: ["post-details"],
    queryFn: () => getPostById(searchParams.get("post") as string),
  });

  return (
    <Portal>
      <div className="fixed inset-0 left-1/2 top-1/2 z-50 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-gray-700 bg-opacity-60">
        <div ref={modalRef} className="flex w-1/2 items-center justify-center">
          {isGettingPostDetails && (
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="inline-block h-14 w-14 animate-spin rounded-full border-4 border-secondary-100 border-l-transparent"></span>
              <p className="w-max font-medium capitalize text-white">
                loading post ...
              </p>
            </div>
          )}
          {isFetchedPostDetails && (
            <PostCard data={postDetails} className="w-full shadow-lg" />
          )}
        </div>
      </div>
    </Portal>
  );
}

export default PostDetails;

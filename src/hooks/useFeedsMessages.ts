import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../services/posts.api";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";

function useFeedsMessages({ feedId }: { feedId: string }) {
  const queryClient = useQueryClient();
  const { user } = useRecoilValue(authStateAtom);

  const { mutate: addPost } = useMutation({
    mutationKey: ["add-post"],
    mutationFn: (post: CreatePost) => createPost(post),
  });

  const handleCreateFeedPost = useCallback(
    (content: { text: string; media: string }, reset: Function) => {
      chatManWebSocket
        .emit(wsEventsKeys.newFeedPost, {
          feedId,
          userId: user?._id,
          content,
        })
        .on(wsEventsKeys.newFeedPost, (content) => {
          addPost(
            { feedRoom: feedId, publisher: user?._id as string, content },
            {
              onSuccess: () => {
                reset();
                queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
              },
              onError: (err) => console.log(err),
            },
          );
        });
    },
    [user, feedId],
  );
  return { handleCreateFeedPost };
}

export default useFeedsMessages;

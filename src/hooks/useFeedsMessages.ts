import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../services/posts.api";
import { useSetRecoilState } from "recoil";
import { feedInputsAtom } from "../atoms/feed.atom";

function useFeedsMessages({
  feedId,
  userId,
}: {
  feedId: string;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const { mutate: addPost } = useMutation({
    mutationKey: ["add-post"],
    mutationFn: (post: CreatePost) => createPost(post),
  });
  const setFeedInputs = useSetRecoilState(feedInputsAtom);

  function handleCreateFeedPost(content: { text: string; media: string }) {
    chatManWebSocket.emit(wsEventsKeys.newFeedPost, {
      feedId,
      userId,
      content,
    });
  }
  useEffect(() => {
    chatManWebSocket.on(wsEventsKeys.newFeedPost, (content) => {
      console.log({ feedRoom: feedId, publisher: userId, content });
      addPost(
        { feedRoom: feedId, publisher: userId, content },
        {
          onSuccess: () => {
            setFeedInputs({
              attachmentContent: "",
              emojiContent: "",
              textContent: "",
            });
            queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
          },
          onError: (err) => console.log(err),
        },
      );
    });
    return () => {
      chatManWebSocket.off(wsEventsKeys.newFeedPost);
    };
  }, [chatManWebSocket]);
  return { handleCreateFeedPost };
}

export default useFeedsMessages;

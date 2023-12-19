import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { addReaction, deleteReaction } from "../services/posts.api";

function useAddReaction({
  token,
  postId,
  initialReactions = [],
}: {
  initialReactions: User[];
  postId: string;
  token: string | null;
}) {
  const [reactions, setReactions] = useState<User[]>([...initialReactions]);
  const { mutate: sendReaction } = useMutation({
    mutationKey: ["add-reaction"],
    mutationFn: ({ postId, token }: { postId: string; token: string }) =>
      addReaction({ postId, token }),
  });
  const { mutate: sendDeleteReaction } = useMutation({
    mutationKey: ["delete-reaction"],
    mutationFn: ({ postId, token }: { postId: string; token: string }) =>
      deleteReaction({ postId, token }),
  });

  function handleAddReaction(user: User | null) {
    if (user) {
      setReactions((reaction) => {
        const isExists = reaction.findIndex(
          (reactUser) => reactUser._id === user._id,
        );
        if (isExists !== -1) {
          const newReactions = reaction.filter(
            (reactUser) => reactUser._id !== user._id,
          );
          if (token !== null) {
            sendDeleteReaction({ postId, token });
          }
          return newReactions;
        }
        if (token !== null) {
          sendReaction({ postId, token });
        }
        return [...reaction, user];
      });
    }
  }

  return { handleAddReaction, reactions, reactionsLength: reactions.length };
}

export default useAddReaction;

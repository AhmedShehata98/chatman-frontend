import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { addComment } from "../services/posts.api";

function useComments({ initialComments }: { initialComments: Comments[] }) {
  const [comments, setComments] = useState<Comments[] | []>(initialComments);
  const [currentCommentId, setCurrentCommentId] = useState("");
  const {
    mutate: sendComment,
    isPending: isPendingComment,
    isError: errorSendComment,
  } = useMutation({
    mutationKey: ["add-comment"],
    mutationFn: (comment: CreateComment) => addComment(comment),
  });
  const handleAddComment = (comment: Comments) => {
    setComments((prevComment) => [...prevComment, comment]);
    const data = {
      commentUser: comment.commentUser._id,
      comment: comment.comment,
      postId: comment.postId._id,
    };

    setCurrentCommentId(comment._id);
    sendComment(data, { onSuccess: (data) => console.log(data) });
  };
  const handleReSendComment = (comment: CreateComment) => {
    sendComment(comment, { onSuccess: (data) => console.log(data) });
  };

  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      if (comments.length <= 0) {
        setComments(initialComments);
        console.count("set comments");
      }
    }
  }, [initialComments]);

  return {
    handleAddComment,
    handleReSendComment,
    comments,
    errorSendComment,
    isPendingComment,
    currentCommentId,
  };
}

export default useComments;

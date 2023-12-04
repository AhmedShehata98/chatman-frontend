import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getConversationMessages } from "../services/messages.api";
import { useRecoilState } from "recoil";
import { messagesAtom } from "../atoms/messages.atom";

function useGetChatMessages({ conversationId }: { conversationId: string }) {
  const {
    data,
    isFetched: isFetchedChatsMessages,
    isLoading: isLoadingChatsMessages,
  } = useQuery({
    queryKey: ["chat-messages", conversationId],
    queryFn: () => getConversationMessages(conversationId),
    enabled: conversationId !== null && conversationId !== undefined,
  });

  const [chatMessages, setChatMessages] = useRecoilState(messagesAtom);

  function addNewMessage(message: Message) {
    setChatMessages((currMsg) => ({ ...currMsg, message }));
  }
  useEffect(() => {
    if (isFetchedChatsMessages && data) {
      setChatMessages(data);
    }
  }, [data, isFetchedChatsMessages, isLoadingChatsMessages]);

  return {
    isLoadingChatsMessages,
    isFetchedChatsMessages,
    chatMessages,
    addNewMessage,
  };
}

export default useGetChatMessages;

import { Outlet } from "react-router-dom";
import ChatLayout from "../layout/ChatLayout";
import ConversationList from "../components/ConversationList";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { useQuery } from "@tanstack/react-query";
import { userConversations } from "../services/conversation.api";
import { useEffect } from "react";
import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";

const ChatPage = () => {
  const { user: me, token } = useRecoilValue(authStateAtom);
  const {
    data: conversationData,
    isFetched: isFetchedConversationData,
    isLoading: isLoadingConversationData,
    refetch: refetchConversationData,
  } = useQuery({
    queryKey: ["conversation", token],
    queryFn: () => userConversations(token as string),
    refetchInterval: 2000,
    enabled: token !== null,
  });

  useEffect(() => {
    chatManWebSocket.on(wsEventsKeys.createdConversation, (_conversationId) => {
      refetchConversationData();
    });
    console.log("first conversation");

    return () => {
      chatManWebSocket.off(wsEventsKeys.createdConversation);
    };
  }, [chatManWebSocket]);

  return (
    <ChatLayout
      conversationElement={
        <ConversationList
          conversationData={conversationData!}
          isFeatured={isFetchedConversationData}
          isLoading={isLoadingConversationData}
          userId={me?._id!}
        />
      }
    >
      <Outlet />
    </ChatLayout>
  );
};

export default ChatPage;

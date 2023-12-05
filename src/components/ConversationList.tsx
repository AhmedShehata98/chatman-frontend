import UserConversationCard from "./UserConversationCard";
import Avatar from "./Avatar";
import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";
import { useNavigate } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import { useSetRecoilState } from "recoil";
import { conversationAtom } from "../atoms/conversation.atom";
import { useCallback } from "react";
import clsx from "clsx";

type Props = {
  conversationData: Conversation[];
  isFeatured: boolean;
  isLoading: boolean;
  userId: string;
};
function ConversationList({
  conversationData,
  userId,
  isFeatured,
  isLoading,
}: Props) {
  const navigator = useNavigate();
  const setConversationData = useSetRecoilState(conversationAtom);

  function startConversation(conversationId: string) {
    chatManWebSocket.emit(wsEventsKeys.joinConversation, conversationId);
    chatManWebSocket.off(wsEventsKeys.joinConversation);
  }
  const handleJoinConversation = (conversation: Conversation) => {
    // start conversation
    startConversation(conversation._id);

    // show conversation UI Elements
    navigator(`${ROUTES_LIST.chatRoom}/${conversation._id}`);

    //
    setConversationData(conversation);
  };

  const formatDate = useCallback(
    (date: string) => {
      if (date) {
        return Intl.DateTimeFormat("en-EG", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(date));
      } else {
        return date;
      }
    },
    [conversationData],
  );

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <div
        className={`${clsx(
          isLoading
            ? "h-auto translate-y-0 opacity-100"
            : "pointer-events-none h-0 -translate-y-20 opacity-0 ",
        )} flex w-full flex-col items-center overflow-hidden transition-all duration-500`}
      >
        <span
          className={`inline-block h-14 w-14 animate-spin rounded-full border-4 border-secondary-100 border-l-transparent`}
        ></span>
      </div>
      <ul className="conversation-list">
        {isFeatured &&
          conversationData?.map((conversation) => {
            const userTargetIdx = conversation.participants.findIndex(
              (usr) => usr._id !== userId,
            );
            return (
              <UserConversationCard
                key={conversation._id}
                onClick={() => handleJoinConversation(conversation)}
              >
                <Avatar
                  status={conversation.participants?.[userTargetIdx].status}
                  showStatus
                  className="h-14 w-14"
                  src={
                    conversation.participants?.[userTargetIdx]
                      .profilePictureUrl || null
                  }
                  fullName={
                    conversation.participants?.[userTargetIdx].fullName || "N A"
                  }
                />
                <div className="flex  flex-grow flex-col items-start justify-start gap-2">
                  <span className="flex w-full items-center justify-between gap-2">
                    <UserConversationCard.userName
                      fullName={
                        conversation.participants?.[userTargetIdx].fullName ||
                        "NA-NA"
                      }
                    />
                    <UserConversationCard.UserChatDate
                      messageDate={conversation.createdAt}
                    />
                  </span>
                  <UserConversationCard.LastMessage
                    lastMessage={
                      formatDate(conversation?.lastMessage) || "NA-NA"
                    }
                  />
                </div>
              </UserConversationCard>
            );
          })}
      </ul>
    </div>
  );
}

export default ConversationList;

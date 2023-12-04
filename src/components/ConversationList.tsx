import UserConversationCard from "./UserConversationCard";
import Avatar from "./Avatar";
import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";
import { useNavigate } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import { useSetRecoilState } from "recoil";
import { conversationAtom } from "../atoms/conversation.atom";

type Props = {
  conversationData: Conversation[];
  isFeatured: boolean;
  userId: string;
};
function ConversationList({ conversationData, userId }: Props) {
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

  return (
    <ul className="flex max-h-full max-w-full flex-col items-start justify-start gap-2 ">
      {conversationData?.map((conversation) => {
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
                conversation.participants?.[userTargetIdx].profilePictureUrl ||
                null
              }
              fullName={
                conversation.participants?.[userTargetIdx].fullName || "N A"
              }
            />
            <div className="flex max-w-[calc(100%-6rem)] flex-grow flex-col items-start justify-start gap-2">
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
                lastMessage={conversation?.lastMessage || "NA-NA"}
              />
            </div>
          </UserConversationCard>
        );
      })}
    </ul>
  );
}

export default ConversationList;

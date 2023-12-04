import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";

function useJoinConversation() {
  const startJoinConversation = ({
    conversationId,
    receiverId,
  }: {
    receiverId: string;
    conversationId: string;
  }) => {
    chatManWebSocket.emit(wsEventsKeys.joinConversation, {
      conversationId,
      receiverId,
    });
    chatManWebSocket.off(wsEventsKeys.joinConversation);
  };

  return { startJoinConversation };
}

export default useJoinConversation;

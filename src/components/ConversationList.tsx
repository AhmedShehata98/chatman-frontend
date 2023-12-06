import UserConversationCard from "./UserConversationCard";
import Avatar from "./Avatar";
import { chatManWebSocket } from "../services/ws";
import { wsEventsKeys } from "../constants/wsConstants";
import { useNavigate } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationAtom } from "../atoms/conversation.atom";
import { useCallback } from "react";
import clsx from "clsx";
import { authStateAtom } from "../atoms/login.atom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearMessages } from "../services/messages.api";
import { deleteConversation } from "../services/conversation.api";

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
  const { user: me } = useRecoilValue(authStateAtom);
  const { mutate: mutateClearMessages } = useMutation({
    mutationKey: ["clear-messages"],
    mutationFn: (conversationId: string) => clearMessages(conversationId),
  });
  const { mutate: mutateDeleteChat } = useMutation({
    mutationKey: ["delete-chat"],
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
  });
  const queryClient = useQueryClient();
  function startConversation(conversationId: string) {
    chatManWebSocket.emit(wsEventsKeys.joinConversation, conversationId);
    chatManWebSocket.off(wsEventsKeys.joinConversation);
  }
  const handleJoinConversation = (conversation: Conversation) => {
    const receiver = conversation.participants.find(
      (participant) => participant._id !== me?._id,
    );
    // start conversation
    startConversation(conversation._id);

    // show conversation UI Elements
    navigator(`${ROUTES_LIST.chatRoom}/${receiver?.username}`, {
      state: conversation._id,
    });

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

  function handleOpenChat(conversation: Conversation) {
    handleJoinConversation(conversation);
  }
  function handleClearMessages(conversation: Conversation) {
    mutateClearMessages(conversation._id, {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["chat-messages"] }),
    });
  }
  function handleDeleteChat(conversation: Conversation) {
    mutateDeleteChat(conversation._id, {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["conversation"] }),
    });
    mutateClearMessages(conversation._id, {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["chat-messages"] }),
    });
  }

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
                onOpenChat={(setShowMenu) => {
                  handleOpenChat(conversation);
                  setShowMenu(false);
                }}
                onClearMessages={(setShowMenu) => {
                  setShowMenu(false);
                  handleClearMessages(conversation);
                }}
                onDeleteChat={(setShowMenu) => {
                  setShowMenu(false);
                  handleDeleteChat(conversation);
                }}
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
                  onClick={() => handleJoinConversation(conversation)}
                />

                <div className="flex w-full max-w-[calc(100%-8rem)] flex-col items-start justify-start gap-2">
                  <span className="flex w-full max-w-full items-center justify-between gap-2">
                    <UserConversationCard.userName
                      fullName={
                        conversation.participants?.[userTargetIdx].fullName ||
                        "NA-NA"
                      }
                      onClick={() => handleJoinConversation(conversation)}
                    />
                    <UserConversationCard.UserChatDate
                      messageDate={formatDate(conversation.createdAt)}
                    />
                  </span>
                  <UserConversationCard.LastMessage
                    lastMessage={conversation?.lastMessage?.message ?? "NA-NA"}
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

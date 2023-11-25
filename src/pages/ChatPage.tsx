import { useState } from "react";
import UsersMenuHeader from "../components/UsersMenuHeader";
import UserConversationCard from "../components/UserConversationCard";
import ChatHeader from "../components/ChatHeader";
import ChatFooter from "../components/ChatFooter";
import ChatBody from "../components/ChatBody";
import background from "../assets/background.jpg";
import Avatar from "../components/Avatar";
import { useQueryClient } from "@tanstack/react-query";

import { chatManWebSocket } from "../services/ws";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationAtom } from "../atoms/conversation.atom";
import { authStateAtom } from "../atoms/login.atom";
// import { useLoaderData } from "react-router-dom";

const ChatPage = () => {
  const [showConversationRoom, setShowConversationRoom] = useState(false);
  const [conversationData, setConversationData] =
    useRecoilState(conversationAtom);
  const { user } = useRecoilValue(authStateAtom);
  const queryClient = useQueryClient();

  function startConversation(conversationId: string) {
    chatManWebSocket.emit("join-room", {
      roomId: conversationId,
    });
    chatManWebSocket.off("join-room");
  }

  const handleConversation = ({
    user,
    conversation,
  }: {
    user: Partial<User>;
    conversation: Conversation;
  }) => {
    // store room data
    setConversationData({ user, conversation });

    // start conversation
    startConversation(conversation._id);

    // show conversation UI Elements
    setShowConversationRoom(true);

    // refetch conversation messages
    queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
  };

  return (
    <article className="flex h-[calc(100dvh-60px)] max-h-[calc(100dvh-60px)] w-full items-start justify-start divide-x divide-slate-800">
      <div className="flex h-full w-1/3 min-w-[33.3%] flex-col items-start justify-start bg-[#111B21]">
        <UsersMenuHeader
          title="chats"
          onCreateNewChat={() => {
            console.log("create chat");
          }}
          onFilter={() => {
            console.log("create chat");
          }}
        />
        <div className="mt-4 max-h-full w-full flex-grow overflow-y-auto px-6">
          <h3 className="px-3xl mb-5 px-3 text-3xl font-semibold capitalize text-white">
            conversation
          </h3>
          <ul className="flex max-h-full max-w-full flex-col items-start justify-start gap-2 ">
            {user
              ? user.contacts.map(({ _id, conversation, user }) => (
                  <UserConversationCard
                    key={_id}
                    onClick={() => handleConversation({ conversation, user })}
                  >
                    <Avatar
                      isOnline={user.isOnline}
                      showStatus={false}
                      className="h-14 w-14"
                      src={user.profileImg || null}
                      fullName={user.fullName || "N A"}
                    />
                    <div className="flex max-w-[calc(100%-6rem)] flex-grow flex-col items-start justify-start gap-2">
                      <span className="flex w-full items-center justify-between gap-2">
                        <UserConversationCard.userName
                          fullName={user.fullName || "NA-NA"}
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
                ))
              : null}
          </ul>
        </div>
      </div>
      {showConversationRoom && (
        <div
          style={{ backgroundImage: `url(${background})` }}
          className="relative flex h-full w-full flex-col items-start justify-start bg-cover bg-no-repeat"
        >
          <ChatHeader
            userLabel={
              <ChatHeader.UserLabel
                img={null}
                isOnline={conversationData?.user.isOnline as boolean}
                fullName={conversationData?.user.fullName || "NA-NA"}
                lastActivityDate={Intl.DateTimeFormat("en-EG", {
                  dateStyle: "short",
                }).format(new Date())}
              />
            }
            callButtons={<ChatHeader.CallButtons />}
            searchButton={<ChatHeader.SearchButton />}
          />
          <ChatBody />
          <ChatFooter
            emojiButton={<ChatFooter.EmojiButton />}
            attachmentButton={<ChatFooter.AttachmentButton />}
            messageInput={<ChatFooter.MessageInput />}
            sendButton={<ChatFooter.SendButton />}
            voiceButton={<ChatFooter.VoiceButton />}
          />
        </div>
      )}
    </article>
  );
};

export default ChatPage;

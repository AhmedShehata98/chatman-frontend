import ChatHeader from "../components/ChatHeader";
import ChatFooter from "../components/ChatFooter";
import ChatBody from "../components/ChatBody";
import background from "../assets/background.jpg";
import { useRecoilValue } from "recoil";
import { conversationAtom } from "../atoms/conversation.atom";
import { authStateAtom } from "../atoms/login.atom";

function ChatRoom() {
  const conversationData = useRecoilValue(conversationAtom);
  const { user: me } = useRecoilValue(authStateAtom);
  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="relative flex h-full w-full flex-col items-start justify-start bg-cover bg-no-repeat"
    >
      <ChatHeader
        userLabel={
          <ChatHeader.UserLabel
            img={
              conversationData?.participants.find(
                (participant) => participant._id !== me?._id,
              )?.profilePictureUrl || null
            }
            status={
              conversationData?.participants.find(
                (participant) => participant._id !== me?._id,
              )?.status!
            }
            fullName={
              conversationData?.participants.find(
                (participant) => participant._id !== me?._id,
              )?.fullName || "NA-NA"
            }
            lastSeenDate={Intl.DateTimeFormat("en-EG", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(
              conversationData?.participants.find(
                (participant) => participant._id !== me?._id,
              )?.lastSeenDate,
            )}
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
  );
}

export default ChatRoom;

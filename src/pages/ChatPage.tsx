import { Outlet, useLoaderData } from "react-router-dom";
import ChatLayout from "../layout/ChatLayout";
import ConversationList from "../components/ConversationList";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";

const ChatPage = () => {
  const conversationsData = useLoaderData() as Conversation[];
  const { user: me } = useRecoilValue(authStateAtom);

  return (
    <ChatLayout
      conversationElement={
        <ConversationList
          conversationData={conversationsData!}
          isFeatured={conversationsData && Array.isArray(conversationsData)}
          userId={me?._id!}
        />
      }
    >
      <Outlet />
    </ChatLayout>
  );
};

export default ChatPage;

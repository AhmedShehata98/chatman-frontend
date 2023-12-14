import { Outlet } from "react-router-dom";
import ChatLayout from "../layout/ChatLayout";
import ConversationList from "../components/ConversationList";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { useQuery } from "@tanstack/react-query";
import { userConversations } from "../services/conversation.api";
import { useState, useMemo } from "react";
import Portal from "../components/Portal";
import AddNewUserModal from "../components/AddNewUserModal";
import { searchOnContactsAtom } from "../atoms/app.atom";

const ChatPage = () => {
  const [showSearchModal, setIsShowSearchModal] = useState(false);
  const { user: me, token } = useRecoilValue(authStateAtom);
  const searchOnContactsQuery = useRecoilValue(searchOnContactsAtom);

  const {
    data: conversationData,
    isFetched: isFetchedConversationData,
    isLoading: isLoadingConversationData,
  } = useQuery({
    queryKey: ["conversation", token, searchOnContactsQuery],
    queryFn: () =>
      userConversations({ q: searchOnContactsQuery, token: token as string }),
    refetchInterval: () => (searchOnContactsQuery !== "" ? false : 3000),
    enabled: token !== null,
  });

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
      conversationHeader={
        <ChatLayout.UsersMenuHeader
          onCreateNewChat={() => setIsShowSearchModal(true)}
          onFilter={() => {}}
          title="conversations"
        />
      }
    >
      {showSearchModal && (
        <Portal>
          <AddNewUserModal setShowModal={setIsShowSearchModal} />
        </Portal>
      )}
      <Outlet />
    </ChatLayout>
  );
};

export default ChatPage;

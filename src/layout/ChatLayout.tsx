import { ReactNode } from "react";
import UsersMenuHeader from "../components/UsersMenuHeader";

function ChatLayout({
  children,
  conversationElement,
}: {
  children: ReactNode;
  conversationElement: ReactNode;
}) {
  return (
    <article className="chat-page">
      <div className="chat-page__conversation-wrapper">
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
          {conversationElement}
        </div>
      </div>
      {children}
    </article>
  );
}

export default ChatLayout;

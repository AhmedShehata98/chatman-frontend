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
        <div className="mt-4 flex max-h-full w-full flex-grow flex-col justify-start overflow-y-auto px-6 max-md:px-3">
          {conversationElement}
        </div>
      </div>
      {children}
    </article>
  );
}

export default ChatLayout;

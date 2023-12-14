import { ReactNode } from "react";
import UsersMenuHeader from "../components/UsersMenuHeader";

function ChatLayout({
  children,
  conversationElement,
  conversationHeader,
}: {
  children: ReactNode;
  conversationElement: ReactNode;
  conversationHeader: ReactNode;
}) {
  return (
    <article className="chat-page">
      <div className="chat-page__conversation-wrapper">
        {conversationHeader}
        <div className="mt-4 flex max-h-full w-full flex-grow flex-col justify-start overflow-y-auto px-6 max-lg:px-3">
          {conversationElement}
        </div>
      </div>
      <span className="absolute left-[60%] top-1/2 rounded-full bg-primary-200 bg-opacity-50 px-5 py-2 text-lg capitalize text-white max-lg:hidden">
        <p>select chat conversation to start talking..</p>
      </span>
      {children}
    </article>
  );
}

export default ChatLayout;
ChatLayout.UsersMenuHeader = UsersMenuHeader;

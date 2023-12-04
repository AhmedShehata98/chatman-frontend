import clsx from "clsx";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import useGetChatMessages from "../hooks/useGetChatMessages";
import { conversationAtom } from "../atoms/conversation.atom";
import MessageCard from "./MessageCard";
import { useEffect, useRef } from "react";

function ChatBody() {
  const messagesRef = useRef<HTMLUListElement | null>(null);
  const messagesWrapperRef = useRef<HTMLDivElement | null>(null);
  const targetConversation = useRecoilValue(conversationAtom);
  const { isLoadingChatsMessages, isFetchedChatsMessages, chatMessages } =
    useGetChatMessages({
      conversationId: targetConversation?._id as string,
    });
  const { user: me } = useRecoilValue(authStateAtom);
  useEffect(() => {
    if (messagesRef.current && messagesWrapperRef.current)
      messagesWrapperRef.current?.scrollBy({
        behavior: "smooth",
        top: messagesRef.current?.scrollHeight,
      });
  }, [messagesRef.current?.scrollHeight]);

  return (
    <div
      ref={messagesWrapperRef}
      className="flex h-[calc(100dvh-65px-85px)] max-h-[100dvh] w-full flex-grow flex-col gap-7 overflow-y-auto px-6 py-5 "
    >
      <ul
        className={`${clsx(
          isLoadingChatsMessages && "hidden",
        )} flex w-full flex-col items-end justify-end gap-2 even:self-end`}
        ref={messagesRef}
      >
        {isFetchedChatsMessages
          ? chatMessages?.map((message) => (
              <MessageCard me={me} message={message} />
            ))
          : null}
        {isLoadingChatsMessages && (
          <div className="flex h-full min-h-full w-full flex-col items-center justify-start gap-2">
            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3">
              <span className="flex h-16 w-16 animate-spin rounded-full border-4 border-[#12A476] border-l-[#202C33]"></span>
              <p className="text-lg uppercase text-zinc-300">
                getting Conversation messages ...
              </p>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

export default ChatBody;

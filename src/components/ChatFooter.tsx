import {
  ReactNode,
  FormEvent,
  useEffect,
  ChangeEvent,
  useRef,
  useState,
} from "react";
import { chatManWebSocket } from "../services/ws";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationAtom } from "../atoms/conversation.atom";
import { authStateAtom } from "../atoms/login.atom";
import { messageContentAtom, messagesAtom } from "../atoms/messages.atom";
import { wsEventsKeys } from "../constants/wsConstants";
import clsx from "clsx";

type Props = {
  emojiButton?: ReactNode;
  attachmentButton?: ReactNode;
  sendButton?: ReactNode;
  voiceButton?: ReactNode;
  messageInput?: ReactNode;
};
function ChatFooter({
  attachmentButton,
  emojiButton,
  messageInput,
  sendButton, // voiceButton,
}: Props) {
  const targetRoom = useRecoilValue(conversationAtom);
  const moreMessageOptionsRef = useRef<HTMLDivElement | null>(null);
  const [showMoreMessageOptions, setShowMoreMessageOptions] = useState(false);
  const { user: me } = useRecoilValue(authStateAtom);
  const [messageContent, setMessageContent] =
    useRecoilState(messageContentAtom);
  const setMessagesAtom = useSetRecoilState(messagesAtom);

  const handleIncomingMessage = (message: Message) => {
    setMessagesAtom((currMsg) => [...currMsg, message]);
  };

  function sendMessage(messageData: {
    conversationId: string;
    sender: string;
    message: string;
    media?: string;
  }) {
    chatManWebSocket.emit(wsEventsKeys.message, {
      createdAt: Date.now(),
      ...messageData,
    });
    chatManWebSocket.off(wsEventsKeys.message);
  }
  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    const target = ev.target as HTMLFormElement;
    ev.preventDefault();
    // const fd = new FormData(ev.currentTarget);

    if (targetRoom === null)
      throw new Error(`expected room data but got: ${targetRoom}`);
    if (me === null) throw new Error(`expected user id but got: ${targetRoom}`);

    sendMessage({
      conversationId: targetRoom._id as string,
      sender: me._id,
      message: messageContent.message,
    });

    target.reset();
    setMessageContent({ media: "", message: "" });
  };

  useEffect(() => {
    chatManWebSocket.on(wsEventsKeys.incomingMessage, handleIncomingMessage);
    return () => {
      chatManWebSocket.off(wsEventsKeys.incomingMessage);
    };
  }, [handleIncomingMessage, chatManWebSocket]);

  useEffect(() => {
    const handleCloseMenu = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      const bounds = moreMessageOptionsRef.current?.getBoundingClientRect();
      if (!bounds || !target) return;
      if (
        target.clientWidth > bounds.x ||
        target.clientWidth < bounds.x ||
        target.clientHeight < bounds.y ||
        target.clientHeight > bounds.y
      ) {
        setShowMoreMessageOptions(false);
      }
    };
    document.addEventListener("mousedown", handleCloseMenu);
    return () => {
      document.removeEventListener("mousedown", handleCloseMenu);
    };
  }, []);
  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex h-[65px] w-full max-w-full items-center justify-start gap-4 bg-primary-100 px-3 py-2 max-lg:gap-2"
    >
      <button
        type="button"
        onClick={() => setShowMoreMessageOptions((p) => !p)}
        className="rounded-md bg-slate-600 px-3 py-1.5 text-2xl text-white hover:text-secondary-100 focus:text-secondary-100 md:hidden"
      >
        <i className="fi fi-rr-apps-add"></i>
      </button>
      <div
        ref={moreMessageOptionsRef}
        className={`flex items-center justify-center gap-3 rounded-md bg-inherit transition-transform duration-500 max-md:absolute max-md:-top-16 max-md:left-4 ${clsx(
          showMoreMessageOptions
            ? "max-md:translate-y-0 max-md:opacity-100"
            : "max-md:translate-y-6 max-md:opacity-0",
        )}`}
      >
        {emojiButton}
        {attachmentButton}
      </div>
      {messageInput}
      <div className="flex items-center justify-center">
        {sendButton}
        {/* {voiceButton} */}
      </div>
    </form>
  );
}

export default ChatFooter;

const EmojiButton = () => {
  return (
    <button
      type="button"
      className="flex items-center justify-center rounded-md p-3 text-2xl text-zinc-200 hover:bg-zinc-700 hover:bg-opacity-60 max-lg:text-lg"
    >
      <i className="fi fi-rr-grin-alt"></i>
    </button>
  );
};
const AttachmentButton = () => {
  return (
    <button
      type="button"
      className="flex items-center justify-center rounded-md p-3 text-2xl text-zinc-200 hover:bg-zinc-700 hover:bg-opacity-60 max-lg:text-lg"
    >
      <i className="fi fi-rr-clip"></i>
    </button>
  );
};
const SendButton = () => {
  return (
    <button
      type="submit"
      className="flex aspect-square w-12 items-center justify-center rounded-full bg-secondary-100 text-2xl text-black hover:bg-secondary-200 hover:bg-opacity-60 hover:text-zinc-300 max-lg:text-lg max-md:w-10"
    >
      <i className="fi fi-rr-paper-plane-top inline-block -rotate-45 transition-transform hover:-translate-y-2 hover:translate-x-2"></i>
    </button>
  );
};
const VoiceButton = () => {
  return (
    <button
      type="button"
      className="flex items-center justify-center rounded-md p-3 text-2xl text-zinc-200 hover:bg-zinc-700 hover:bg-opacity-60 max-lg:text-lg"
    >
      <i className="fi fi-rr-circle-microphone"></i>
    </button>
  );
};
const MessageInput = () => {
  const { user: me } = useRecoilValue(authStateAtom);
  const conversation = useRecoilValue(conversationAtom);
  const [messageContent, setMessageContent] =
    useRecoilState(messageContentAtom);
  const timeOutRef = useRef(0);

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setMessageContent((currVal) => ({
      ...currVal,
      message: ev.target.value,
    }));
    chatManWebSocket.emit(wsEventsKeys.typing, {
      fullName: me?.fullName,
      conversationId: conversation?._id,
      isTyping: true,
    });
  }
  function handleKeyUp() {
    timeOutRef.current = +setTimeout(() => {
      chatManWebSocket.emit(wsEventsKeys.finishTyping, {
        conversationId: conversation?._id,
        isTyping: false,
      });
    }, 1000);
  }
  useEffect(() => {
    if (timeOutRef.current !== 0) {
      clearTimeout(timeOutRef.current);
    }
  }, [timeOutRef.current]);

  return (
    <input
      type="text"
      name="text-message"
      id="text-message"
      value={messageContent.message}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      autoComplete="off"
      placeholder="type a message"
      className="flex-grow rounded-md border border-primary-200 bg-inherit bg-primary-200 px-3 py-2 text-lg text-white caret-slate-400 placeholder:capitalize focus:outline-none focus:brightness-150"
    />
  );
};

ChatFooter.EmojiButton = EmojiButton;
ChatFooter.AttachmentButton = AttachmentButton;
ChatFooter.MessageInput = MessageInput;
ChatFooter.SendButton = SendButton;
ChatFooter.VoiceButton = VoiceButton;

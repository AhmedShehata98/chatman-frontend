import {
  ReactNode,
  FormEvent,
  useEffect,
  useState,
  ChangeEvent,
  useRef,
} from "react";
import { chatManWebSocket } from "../services/ws";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationAtom } from "../atoms/conversation.atom";
import { authStateAtom } from "../atoms/login.atom";
import { messagesAtom } from "../atoms/messages.atom";
import { wsEventsKeys } from "../constants/wsConstants";

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
  sendButton,
} // voiceButton,
: Props) {
  const targetRoom = useRecoilValue(conversationAtom);
  const { user: me } = useRecoilValue(authStateAtom);
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
    const fd = new FormData(ev.currentTarget);
    const textMessage = fd.get("text-message") as string;

    if (targetRoom === null)
      throw new Error(`expected room data but got: ${targetRoom}`);
    if (me === null) throw new Error(`expected user id but got: ${targetRoom}`);

    sendMessage({
      conversationId: targetRoom._id as string,
      sender: me._id,
      message: textMessage,
    });

    target.reset();
  };

  useEffect(() => {
    chatManWebSocket.on(wsEventsKeys.incomingMessage, handleIncomingMessage);
    return () => {
      chatManWebSocket.off(wsEventsKeys.incomingMessage);
    };
  }, [handleIncomingMessage, chatManWebSocket]);

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-0 flex w-full items-center justify-start gap-4 bg-[#111B21] px-5 py-2"
    >
      <div className="flex items-center justify-center gap-3">
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
      className="flex h-12 w-12 items-center justify-center rounded-md text-2xl text-zinc-200 hover:bg-zinc-700 hover:bg-opacity-60"
    >
      <i className="fi fi-rr-grin-alt"></i>
    </button>
  );
};
const AttachmentButton = () => {
  return (
    <button
      type="button"
      className="flex h-12 w-12 items-center justify-center rounded-md text-2xl text-zinc-200 hover:bg-zinc-700 hover:bg-opacity-60"
    >
      <i className="fi fi-rr-clip"></i>
    </button>
  );
};
const SendButton = () => {
  return (
    <button
      type="submit"
      className="flex h-12 w-12 items-center justify-center rounded-md text-2xl text-zinc-200 hover:bg-zinc-700 hover:bg-opacity-60"
    >
      <i className="fi fi-rr-paper-plane-top"></i>
    </button>
  );
};
const VoiceButton = () => {
  return (
    <button
      type="button"
      className="flex h-12 w-12 items-center justify-center rounded-md text-2xl text-zinc-200 hover:bg-zinc-700 hover:bg-opacity-60"
    >
      <i className="fi fi-rr-circle-microphone"></i>
    </button>
  );
};
const MessageInput = () => {
  const { user: me } = useRecoilValue(authStateAtom);
  const conversation = useRecoilValue(conversationAtom);
  const timeOutRef = useRef(0);
  const [textMessage, setTextMessage] = useState("");

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setTextMessage(ev.target.value);
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
      value={textMessage}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      autoComplete="off"
      placeholder="type a message"
      className="grow rounded-md bg-inherit px-3 py-3 text-lg text-white caret-slate-400 placeholder:capitalize focus:outline-none focus:brightness-150"
    />
  );
};

ChatFooter.EmojiButton = EmojiButton;
ChatFooter.AttachmentButton = AttachmentButton;
ChatFooter.MessageInput = MessageInput;
ChatFooter.SendButton = SendButton;
ChatFooter.VoiceButton = VoiceButton;

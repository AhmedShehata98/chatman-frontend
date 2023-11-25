import { ReactNode, FormEvent, useEffect, useState, ChangeEvent } from "react";
import { chatManWebSocket } from "../services/ws";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationAtom } from "../atoms/conversation.atom";
import { authStateAtom } from "../atoms/login.atom";
import { messagesAtom } from "../atoms/messages.atom";

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
  voiceButton,
}: Props) {
  const targetRoom = useRecoilValue(conversationAtom);
  const { user: me } = useRecoilValue(authStateAtom);
  const setMessagesAtom = useSetRecoilState(messagesAtom);

  const handleIncomingMessage = (message: Message) => {
    setMessagesAtom((currMsg) => [...currMsg, message]);
  };

  function sendMessage({
    message,
    senderId,
    conversationId,
  }: {
    conversationId: string;
    senderId: string;
    message: string;
  }) {
    chatManWebSocket.emit("message", {
      conversationId,
      senderId,
      message,
    });
    chatManWebSocket.off("message");
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
      conversationId: targetRoom.conversation._id as string,
      senderId: me._id,
      message: textMessage,
    });

    target.reset();
  };

  useEffect(() => {
    chatManWebSocket.on("incoming-message", handleIncomingMessage);
    return () => {
      chatManWebSocket.off("incoming-message");
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
  const [textMessage, setTextMessage] = useState("");
  const conversation = useRecoilValue(conversationAtom);
  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setTextMessage(ev.target.value);
    chatManWebSocket.emit("typing", {
      conversationId: conversation?.conversation._id,
    });
  };
  const handleStopTyping = () => {
    chatManWebSocket.off("typing");
  };

  return (
    <input
      type="text"
      name="text-message"
      id="text-message"
      autoComplete="off"
      placeholder="type a message"
      onChange={handleChange}
      onKeyUp={handleStopTyping}
      value={textMessage}
      className="grow rounded-md bg-inherit px-3 py-3 text-lg text-white caret-slate-400 placeholder:capitalize focus:outline-none focus:brightness-150"
    />
  );
};

ChatFooter.EmojiButton = EmojiButton;
ChatFooter.AttachmentButton = AttachmentButton;
ChatFooter.MessageInput = MessageInput;
ChatFooter.SendButton = SendButton;
ChatFooter.VoiceButton = VoiceButton;

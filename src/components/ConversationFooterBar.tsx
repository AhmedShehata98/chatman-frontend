import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import clsx from "clsx";
import { feedInputsAtom } from "../atoms/feed.atom";

function ConversationFooterBar({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: React.FormEventHandler;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="relative z-10 flex h-20 w-full max-w-full items-center justify-start gap-2 bg-primary-300 px-2"
    >
      {children}
    </form>
  );
}

const EmojiButton = ({ onClick }: { onClick: React.MouseEventHandler }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center rounded-md p-3 text-2xl leading-3 text-zinc-200 hover:bg-secondary-100 hover:bg-opacity-30 hover:brightness-125 max-lg:text-lg"
    >
      <i className="fi fi-rr-grin-alt"></i>
    </button>
  );
};
const EmojisList = ({ show }: { show: boolean }) => {
  const setEmojiContent = useSetRecoilState(feedInputsAtom);
  return (
    <div className={`${clsx({ hidden: !show })} absolute bottom-28 left-3`}>
      <EmojiPicker
        lazyLoadEmojis
        theme={Theme.DARK}
        emojiStyle={EmojiStyle.TWITTER}
        onEmojiClick={(data) =>
          setEmojiContent((currVal) => ({
            ...currVal,
            emojiContent: data.emoji,
          }))
        }
      />
    </div>
  );
};
const AttachmentButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center rounded-md p-3 text-2xl leading-3 text-zinc-200 hover:bg-secondary-100 hover:bg-opacity-30 hover:brightness-125 max-lg:text-lg"
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
  const [{ textContent }, setTextContent] = useRecoilState(feedInputsAtom);

  return (
    <input
      type="text"
      name="text-message"
      id="text-message"
      autoComplete="off"
      placeholder="type a message"
      value={textContent}
      onChange={(ev) =>
        setTextContent((currVal) => ({
          ...currVal,
          textContent: ev.target.value,
        }))
      }
      className="flex-grow rounded-md border border-primary-200 bg-inherit bg-primary-200 px-3 py-2 text-lg text-white caret-slate-400 placeholder:capitalize focus:outline-none focus:brightness-150"
    />
  );
};

ConversationFooterBar.EmojiButton = EmojiButton;
ConversationFooterBar.AttachmentButton = AttachmentButton;
ConversationFooterBar.SendButton = SendButton;
ConversationFooterBar.VoiceButton = VoiceButton;
ConversationFooterBar.MessageInput = MessageInput;
ConversationFooterBar.EmojisList = EmojisList;

export default ConversationFooterBar;

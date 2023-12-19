import React, { ChangeEvent, MouseEventHandler, forwardRef } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import clsx from "clsx";

function ConversationFooterBar({ children }: { children: React.ReactNode }) {
  return (
    <form className="relative z-10 flex h-20 w-full max-w-full items-center justify-start gap-2 bg-primary-300 px-2">
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
const EmojisList = ({
  show,
  setEmoji,
}: {
  show: boolean;
  setEmoji: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className={`${clsx({ hidden: !show })} absolute bottom-28 left-3`}>
      <EmojiPicker
        lazyLoadEmojis
        theme={Theme.DARK}
        emojiStyle={EmojiStyle.TWITTER}
        onEmojiClick={(data) =>
          setEmoji((currVal) => currVal.concat(data.emoji))
        }
      />
    </div>
  );
};
const AttachmentButton = ({
  onClick,
  setAttachmentContent,
}: {
  onClick: React.MouseEventHandler;
  setAttachmentContent: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const handleUploadGetImage = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (!files || files.length <= 0) return;

    setAttachmentContent(files[0]);
  };
  return (
    <>
      <label
        htmlFor="attachment-input"
        onClick={onClick}
        className="flex cursor-pointer items-center justify-center rounded-md p-3 text-2xl leading-3 text-zinc-200 hover:bg-secondary-100 hover:bg-opacity-30 hover:brightness-125 max-lg:text-lg"
      >
        <i className="fi fi-rr-clip"></i>
      </label>
      <input
        type="file"
        hidden
        name="attachment-input"
        id="attachment-input"
        onChange={handleUploadGetImage}
      />
    </>
  );
};

type AttachmentPreviewType = {
  attachment: File | null;
  isLoading: boolean;
  isSuccess: boolean;
  onRemoveAttachment: () => void;
  onStartUpload: () => void;
};
const AttachmentPreview = forwardRef<HTMLDivElement, AttachmentPreviewType>(
  (
    { attachment, isLoading, isSuccess, onRemoveAttachment, onStartUpload },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`${clsx({
          "pointer-events-none -translate-y-12 opacity-0": !attachment,
        })} absolute bottom-24 left-3 w-[22rem] min-w-[22rem] rounded-md bg-secondary-100 p-2 shadow-lg transition-all duration-500 max-lg:w-2/3 max-md:w-10/12`}
      >
        {attachment && (
          <figure
            className={`${clsx({
              "animate-pulse opacity-50 grayscale": isLoading,
            })} relative w-full after:absolute after:-bottom-10 after:h-9 after:w-9 after:border-[1.0rem] after:border-transparent after:border-t-secondary-100 after:shadow-lg after:content-['']`}
          >
            <span
              className={`${clsx({
                hidden: isSuccess,
              })} absolute left-0 top-2 flex items-center justify-start gap-3 p-2`}
            >
              <button
                type="button"
                className="aspect-square rounded-full bg-red-600 p-3 text-lg leading-3 text-white shadow-md"
                onClick={onRemoveAttachment}
              >
                <i className="fi fi-rs-trash"></i>
              </button>
              <button
                type="button"
                className="aspect-square rounded-full bg-sky-700 p-3 text-lg leading-3 text-white shadow-md"
                onClick={onStartUpload}
              >
                <i className="fi fi-rr-check-circle"></i>
              </button>
            </span>
            <img
              src={URL.createObjectURL(attachment ?? undefined)}
              alt="attachment-image"
              className="max-w-full object-cover object-center"
            />
          </figure>
        )}
      </div>
    );
  },
);
const SendButton = ({
  onClick,
  disabled = false,
}: {
  onClick: MouseEventHandler;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex aspect-square w-12 items-center justify-center rounded-full bg-secondary-100 text-2xl text-black hover:bg-secondary-200 hover:bg-opacity-60 hover:text-zinc-300 disabled:bg-primary-200 disabled:text-zinc-400 max-lg:text-lg max-md:w-10"
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
const MessageInput = ({
  value,
  setTextInput,
}: {
  setTextInput: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}) => {
  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target as HTMLInputElement;
    setTextInput(target.value);
  };
  return (
    <input
      type="text"
      name="text-message"
      id="text-message"
      autoComplete="off"
      placeholder="type a message ..."
      value={value}
      onChange={handleChange}
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
ConversationFooterBar.AttachmentPreview = AttachmentPreview;

export default ConversationFooterBar;

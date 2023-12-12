import React from "react";
import ConversationFooterBar from "./ConversationFooterBar";

function ConversationFooterWrapper({
  onSubmit,
}: {
  onSubmit: React.FormEventHandler;
}) {
  const [showEmoji, setShowEmoji] = React.useState(false);

  return (
    <>
      <ConversationFooterBar onSubmit={onSubmit}>
        <ConversationFooterBar.AttachmentButton onClick={() => {}} />
        <ConversationFooterBar.EmojiButton
          onClick={() => setShowEmoji((p) => !p)}
        />
        <ConversationFooterBar.EmojisList show={showEmoji} />
        <ConversationFooterBar.MessageInput />
        <ConversationFooterBar.SendButton />
      </ConversationFooterBar>
    </>
  );
}

export default ConversationFooterWrapper;

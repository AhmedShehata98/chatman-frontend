import React, { useState } from "react";
import ConversationFooterBar from "./ConversationFooterBar";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../services/upload.api";

export type FormInputType = {
  textContent: string;
  mediaContent: string | undefined;
};
function ConversationFooterWrapper({
  sendData,
}: {
  sendData: (message: FormInputType, cb: Function) => void;
}) {
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [textInput, setTextInput] = useState("");
  const [attachmentContent, setAttachmentContent] = useState<File | null>(null);
  const {
    mutate,
    isPending,
    isSuccess,
    data: uploadedResource,
  } = useMutation({
    mutationKey: ["upload"],
    mutationFn: (file: FormData) => uploadImage(file),
  });

  const handleUploadImage = (file: File | null) => {
    const fd = new FormData();
    if (!file) return;
    fd.set("file", file);
    mutate(fd);
  };

  const handleRemoveAttachment = () => {
    setAttachmentContent(null);
  };

  const resetCallback = () => {
    setTextInput("");
    setAttachmentContent(null);
  };

  return (
    <ConversationFooterBar>
      <ConversationFooterBar.AttachmentButton
        setAttachmentContent={setAttachmentContent}
        onClick={() => {}}
      />
      <ConversationFooterBar.AttachmentPreview
        attachment={attachmentContent}
        isLoading={isPending}
        isSuccess={isSuccess}
        onRemoveAttachment={handleRemoveAttachment}
        onStartUpload={() => handleUploadImage(attachmentContent)}
      />
      <ConversationFooterBar.EmojiButton
        onClick={() => setShowEmoji((p) => !p)}
      />
      <ConversationFooterBar.EmojisList
        show={showEmoji}
        setEmoji={setTextInput}
      />
      <ConversationFooterBar.MessageInput
        setTextInput={setTextInput}
        value={textInput}
      />
      <ConversationFooterBar.SendButton
        onClick={() =>
          sendData(
            {
              textContent: textInput,
              mediaContent: uploadedResource?.secure_url,
            },
            resetCallback,
          )
        }
        disabled={isPending || textInput === ""}
      />
    </ConversationFooterBar>
  );
}

export default ConversationFooterWrapper;

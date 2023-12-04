import { atom } from "recoil";

export const messagesAtom = atom<Message[]>({
  key: "messages",
  default: [],
});

export const messageContentAtom = atom({
  key: "message-content",
  default: {
    message: "",
    media: "",
  },
});

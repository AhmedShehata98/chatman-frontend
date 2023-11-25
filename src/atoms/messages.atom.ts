import { atom } from "recoil";

export const messagesAtom = atom<Message[]>({
  key: "messages",
  default: [],
});

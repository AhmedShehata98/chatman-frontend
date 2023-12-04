import { atom } from "recoil";

export const conversationAtom = atom<Conversation | null>({
  key: "conversation",
  default: null,
});

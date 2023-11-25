import { atom } from "recoil";

export const conversationAtom = atom<{
  user: Partial<User>;
  conversation: Conversation;
} | null>({
  key: "conversation",
  default: null,
});

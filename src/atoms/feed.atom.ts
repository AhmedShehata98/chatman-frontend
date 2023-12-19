import { atom } from "recoil";

export const feedInputsAtom = atom<{
  textContent: string;
  attachmentContent: File | null;
}>({
  key: "feed-inputs",
  default: {
    textContent: "",
    attachmentContent: null,
  },
});

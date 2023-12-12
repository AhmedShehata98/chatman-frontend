import { atom } from "recoil";

export const feedInputsAtom = atom({
  key: "feed-inputs",
  default: {
    textContent: "",
    attachmentContent: "",
    emojiContent: "",
  },
});

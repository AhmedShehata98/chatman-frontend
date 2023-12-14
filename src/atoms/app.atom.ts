import { atom } from "recoil";

export const toggleSideMenuAtom = atom({
  key: "toggleSideMenu",
  default: false,
});

export const searchOnContactsAtom = atom({
  key: "search-contacts",
  default: "",
});

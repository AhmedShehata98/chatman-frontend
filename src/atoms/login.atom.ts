import { atom } from "recoil";

export const authStateAtom = atom<{
  isLoggedIn: boolean;
  user: User | null;
  token: null | string;
}>({
  key: "user-auth-state",
  default: {
    isLoggedIn: false,
    user: null,
    token: null,
  },
});

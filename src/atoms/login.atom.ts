import { atom } from "recoil";

export type authType = {
  isLoggedIn: boolean;
  user: User | null;
  token: null | string;
};
export const authStateAtom = atom<authType>({
  key: "user-auth-state",
  default: {
    isLoggedIn: false,
    user: null,
    token: null,
  },
});

import { useSetRecoilState } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
function useLogout() {
  const setAuth = useSetRecoilState(authStateAtom);
  const navigate = useNavigate();

  function logout() {
    setAuth({
      isLoggedIn: false,
      token: null,
      user: null,
    });
    cookie.remove("token");
    cookie.remove("isLoggedIn");
    navigate(ROUTES_LIST.register);
  }
  return { logout };
}

export default useLogout;

import { Link, useLocation } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import Avatar from "../components/Avatar";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";

function SideMenu() {
  const { pathname } = useLocation();
  const { user } = useRecoilValue(authStateAtom);
  return (
    <aside className="flex h-[calc(100dvh-60px)] items-start justify-start">
      <article className="flex h-full flex-col bg-[#202C33]">
        <ul className="grid grid-flow-row gap-2 p-1.5">
          <Link
            to={ROUTES_LIST.app}
            className={
              pathname === "/"
                ? "relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-zinc-600 shadow-md after:absolute after:left-0 after:top-1/2 after:h-1/2 after:w-1.5 after:-translate-y-1/2 after:rounded-2xl after:bg-[#00A884] after:content-['']"
                : "relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-md shadow-md hover:bg-zinc-700"
            }
          >
            <span className="text-2xl text-white">
              <i className="fi fi-rr-comment-alt"></i>
            </span>
          </Link>
          <Link
            to={ROUTES_LIST.call}
            className={
              pathname === ROUTES_LIST.call
                ? "relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-zinc-600 shadow-md after:absolute after:left-0 after:top-1/2 after:h-1/2 after:w-1.5 after:-translate-y-1/2 after:rounded-2xl after:bg-[#00A884] after:content-['']"
                : "relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-md shadow-md hover:bg-zinc-700"
            }
          >
            <span className="text-2xl text-white">
              <i className="fi fi-sr-phone-call"></i>
            </span>
          </Link>
        </ul>
        <ul className="mt-auto flex flex-col items-center justify-center gap-2 py-3 pe-1">
          <button
            type="button"
            className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-md shadow-md hover:bg-zinc-700"
          >
            <span className="text-2xl text-white">
              <i className="fi fi-rr-settings"></i>
            </span>
          </button>
          <Avatar
            isOnline={user?.isOnline}
            showStatus
            fullName={user?.fullName as string}
            src={null}
          />
        </ul>
      </article>
    </aside>
  );
}

export default SideMenu;

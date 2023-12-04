import { useLocation } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import Avatar from "../components/Avatar";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import SidebarLink from "../components/SidebarLink";

function SideMenu() {
  const { pathname } = useLocation();
  const { user } = useRecoilValue(authStateAtom);

  return (
    <aside className="flex h-[100dvh] items-start justify-start">
      <article className="flex h-full flex-col bg-primary-100">
        <ul className="grid grid-flow-row gap-2 p-1.5">
          <SidebarLink
            to={ROUTES_LIST.chatRoom}
            isActive={pathname === ROUTES_LIST.chatRoom}
          >
            <span className="text-2xl text-white">
              <i className="fi fi-rr-comment-alt"></i>
            </span>
          </SidebarLink>
          <SidebarLink
            to={ROUTES_LIST.call}
            isActive={pathname === ROUTES_LIST.call}
          >
            <span className="text-2xl text-white">
              <i className="fi fi-sr-phone-call"></i>
            </span>
          </SidebarLink>
        </ul>
        <ul className="mt-auto flex flex-col items-center justify-center gap-2 py-3 pe-1">
          <SidebarLink
            to={ROUTES_LIST.settings}
            isActive={pathname === ROUTES_LIST.settings}
          >
            <span className="text-2xl text-white">
              <i className="fi fi-rr-settings"></i>
            </span>
          </SidebarLink>
          <Avatar
            status={user?.status || "OFFLINE"}
            showStatus
            fullName={user?.fullName as string}
            src={user?.profilePictureUrl || null}
          />
        </ul>
      </article>
    </aside>
  );
}

export default SideMenu;

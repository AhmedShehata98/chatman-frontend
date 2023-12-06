import { useLocation } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import Avatar from "../components/Avatar";
import { useRecoilState, useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import SideMenuLink from "../components/SideMenuLink";
import { toggleSideMenuAtom } from "../atoms/app.atom";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import useLogout from "../hooks/useLogout";

function SideMenu() {
  const { logout } = useLogout();
  const SideMenuRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();
  const { user } = useRecoilValue(authStateAtom);
  const [isToggledSideMenu, setIsToggledSideMenu] =
    useRecoilState(toggleSideMenuAtom);

  useEffect(() => {
    const handleCloseMenu = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      const bounds = SideMenuRef.current?.getBoundingClientRect();
      if (
        target.clientWidth > bounds?.x! ||
        target.clientWidth < bounds?.x! ||
        target.clientHeight > bounds?.y! ||
        target.clientHeight < bounds?.y!
      ) {
        if (target.id !== "side-menu-btn" && target.id !== "side-menu-link") {
          setIsToggledSideMenu(false);
        }
      }
    };
    document.addEventListener("mousedown", handleCloseMenu);
    return () => {
      document.removeEventListener("mousedown", handleCloseMenu);
    };
  }, []);
  return (
    <aside
      className={`${clsx(
        isToggledSideMenu ? "translate-x-0" : "-translate-x-full",
      )} absolute left-0 top-0 z-30 flex h-[100dvh] w-full items-start justify-start bg-neutral-700 bg-opacity-40 transition-transform`}
    >
      <div
        ref={SideMenuRef}
        className="h-[100dvh] max-h-[100dvh] w-80 bg-primary-100 p-6"
      >
        <figure className="mt-4">
          <Avatar
            className="h-16 w-16"
            fullName={user?.fullName || "na na"}
            showStatus
            src={user?.profilePictureUrl || null}
            status={user?.status}
          />
        </figure>
        <span className="mb-8 mt-5 flex flex-col items-start justify-start gap-2 border-b border-slate-500 pb-8">
          <p className="text-xl font-semibold capitalize text-white">
            {user?.fullName}
          </p>
          <button
            type="button"
            id="side-menu-btn"
            className="flex items-center justify-start gap-3 uppercase text-red-400"
            onClick={logout}
          >
            <i className="fi fi-rr-sign-out-alt pointer-events-none"></i>
            <p className="pointer-events-none">logout</p>
          </button>
        </span>
        <ul className="grid grid-flow-row gap-2">
          <SideMenuLink
            to={ROUTES_LIST.chatRoom}
            isActive={pathname === ROUTES_LIST.chatRoom}
          >
            <i className="fi fi-rr-comment-alt pointer-events-none leading-3"></i>
            <p className="pointer-events-none">chat</p>
          </SideMenuLink>
          <SideMenuLink
            to={ROUTES_LIST.call}
            isActive={pathname === ROUTES_LIST.call}
          >
            <i className="fi fi-rr-phone-call pointer-events-none leading-3"></i>
            <p className="pointer-events-none">call</p>
          </SideMenuLink>
          <SideMenuLink
            to={ROUTES_LIST.settings}
            isActive={pathname === ROUTES_LIST.settings}
          >
            <i className="fi fi-rr-settings pointer-events-none leading-3"></i>
            <p className="pointer-events-none">settings</p>
          </SideMenuLink>
        </ul>
      </div>
    </aside>
  );
}

export default SideMenu;

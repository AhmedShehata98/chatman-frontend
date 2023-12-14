import { useLocation } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";
import Avatar from "../components/Avatar";
import { useRecoilState, useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import SideMenuLink from "../components/SideMenuLink";
import { toggleSideMenuAtom } from "../atoms/app.atom";
import clsx from "clsx";
import { useState } from "react";
import useLogout from "../hooks/useLogout";
import Portal from "../components/Portal";
import LandscapeModal from "../components/LandscapeModal";
import SettingsModal from "../components/SettingsModal";
import useClickOutside from "../hooks/useClickOutside";

function SideMenu() {
  const { logout } = useLogout();
  const [isShowSettingsModal, setIsShowSettingsModal] = useState(false);
  const { pathname } = useLocation();
  const { user } = useRecoilValue(authStateAtom);
  const [isToggledSideMenu, setIsToggledSideMenu] =
    useRecoilState(toggleSideMenuAtom);
  const { modalRef } = useClickOutside({ setShowModal: setIsToggledSideMenu });

  return (
    <aside
      className={`${clsx(
        isToggledSideMenu ? "translate-x-0" : "-translate-x-full",
      )} absolute left-0 top-0 z-30 flex h-[100dvh] w-full items-start justify-start bg-zinc-700 bg-opacity-70 transition-transform`}
    >
      <div
        ref={modalRef}
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
          <p className="mb-4 text-xl font-semibold capitalize text-white">
            {user?.fullName}
          </p>
          <button
            type="button"
            className="mb-2 flex items-center justify-start gap-3 text-lg font-medium capitalize text-white"
            onClick={() => {
              setIsShowSettingsModal(true);
              if (isShowSettingsModal) {
                setIsToggledSideMenu(false);
              }
            }}
          >
            <i className="fi fi-rr-settings pointer-events-none leading-3"></i>
            <p className="pointer-events-none">settings</p>
          </button>
          <button
            type="button"
            id="side-menu-btn"
            className="mb-2 flex items-center justify-start gap-3 uppercase text-red-400"
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
            onClick={() => setIsToggledSideMenu(false)}
          >
            <i className="fi fi-rr-comment-alt pointer-events-none leading-3"></i>
            <p className="pointer-events-none">chat</p>
          </SideMenuLink>
          <SideMenuLink
            to={ROUTES_LIST.feeds}
            isActive={pathname === ROUTES_LIST.feeds}
            onClick={() => setIsToggledSideMenu(false)}
          >
            <i className="`fi fi-rr-blog-text pointer-events-none leading-3"></i>
            <p className="pointer-events-none">feeds</p>
          </SideMenuLink>
          <SideMenuLink
            to={ROUTES_LIST.call}
            isActive={pathname === ROUTES_LIST.call}
            onClick={() => setIsToggledSideMenu(false)}
          >
            <i className="fi fi-rr-phone-call pointer-events-none leading-3"></i>
            <p className="pointer-events-none">call</p>
          </SideMenuLink>
        </ul>
      </div>
      {isShowSettingsModal && (
        <Portal>
          <LandscapeModal>
            <SettingsModal setShowModal={setIsShowSettingsModal} />
          </LandscapeModal>
        </Portal>
      )}
    </aside>
  );
}

export default SideMenu;

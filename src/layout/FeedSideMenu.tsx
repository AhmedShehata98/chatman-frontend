import { useRecoilState } from "recoil";
import { toggleSideMenuAtom } from "../atoms/app.atom";
import FeedRoomList from "../components/FeedRoomList";
import AddNewFeedRoom from "../components/AddNewFeedRoom";
import { useState } from "react";
import Portal from "../components/Portal";

function FeedSideMenu() {
  const [showFeedsModal, setIsShowFeedsModal] = useState(false);
  const [toggleSideMenu, setToggleSideMenu] =
    useRecoilState(toggleSideMenuAtom);
  return (
    <aside className="relative flex h-dynamic-screen w-1/3 flex-col bg-primary-100 p-4 max-lg:w-full lg:z-[15]">
      <div className="flex w-full items-center justify-start">
        <button
          type="button"
          onClick={() => setToggleSideMenu((currVal) => !currVal)}
          className="me-2 flex items-center justify-center rounded-md px-3 py-2 text-3xl leading-3 text-white hover:bg-zinc-600 max-md:px-2 max-md:py-1 max-md:text-xl"
        >
          {!toggleSideMenu && <i className="fi fi-rr-menu-burger"></i>}
          {toggleSideMenu && <i className="fi fi-rr-circle-xmark"></i>}
        </button>
        <input
          type="search"
          name="search-feeds"
          id="search-feeds"
          placeholder="search feed name ..."
          className="grow rounded-md bg-primary-200 px-3 py-2"
        />
      </div>
      <FeedRoomList />
      {showFeedsModal && (
        <Portal>
          <AddNewFeedRoom setShowModal={setIsShowFeedsModal} />
        </Portal>
      )}
      <button
        type="button"
        className="absolute bottom-10 right-8 h-16 w-16 rounded-md bg-secondary-100 text-3xl leading-3 hover:brightness-125"
        onClick={() => setIsShowFeedsModal(true)}
      >
        <i className="fi fi-sr-square-plus"></i>
      </button>
    </aside>
  );
}

export default FeedSideMenu;

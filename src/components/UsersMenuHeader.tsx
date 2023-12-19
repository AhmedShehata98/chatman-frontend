import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { searchOnContactsAtom, toggleSideMenuAtom } from "../atoms/app.atom";

type Props = {
  title: string;
  onFilter: MouseEventHandler;
  onCreateNewChat: MouseEventHandler;
};
function UsersMenuHeader({ onCreateNewChat, onFilter, title }: Props) {
  const [query, setQuery] = useState("");
  const setSearchOnContacts = useSetRecoilState(searchOnContactsAtom);
  const [toggleSideMenu, setToggleSideMenu] =
    useRecoilState(toggleSideMenuAtom);

  function handleGetUserSearchQuery(ev: ChangeEvent) {
    const target = ev.target as HTMLInputElement;
    setQuery(target.value);
  }

  useEffect(() => {
    let timeout: number;

    timeout = +setTimeout(() => {
      setSearchOnContacts(query);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="flex h-max w-full flex-col items-center justify-between px-9 py-6 max-lg:px-3 max-lg:py-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-3xl font-bold capitalize text-white max-md:text-xl">
          {title}
        </h2>
        <span className="flex items-center justify-center gap-10 max-md:gap-3">
          <button
            type="button"
            onClick={onCreateNewChat}
            className="flex h-14 w-14 items-center justify-center rounded-md text-2xl text-white shadow-md hover:bg-slate-600 max-md:h-10 max-md:w-10 max-md:text-lg"
          >
            <i className="fi fi-rr-square-plus"></i>
          </button>
          <button
            type="button"
            onClick={onFilter}
            className="flex h-14 w-14 items-center justify-center rounded-md text-2xl text-white shadow-md hover:bg-slate-600 max-md:h-10 max-md:w-10 max-md:text-lg"
          >
            <i className="fi fi-rr-bars-filter"></i>
          </button>
        </span>
      </div>
      <form
        action=""
        className="relative mt-4 flex w-full items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={() => setToggleSideMenu((currVal) => !currVal)}
          className="flex items-center justify-center rounded-md px-3 py-2 text-3xl leading-3 text-white hover:bg-zinc-600 max-md:px-2 max-md:py-1 max-md:text-xl"
        >
          {!toggleSideMenu && <i className="fi fi-rr-menu-burger"></i>}
          {toggleSideMenu && <i className="fi fi-rr-circle-xmark"></i>}
        </button>
        <input
          type="search"
          name="search"
          id="search"
          autoComplete="off"
          placeholder="search or start new chat ..."
          className="flex-1 flex-grow rounded-md border border-transparent bg-primary-200 px-4 py-3 text-white focus:border-[#00A884] focus:outline-none max-md:py-1.5"
          value={query}
          onChange={handleGetUserSearchQuery}
        />
      </form>
    </div>
  );
}

export default UsersMenuHeader;

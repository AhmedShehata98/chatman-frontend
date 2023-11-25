import {
  ChangeEvent,
  MouseEvent,
  MouseEventHandler,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { searchUsers } from "../services/auth.api";
import Avatar from "./Avatar";
import clsx from "clsx";
import { chatManWebSocket } from "../services/ws";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  title: string;
  onFilter: MouseEventHandler;
  onCreateNewChat: MouseEventHandler;
};
function UsersMenuHeader({ onCreateNewChat, onFilter, title }: Props) {
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();
  const deferredQuery = useDeferredValue(query);
  const { user: me } = useRecoilValue(authStateAtom);

  const [usersList, setUsersList] = useState<User[] | null>(null);
  function handleGetUserSearchQuery(ev: ChangeEvent) {
    const target = ev.target as HTMLInputElement;
    setQuery(target.value);
  }
  function joinRoom(receiver: User, cb: (data: any) => void) {
    if (receiver === null)
      throw new Error(`expected receiver id but received:${receiver}`);
    if (me === null) throw new Error(`expected my but received id:${receiver}`);
    const participants = {
      sender: me?._id,
      receiver: receiver._id,
    };
    if (receiver) {
      chatManWebSocket.emit("join-room", {
        participants,
        roomId: null,
      });
      chatManWebSocket.on("room-created", (data) => {
        cb(data);
      });
    }
    chatManWebSocket.off("join-room");
    chatManWebSocket.off("room-created");
  }

  function handleChooseUser(receiver: User) {
    setQuery("");
    joinRoom(receiver, () => {
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
    });
  }

  useEffect(() => {
    if (deferredQuery !== "") {
      searchUsers(deferredQuery).then(({ users }) => {
        const newUsers = users.filter((user) => user._id !== me?._id);
        setUsersList(newUsers);
      });
    }
  }, [deferredQuery]);
  return (
    <div className="flex h-max w-full flex-col items-center justify-between px-9 py-6">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-3xl font-bold capitalize text-white">{title}</h2>
        <span className="flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={onCreateNewChat}
            className="flex h-14 w-14 items-center justify-center rounded-md text-2xl text-white shadow-md hover:bg-slate-600"
          >
            <i className="fi fi-rr-square-plus"></i>
          </button>
          <button
            type="button"
            onClick={onFilter}
            className="flex h-14 w-14 items-center justify-center rounded-md text-2xl text-white shadow-md hover:bg-slate-600"
          >
            <i className="fi fi-rr-bars-filter"></i>
          </button>
        </span>
      </div>
      <form
        action=""
        className="relative flex w-full items-center justify-center"
      >
        <input
          type="search"
          name="search"
          id="search"
          autoComplete="off"
          placeholder="search or start new chat ..."
          className="mt-4 flex-1 flex-grow rounded-md border border-transparent bg-[#202C33] px-4 py-3 text-white focus:border-[#00A884] focus:outline-none"
          value={query}
          onChange={handleGetUserSearchQuery}
        />
        <div
          className={`${clsx(
            {
              hidden: usersList === null,
            },
            {
              hidden: query === "",
            },
          )} absolute left-0 top-full flex h-max max-h-[35dvh] w-full flex-col items-start justify-start gap-5 bg-[#18252e] p-6`}
        >
          <h4 className="px-3 pb-2 font-bold uppercase text-zinc-300">
            available contacts :
          </h4>
          <ul className="-my-3 flex w-full flex-col items-start justify-center gap-3 overflow-y-auto">
            {query !== "" && usersList !== null
              ? usersList?.map((user) => (
                  <li
                    key={user._id}
                    className="flex w-11/12 cursor-pointer items-center justify-start gap-4 px-4 py-2.5 hover:bg-[#243744]"
                    onClick={() => handleChooseUser(user)}
                  >
                    <Avatar src={user.profileImg} fullName={user.fullName} />
                    <span className="flex flex-col justify-start gap-1">
                      <strong className="text-zinc-100">{`${user.username}`}</strong>
                      <small className="font-semibold capitalize text-zinc-400">
                        {Intl.DateTimeFormat("en-EG", {
                          timeStyle: "short",
                          dateStyle: "medium",
                        }).format(user.createdAt as any)}
                      </small>
                    </span>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </form>
    </div>
  );
}

export default UsersMenuHeader;

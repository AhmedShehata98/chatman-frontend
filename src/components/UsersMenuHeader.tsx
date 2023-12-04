import {
  ChangeEvent,
  MouseEventHandler,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { searchUsers } from "../services/auth.api";
import Avatar from "./Avatar";
import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../atoms/login.atom";
import { createConversation } from "../services/conversation.api";

type Props = {
  title: string;
  onFilter: MouseEventHandler;
  onCreateNewChat: MouseEventHandler;
};
function UsersMenuHeader({ onCreateNewChat, onFilter, title }: Props) {
  const [query, setQuery] = useState("");
  const { user } = useRecoilValue(authStateAtom);
  const queryClient = useQueryClient();
  const deferredQuery = useDeferredValue(query);
  const { mutateAsync: mutateCreateConversation } = useMutation({
    mutationFn: (conversationData: CreateConversation) =>
      createConversation(conversationData),
    mutationKey: ["conversation"],
  });

  const [usersList, setUsersList] = useState<SearchResult[] | null>(null);
  function handleGetUserSearchQuery(ev: ChangeEvent) {
    const target = ev.target as HTMLInputElement;
    setQuery(target.value);
  }

  async function handleChooseUser(receiverId: string) {
    setQuery("");
    queryClient.invalidateQueries({ queryKey: ["user-data"] });
    const conversation = await mutateCreateConversation({
      participants: [receiverId, user?._id as string],
      conversationType: "PRIVATE",
    });
    console.log(conversation);
  }

  useEffect(() => {
    if (deferredQuery !== "") {
      searchUsers(deferredQuery).then((users) => {
        setUsersList(users);
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
                    onClick={() => handleChooseUser(user._id)}
                  >
                    <Avatar
                      showStatus={false}
                      src={user.profilePictureUrl}
                      fullName={user.fullName}
                    />
                    <span className="flex flex-col justify-start gap-1">
                      <strong className="text-zinc-100">{`${user.username}`}</strong>
                      <small className="font-semibold capitalize text-zinc-400">
                        {user.createdAt}
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

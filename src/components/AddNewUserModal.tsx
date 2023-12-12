import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchUsers } from "../services/auth.api";
import { Dispatch, SetStateAction, useDeferredValue, useState } from "react";
import Avatar from "./Avatar";
import { formatDate } from "../utils/utils";
import { createConversation } from "../services/conversation.api";
import { authStateAtom } from "../atoms/login.atom";
import { useRecoilValue } from "recoil";
import LandscapeModal from "./LandscapeModal";

function AddNewUserModal({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { user } = useRecoilValue(authStateAtom);
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["search-users", deferredQuery],
    queryFn: () => searchUsers(deferredQuery),
    enabled: deferredQuery !== "",
  });
  const { mutateAsync: mutateCreateConversation } = useMutation({
    mutationFn: (conversationData: CreateConversation) =>
      createConversation(conversationData),
    mutationKey: ["conversation"],
  });
  const queryClient = useQueryClient();

  async function handleChooseUser(receiverId: string) {
    setQuery("");
    await mutateCreateConversation(
      {
        participants: [receiverId, user?._id as string],
        conversationType: "PRIVATE",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["conversation"] });
          setShowModal(false);
        },
      },
    );
  }

  return (
    <LandscapeModal>
      <span>
        <button
          type="button"
          className="rounded bg-red-600 px-5 py-3 text-xl leading-3 text-white"
          onClick={() => setShowModal(false)}
        >
          X
        </button>
      </span>
      <span className="mb-10 mt-7 w-full">
        <input
          type="search"
          name="search-users"
          className="w-full border border-transparent bg-primary-300 px-3 py-2 text-white focus:border-secondary-100 focus:outline-none"
          autoComplete={undefined}
          id="searchUsers"
          value={deferredQuery}
          onChange={(ev) => setQuery(ev.target.value)}
          placeholder="type something ..."
        />
      </span>
      {isLoading ? (
        <div className="flex w-full flex-col items-center justify-center pt-1">
          <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-secondary-100 border-b-transparent"></span>
        </div>
      ) : null}
      {!isFetched && !data && (
        <p className="my-32 self-center capitalize text-zinc-400">
          type user name to find ..
        </p>
      )}
      <ul className="grid w-full grid-flow-row gap-2">
        {isFetched && data && data.length >= 1
          ? data.map((user) => (
              <li
                key={user._id}
                className="flex w-full gap-4 rounded-md px-3 py-2 hover:bg-primary-300"
              >
                <Avatar
                  fullName={user.fullName}
                  src={user.profilePictureUrl}
                  className="h-11 w-11"
                  showStatus={false}
                />
                <div className="flex flex-col items-start justify-start gap-1">
                  <p className="font-medium capitalize text-white">
                    {user.fullName}
                  </p>
                  <code className="text-slate-300">
                    {formatDate(user.createdAt)}
                  </code>
                </div>
                <button
                  type="button"
                  className="ml-auto h-10 w-14 self-center rounded-md bg-secondary-100 bg-opacity-25 text-xl leading-3 text-secondary-100 hover:brightness-125"
                  onClick={() => handleChooseUser(user._id)}
                >
                  <i className="fi fi-rr-user-add"></i>
                </button>
              </li>
            ))
          : null}
      </ul>
    </LandscapeModal>
  );
}

export default AddNewUserModal;

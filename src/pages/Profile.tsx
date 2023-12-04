import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { getUserData } from "../services/auth.api";
import Cookies from "js-cookie";

const Profile = () => {
  const user = useLoaderData() as User;
  const {
    data: userData,
    isLoading: isLoadingUserData,
    isFetched: isFetchedUserData,
  } = useQuery({
    queryKey: ["user-data", Cookies.get("token")],
    queryFn: () => getUserData(Cookies.get("token") as string),
    initialData: user,
    enabled: Cookies.get("token") !== undefined,
  });
  const [fullName, setFullName] = React.useState("");
  const [editFullName, setEditFullName] = React.useState(false);

  React.useLayoutEffect(() => {
    if (isFetchedUserData) {
      setFullName(userData.fullName);
    }
  }, [userData, isFetchedUserData, isLoadingUserData]);
  return (
    <div className="flex flex-grow flex-col p-4">
      <div className="mt-10 flex h-full w-full flex-col items-center self-center">
        <figure className="w-fit px-6 py-3">
          {isFetchedUserData ? (
            <img
              className="aspect-square w-48 rounded-full"
              src={userData.profilePictureUrl}
              alt="profile-picture"
            />
          ) : null}
        </figure>
        <div className="flex items-center justify-center px-8 py-3">
          <input
            type="text"
            placeholder="fullName"
            value={fullName}
            onChange={(ev) => setFullName(ev.target.value)}
            hidden={!editFullName}
          />
          <span className="flex items-center justify-start gap-6">
            {isFetchedUserData ? (
              <p className="text-3xl font-semibold text-zinc-200">
                {userData?.fullName}
              </p>
            ) : null}
            <button
              type="button"
              className="text-secondary-100 text-2xl"
              onClick={() => setEditFullName((p) => !p)}
            >
              <i className="fi fi-rr-pencil"></i>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { Link, Outlet } from "react-router-dom";
import { ROUTES_LIST } from "../router/routes-list";

const Settings = () => {
  return (
    <article className="flex h-app-height w-full items-start justify-start">
      <ul className="flex h-full w-1/3 flex-col items-start justify-start gap-2 bg-primary-100 p-6">
        <li className="group flex h-max w-full items-center justify-start rounded-md px-4 text-xl capitalize text-white hover:bg-zinc-600">
          <Link to={ROUTES_LIST.settings} className="flex flex-grow gap-3 py-3">
            <span className="text-2xl">
              <i className="fi fi-rr-user-pen"></i>
            </span>
            <p>profile</p>
          </Link>
          <span className="hidden text-3xl text-secondary-100 group-hover:inline-block">
            <i className="fi fi-rr-arrow-small-right"></i>
          </span>
        </li>
        <li className="group flex h-max w-full items-center justify-start rounded-md px-4 text-xl capitalize text-white hover:bg-zinc-600">
          <Link
            to={ROUTES_LIST.personalization}
            className="flex flex-grow gap-3 py-3"
          >
            <span className="text-2xl">
              <i className="fi fi-rr-background"></i>
            </span>
            <p>personalization</p>
          </Link>
          <span className="hidden text-3xl text-secondary-100 group-hover:inline-block">
            <i className="fi fi-rr-arrow-small-right"></i>
          </span>
        </li>
      </ul>
      <Outlet />
    </article>
  );
};

export default Settings;

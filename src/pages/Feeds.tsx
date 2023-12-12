import { Outlet } from "react-router-dom";
import FeedsLayout from "../layout/FeedsLayout";
// import PostsList from "../components/PostsList";
// import CreatePost from "../components/CreatePost";

const Feeds = () => {
  return (
    <FeedsLayout>
      <Outlet />
    </FeedsLayout>
  );
};

export default Feeds;

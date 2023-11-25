import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes.tsx";
import RecoilWrapper from "./lib/RecoilWrapper.tsx";
import ReactQuery from "./lib/ReactQuery.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilWrapper>
      <ReactQuery>
        <RouterProvider router={router} />
      </ReactQuery>
    </RecoilWrapper>
  </React.StrictMode>,
);

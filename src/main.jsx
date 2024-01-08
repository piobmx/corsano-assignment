import "./index.css";

import {
  BrowserRouter,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";

import App from "./App.jsx";
import AuthPage from "./components/AuthPage";
import DataPage from "./components/DataPage";
import React from "react";
import ReactDOM from "react-dom/client";
import SummaryPage from "./components/Summary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "data",
        element: <DataPage />,
      },
      {
        path: "summary",
        element: <SummaryPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

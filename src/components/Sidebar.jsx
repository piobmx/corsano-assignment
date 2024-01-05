import { Link } from "react-router-dom";
import React from "react";
import { useState } from "react";

const Sidebar = function (props) {
  return (
    <div className="bg-red-200 text-black h-screen z-20 w-1/5 p-4 fixed left-0 top-0">
      <h1 className="text-5xl font-bold mb-10">Corsano</h1>
      <ul className="text-left list-none">
        <li className="my-4 text-lg">
          <Link to="/auth">Authentication</Link>{" "}
        </li>
        <li className="my-4 text-lg">
          <Link to="/data">My Data</Link>{" "}
        </li>
        <li className="my-4 text-lg">
          <Link to="/summary">My Summary</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

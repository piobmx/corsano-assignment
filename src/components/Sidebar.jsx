import { Link } from "react-router-dom";
import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

let navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Authentication", href: "/auth", current: false },
  {
    name: "My Data",
    href: "/data",
    // icon: FolderIcon,
    // count: "12",
    current: false,
  },
  {
    name: "My Summary",
    href: "/summary",
    // icon: CalendarIcon,
    // count: "20+",
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = function () {
  const location = useLocation();
  const currentRoute = location.pathname.substring(1);
  const [current, setCurrent] = useState(currentRoute);

  return (
    <div className="flex flex-col gap-y-1 overflow-y-auto bg-indigo-600 px-6">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-5xl font-bold text-white">
          <Link to="/">Corsano</Link>
        </h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item, index) => {
                item.current = current === item.href.slice(1, item.href.length);

                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-indigo-700 text-white"
                          : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      )}
                      onClick={() =>
                        setCurrent(item.href.slice(1, item.href.length))
                      }
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

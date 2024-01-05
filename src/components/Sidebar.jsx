import { Link } from "react-router-dom";
import React from "react";
import logo from "../assets/mainLogo.svg";
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
    <div className="flex sticky grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      <div className="flex h-16 shrink-0 items-center">
        <a href="https://corsano.com" target="_blank">
          <img className="h-8 w-auto" src={logo} alt="corsano logo"></img>
        </a>
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
                        item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                        'block rounded-md py-2 pr-2 pl-10 text-sm leading-6 font-semibold text-gray-700'
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

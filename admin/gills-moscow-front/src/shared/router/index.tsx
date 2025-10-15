import { RouteObject } from "react-router-dom";

import { LINKS } from "./links";
import Login from "@pages/Login";
import BookingList from "@pages/BookingList";
import Gantt from "@pages/Gantt";
import Database from "@pages/Database";
import Popups from "@pages/Popups";
import TablesList from "@pages/TablesList";

type CustomRoute = RouteObject & { protected: boolean; roles: string[] };

export const router: CustomRoute[] = [
  {
    id: "1",
    path: LINKS.login,
    element: <Login />,
    protected: false,
    roles: [],
  },
  {
    id: "2",
    path: LINKS.bookingList,
    element: <BookingList />,
    protected: true,
    roles: ["admin"],
  },
  {
    id: "3",
    path: LINKS.gantt,
    element: <Gantt />,
    protected: true,
    roles: ["admin", "manager"],
  },
  {
    id: "4",
    path: LINKS.database,
    element: <Database />,
    protected: true,
    roles: ["admin"],
  },
  {
    id: "5",
    path: LINKS.popups,
    element: <Popups />,
    protected: true,
    roles: ["admin"],
  },
  {
    id: "6",
    path: LINKS.tablesList,
    element: <TablesList />,
    protected: true,
    roles: ["admin"],
  },
];

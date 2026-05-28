import { Outlet } from "react-router-dom";
import { Navbar } from "../components/dashboard/Navbar";
import Tabs from "../components/dashboard/Tabs";
export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <Tabs />
      <Outlet />
    </div>
  );
}
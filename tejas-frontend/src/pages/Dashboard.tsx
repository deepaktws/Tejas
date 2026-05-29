import { Outlet } from "react-router-dom";
import { Navbar } from "../components/dashboard/Navbar";
import Tabs from "../components/dashboard/Tabs";
import Header from "../components/dashboard/Header";
export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <Header/>
      <Tabs/>
      <Outlet />
    </div>
  );
}
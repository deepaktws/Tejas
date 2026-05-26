import { Outlet } from "react-router-dom";
import { Navbar } from "../components/dashboard/Navbar";
export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
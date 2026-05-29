import { Outlet } from "react-router-dom";
import { Navbar } from "../components/dashboard/Navbar";
import Tabs from "../components/dashboard/Tabs";
import DatePicker from "../components/dashboard/DatePicker";
export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <Tabs rightComponent={<DatePicker />}/>
      <Outlet />
    </div>
  );
}
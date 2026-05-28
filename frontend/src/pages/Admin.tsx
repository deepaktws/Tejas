import { Outlet } from "react-router-dom";
import { Navbar } from "../components/dashboard/Navbar";

export default function Admin() {
    return (
        <div>
            <Navbar/>
            <Outlet/>
        </div>
    )
}
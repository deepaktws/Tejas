import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default Routers;
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ContactAdministrator from "./pages/ContactAdministrator";
import SelectLocationPage from "./pages/SelectLocationPage";
import NotFound from "./pages/NotFound";
import { useSelector } from "react-redux";
function Routers() {
  const token = useSelector(
    (state: any) => state.auth.accessToken
  );
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={token ? <Dashboard /> :<Navigate to="/login" />} />
      <Route path="/login" element={token ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/contact-administrator" element={<ContactAdministrator />} />
      <Route path="/select-location" element={token ? <SelectLocationPage /> :<Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Routers;
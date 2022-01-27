import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppContext from "./AppContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileInfo from "./pages/ProfileInfo";
import OwnerHome from "./pages/OwnerHome";
import TenantHome from "./pages/TenantHome";
import "./App.css";
import RepairRequest from "./components/RepairRequestForm";
import ResidentAnnouncements from "./components/ResidentAnnouncements";
import Emergency from "./components/Emergency";
import RepairStatus from "./components/RepairStatus";
import TenantDocuments from "./components/TenantDocuments";
import RentPayment from "./components/RentPayment";
import PaymentHistory from "./components/PaymentHistory";
function App() {
  const [userData, setUserData] = React.useState({
    access_token: localStorage.getItem("access_token"),
    refresh_token: localStorage.getItem("refresh_token"),
    user: JSON.parse(localStorage.getItem("user")),
  });
  const updateUserData = (newUserData) => {
    setUserData(newUserData);
    localStorage.setItem("access_token", newUserData.access_token);
    localStorage.setItem("refresh_token", newUserData.refresh_token);
    localStorage.setItem("user", JSON.stringify(newUserData.user));
  };
  const logout = () => {
    updateUserData({
      access_token: null,
      refresh_token: null,
      user: null,
    });
  };
  return (
    <AppContext.Provider value={{ userData, updateUserData, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profileInfo" element={<ProfileInfo />} />
            <Route path="owner" element={<OwnerHome />} />
            <Route path="tenant" element={<TenantHome />} />
            <Route path="repairRequest" element={<RepairRequest />} />
            <Route
              path="residentAnnouncements"
              element={<ResidentAnnouncements />}
            />
            <Route path="emergency" element={<Emergency />} />
            <Route path="repairStatus" element={<RepairStatus />} />
            <Route path="tenantDocuments" element={<TenantDocuments />} />
            <Route path="rentPayment" element={<RentPayment />} />
            <Route path="paymentHistory" element={<PaymentHistory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;

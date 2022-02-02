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
import Emergency from "./components/TenantEmergency";
import RepairStatus from "./components/RepairStatus";
import TenantDocuments from "./components/TenantDocuments";
import RentPayment from "./components/RentPayment";
import PaymentHistory from "./components/PaymentHistory";
import ScheduleRepairs from "./components/ScheduleRepairs";
import { get } from "./utils/api";
import TenantPropertyManagers from "./components/TenantPropertyManagers";
import DetailRepairStatus from "./components/DetailRepairStatus";
import MaintenanceHome from "./pages/MaintenanceHome";
import ScheduledJobs from "./components/ScheduledJobs";
import DetailQuote from "./components/DetailQuote";
import DetailAnnouncements from "./components/DetailAnnouncement";
import RescheduleRepair from "./components/RescheduleRepair";
import JobsCompleted from "./components/JobsCompleted";
import QuotesRejectedM from "./components/QuotesRejectedM";
import QuotesRejectedPM from "./components/QuotesRejectedPM";
import PMRepairRequestDetail from "./components/PMRepairRequestDetail";
import DetailQuoteRequest from "./components/DetailQuoteRequest";
function App() {
  const [userData, setUserData] = React.useState({
    access_token: JSON.parse(localStorage.getItem("access_token")),
    refresh_token: JSON.parse(localStorage.getItem("refresh_token")),
    user: JSON.parse(localStorage.getItem("user")),
  });
  const updateUserData = (newUserData) => {
    setUserData(newUserData);
    localStorage.setItem(
      "access_token",
      JSON.stringify(newUserData.access_token)
    );
    localStorage.setItem(
      "refresh_token",
      JSON.stringify(newUserData.refresh_token)
    );
    localStorage.setItem("user", JSON.stringify(newUserData.user));
  };
  const logout = () => {
    updateUserData({
      access_token: null,
      refresh_token: null,
      user: null,
    });
  };
  const refresh = async () => {
    const response = await get("/refresh", userData.refresh_token);
    updateUserData(response.result);
  };
  console.log(userData);
  return (
    <AppContext.Provider value={{ userData, updateUserData, logout, refresh }}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profileInfo" element={<ProfileInfo />} />
            <Route path="owner" element={<OwnerHome />} />
            <Route path="maintenance" element={<MaintenanceHome />} />
            <Route path="scheduledJobs" element={<ScheduledJobs />} />
            <Route path="detailQuote" element={<DetailQuote />} />
            <Route path="detailQuoteRequest" element={<DetailQuoteRequest />} />
            <Route path="jobsCompleted" element={<JobsCompleted />} />
            <Route path="quotesRejectedM" element={<QuotesRejectedM />} />
            <Route path="quotesRejectedPM" element={<QuotesRejectedPM />} />

            <Route path="tenant" element={<TenantHome />} />
            <Route path="repairRequest" element={<RepairRequest />} />
            <Route
              path="residentAnnouncements"
              element={<ResidentAnnouncements />}
            />
            <Route
              path="detailAnnouncements"
              element={<DetailAnnouncements />}
            />
            <Route path="emergency" element={<Emergency />} />
            <Route path="repairStatus" element={<RepairStatus />} />
            <Route path="tenantDocuments" element={<TenantDocuments />} />
            <Route path="rentPayment" element={<RentPayment />} />
            <Route path="paymentHistory" element={<PaymentHistory />} />
            <Route path="scheduleRepairs" element={<ScheduleRepairs />} />
            <Route path="rescheduleRepair" element={<RescheduleRepair />} />
            <Route
              path="tenantPropertyManagers"
              element={<TenantPropertyManagers />}
            />
            <Route path="detailRepairStatus" element={<DetailRepairStatus />} />

            <Route
              path="pmRepairRequestDetail"
              element={<PMRepairRequestDetail />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;

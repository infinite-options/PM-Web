import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContext from "./AppContext";
import Landing from "./pages/LandingNavbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileInfo from "./pages/ProfileInfo";
import OwnerHome from "./pages/OwnerHome";
import TenantHome from "./pages/TenantHome";
import TenantAvailableProperties from "./pages/TenantAvailableProperties";
import ApplyToProperty from "./pages/ApplyToProperty";
import "./App.css";
import RepairRequest from "./components/RepairRequestForm";
import ResidentAnnouncements from "./components/ResidentAnnouncements";
import Emergency from "./components/TenantEmergency";
import RepairStatus from "./components/RepairStatus";
import TenantDocuments from "./components/TenantDocuments";
import RentPayment from "./components/RentPayment";
import PaymentPage from "./components/PaymentPage";
import OwnerRepairDetails from "./components/OwnerRepairDetails";
import OwnerPaymentPage from "./components/OwnerPaymentPage";
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
import PMRepairRequest from "./components/PMRepairRequest";
import QuotesAccepted from "./components/QuotesAccepted";
import MaintenanceScheduleRepair from "./components/MaintenanceScheduleRepair";
import TenantDocumentUpload from "./pages/TenantDocumentUpload";
import ReviewTenantProfile from "./pages/ReviewTenantprofile";
import TenantPropertyView from "./pages/TenantPropertyView";
import ReviewPropertyLease from "./pages/reviewPropertyLease";
import OwnerContacts from "./pages/OwnerContacts";
import ManagerHome from "./pages/ManagerHome";
import ManagerProperties from "./pages/ManagerProperties";
import ManagerPropertyView from "./pages/ManagerPropertyView";
import ManagerRepairsList from "./pages/ManagerRepairsList";
import ManagerResidentAnnouncements from "./pages/ManagerResidentAnnoucements";
import ManagerEmergency from "./pages/ManagerEmergency";
import ManagerRepairDetail from "./pages/ManagerRepairDetail";
import SignupExisting from "./pages/SignUpExisiting";
import ManagerRepairsOverview from "./pages/ManagerRepairsOverview";
import MaintenanceQuotesSent from "./pages/MaintenanceQuotesSent";
import MaintenanceQuoteSentDetail from "./pages/MaintenanceQuoteSentDetail";
import MaintenanceQuotesScheduled from "./pages/MaintenanceQuotesScheduled";
import ManagerUtilities from "./pages/ManagerUtilities";
import OwnerUtilities from "./pages/OwnerUtilities";
import PropertyView from "./components/PropertyView";
import TenantDuePayments from "./components/TenantDuePayments2";
import TenantPastPaidPayments from "./components/TenantPastPaidPayments";
import OwnerPaymentHistory from "./components/OwnerPaymentHistory";
import ManagerOwnerList from "./components/ManagerOwnerList";
import ManagerTenantList from "./components/ManagerTenantList";
import ManagerApplianceList from "./components/ManagerApplianceList";
import ApplianceList from "./components/ApplianceList";
import ManagerRepairInfo from "./pages/ManagerRepairInfo";
import NotManagedProperties from "./components/NotManagedProperties";
import ManagerPaymentPage from "./components/ManagerPaymentPage";
import ManagerPaymentHistory from "./components/ManagerPaymentHistory";
import TenantDashboard from "./pages/TenantDashboard2"; // updated tenant dashboard
import OwnerDashboard from "./pages/OwnerDashboard2"; //updated owner dashboard
import ManagerDashboard from "./pages/ManagerDashboard"; //updated owner dashboard
import Homepage from "./pages/Homepage";
import LandingNavbar from "./pages/LandingNavbar";
import RenterLanding from "./pages/renterLanding";
import OwnersTab from "./pages/OwnersTab";
import MaintenencePage from "./pages/MaintenencePage";
import ManagerLanding from "./pages/ManagerLanding";
import ZellePayment from "./components/ZellePaymentPage";
import OwnerRepairList from "./components/OwnerRepairList";
import OwnerRepairRequest from "./components/OwnerRepairRequest";

import PropertyForm from "./components/PropertyForm";
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
  // console.log(userData);
  return (
    <AppContext.Provider value={{ userData, updateUserData, logout, refresh }}>
      <BrowserRouter>
        <LandingNavbar />
        <Routes>
          <Route path="/">
            <Route index element={<Homepage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signupexisting" element={<SignupExisting />} />
            <Route path="profileInfo" element={<ProfileInfo />} />
            <Route path="owner" element={<OwnerDashboard />} />
            <Route path="owner_original" element={<OwnerHome />} />
            <Route path="maintenance" element={<MaintenanceHome />} />
            <Route path="scheduledJobs" element={<ScheduledJobs />} />
            <Route path="detailQuote" element={<DetailQuote />} />
            <Route path="search-pm" element={<OwnerContacts />} />
            <Route
              path="detailQuoteRequest/:quote_id"
              element={<DetailQuoteRequest />}
            />
            <Route
              path="maintenanceScheduleRepair/:quote_id"
              element={<MaintenanceScheduleRepair />}
            />
            <Route path="quotesAccepted" element={<QuotesAccepted />} />
            <Route
              path="quotesAccepted/:quote_id"
              element={<QuotesAccepted />}
            />
            <Route path="jobsCompleted" element={<JobsCompleted />} />
            <Route path="quotesRejectedM" element={<QuotesRejectedM />} />
            <Route path="quotesRejectedPM" element={<QuotesRejectedPM />} />
            <Route path="tenant" element={<TenantDashboard />} />
            <Route path="tenant_original" element={<TenantHome />} />
            {/* <Route path="tenantPaymnt" element={<TenantPayment />} /> */}
            <Route
              path="tenantAvailableProperties"
              element={<TenantAvailableProperties />}
            />
            <Route path="maintenencePage" element={<MaintenencePage />} />
            <Route path="OwnersTab" element={<OwnersTab />} />

            <Route
              path="uploadTenantDocuments"
              element={<TenantDocumentUpload />}
            />
            <Route path="applyToProperty" element={<ApplyToProperty />} />
            <Route
              path="reviewTenantProfile/:property_uid"
              element={<ReviewTenantProfile />}
            />
            <Route
              path="tenantPropertyView/:property_uid"
              element={<TenantPropertyView />}
            />
            <Route
              path="reviewPropertyLease/:property_uid"
              element={<ReviewPropertyLease />}
            />
            {/*<Route*/}
            {/*  path="leaseApplicationStatus"*/}
            {/*  element={<LeaseApplicationStatus />}*/}
            {/*/>*/}
            <Route path="manager" element={<ManagerDashboard />} />
            <Route path="managerLanding" element={<ManagerLanding />} />

            <Route path="manager_original" element={<ManagerHome />} />
            <Route
              path="/:property_uid/repairRequest"
              element={<RepairRequest />}
            />
            <Route
              path="residentAnnouncements"
              element={<ResidentAnnouncements />}
            />
            <Route
              path="detailAnnouncements"
              element={<DetailAnnouncements />}
            />
            <Route path="emergency" element={<Emergency />} />
            <Route
              path="/:property_uid/repairStatus"
              element={<RepairStatus />}
            />
            <Route path="tenantDuePayments" element={<TenantDuePayments />} />
            <Route path="zelle" element={<ZellePayment />} />
            <Route
              path="tenantPastPaidPayments"
              element={<TenantPastPaidPayments />}
            />
            <Route path="tenantDocuments" element={<TenantDocuments />} />
            <Route
              path="/rentPayment/:purchase_uid"
              element={<RentPayment />}
            />
            <Route
              path="/paymentPage/:purchase_uid"
              element={<PaymentPage />}
            />
            <Route
              path="/ownerPaymentPage/:purchase_uid"
              element={<OwnerPaymentPage />}
            />
            <Route
              path="/managerPaymentPage/:purchase_uid"
              element={<ManagerPaymentPage />}
            />
            <Route path="renterLanding" element={<RenterLanding />} />
            <Route path="rentPayment" element={<RentPayment />} />
            <Route path="PaymentPage" element={<PaymentPage />} />
            <Route path="paymentHistory" element={<PaymentHistory />} />
            <Route
              path="ownerPaymentHistory"
              element={<OwnerPaymentHistory />}
            />
            <Route
              path="managerPaymentHistory"
              element={<ManagerPaymentHistory />}
            />
            <Route path="scheduleRepairs" element={<ScheduleRepairs />} />
            <Route path="rescheduleRepair" element={<RescheduleRepair />} />
            <Route
              path="tenantPropertyManagers"
              element={<TenantPropertyManagers />}
            />
            <Route
              path="/:property_uid/:maintenance_request_uid/detailRepairStatus"
              element={<DetailRepairStatus />}
            />
            <Route
              path="pmRepairRequestDetail"
              element={<PMRepairRequestDetail />}
            />
            <Route path="pmRepairRequest" element={<PMRepairRequest />} />
            <Route path="manager-properties" element={<ManagerProperties />} />
            <Route path="/owner-list" element={<ManagerOwnerList />} />
            <Route path="/tenant-list" element={<ManagerTenantList />} />
            <Route
              path="/appliances/:mp_id"
              element={<ManagerApplianceList />}
            />
            <Route
              path="/owner-appliances/:mp_id"
              element={<ApplianceList />}
            />
            <Route
              path="manager-properties/:mp_id"
              element={<ManagerPropertyView />}
            />
            <Route path="owner-properties/:mp_id" element={<PropertyView />} />
            <Route
              path="manager-properties/:mp_id/repairs"
              element={<ManagerRepairsList />}
            />
            <Route
              path="manager-properties/:mp_id/repairs/:rr_id"
              element={<ManagerRepairInfo />}
            />
            <Route
              path="manager-properties/:mp_id/resident-announcements"
              element={<ManagerResidentAnnouncements />}
            />
            <Route
              path="manager-properties/:mp_id/emergency"
              element={<ManagerEmergency />}
            />
            <Route
              path="manager-repairs"
              element={<ManagerRepairsOverview />}
            />
            <Route
              path="manager-repairs/:rr_id"
              element={<ManagerRepairDetail />}
            />
            <Route
              path="owner-repairs/:rr_id"
              element={<OwnerRepairDetails />}
            />
            <Route path="/properties" element={<NotManagedProperties />} />

            <Route path="quotes-sent" element={<MaintenanceQuotesSent />} />
            <Route
              path="quotes-sent/:q_id"
              element={<MaintenanceQuoteSentDetail />}
            />
            <Route
              path="quotes-scheduled"
              element={<MaintenanceQuotesScheduled />}
            />
            <Route path="manager-utilities" element={<ManagerUtilities />} />
            <Route path="owner-utilities" element={<OwnerUtilities />} />
            <Route path="owner-repairs" element={<OwnerRepairList />} />
            <Route
              path="owner-repairRequest"
              element={<OwnerRepairRequest />}
            />
            <Route path="add-property" element={<PropertyForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;

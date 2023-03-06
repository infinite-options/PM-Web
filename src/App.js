import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContext from "./AppContext";
import Landing from "./pages/LandingNavbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileInfo from "./pages/ProfileInfo";
import TenantAvailableProperties from "./components/tenantComponents/TenantAvailableProperties";
import ApplyToProperty from "./components/tenantComponents/ApplyToProperty";
import "./App.css";
import RepairRequest from "./components/RepairRequestForm";
import ManagerCreateAnnouncement from "./components/managerComponents/ManagerCreateAnnouncement";
import RepairStatus from "./components/RepairStatus";
import TenantDocuments from "./components/tenantComponents/TenantDocuments";
import RentPayment from "./components/RentPayment";
import PaymentPage from "./components/PaymentPage";
import OwnerRepairDetails from "./components/ownerComponents/OwnerRepairDetails";
import TenantRepairDetails from "./components/tenantComponents/TenantRepairDetails";
import TenantAnnouncements from "./components/tenantComponents/TenantAnnouncements";
import TenantPropertyView from "./components/tenantComponents/TenantPropertyView";
import OwnerPaymentPage from "./components/ownerComponents/OwnerPaymentPage";
import PaymentHistory from "./components/PaymentHistory";
import ScheduleRepairs from "./components/ScheduleRepairs";
import { get } from "./utils/api";
import DetailRepairStatus from "./components/DetailRepairStatus";
import MaintenanceHome from "./pages/MaintenanceHome";
import MaintenanceQuotesRequested from "./components/maintenanceComponents/MaintenanceQuotesRequested";
import DetailQuote from "./components/DetailQuote";
import ManagerDetailAnnouncement from "./components/managerComponents/ManagerDetailAnnouncement";
import RescheduleRepair from "./components/RescheduleRepair";
import JobsCompleted from "./components/JobsCompleted";
import QuotesRejectedM from "./components/maintenanceComponents/QuotesRejectedM";
import QuotesRejectedPM from "./components/maintenanceComponents/QuotesRejectedPM";
import DetailQuoteRequest from "./components/maintenanceComponents/DetailQuoteRequest";
import QuotesAccepted from "./components/maintenanceComponents/QuotesAccepted";
import MaintenanceScheduleRepair from "./components/maintenanceComponents/MaintenanceScheduleRepair";
import ReviewTenantProfile from "./components/tenantComponents/ReviewTenantprofile";
import PropertyApplicationView from "./components/tenantComponents/PropertyApplicationView";
import ReviewPropertyLease from "./components/tenantComponents/reviewPropertyLease";
import OwnerContacts from "./components/ownerComponents/OwnerContacts";
import ReviewTenantProfileEdit from "./components/tenantComponents/ReviewTenantProfileEdit";
import ManagerPropertyView from "./components/managerComponents/ManagerPropertyView";
import ManagerRepairDetail from "./components/managerComponents/ManagerRepairDetail";
import SignupExisting from "./pages/SignUpExisiting";
import ManagerRepairsOverview from "./components/managerComponents/ManagerRepairsOverview";
import MaintenanceQuotesSent from "./components/maintenanceComponents/MaintenanceQuotesSent";
import MaintenanceQuoteSentDetail from "./components/maintenanceComponents/MaintenanceQuoteSentDetail";
import MaintenanceQuoteScheduledDetail from "./components/maintenanceComponents/MaintenanceQuoteScheduledDetail";
import MaintenanceQuotesScheduled from "./components/maintenanceComponents/MaintenanceQuotesScheduled";
import ManagerUtilities from "./components/managerComponents/ManagerUtilities";
import OwnerUtilities from "./components/ownerComponents/OwnerUtilities";
import TenantDuePayments from "./components/tenantComponents/TenantDuePayments";
import OwnerPaymentHistory from "./components/ownerComponents/OwnerPaymentHistory";
import ManagerOwnerList from "./components/managerComponents/ManagerOwnerList";
import ManagerTenantList from "./components/managerComponents/ManagerTenantList";
import NotManagedProperties from "./components/NotManagedProperties";
import ManagerPaymentPage from "./components/managerComponents/ManagerPaymentPage";
import ManagerPaymentHistory from "./components/managerComponents/ManagerPaymentHistory";
import TenantDashboard from "./pages/TenantDashboard"; // new tenant first page view
import OwnerDashboard from "./pages/OwnerDashboard"; //updated owner dashboard
import ManagerDashboard from "./pages/ManagerDashboard"; //updated owner dashboard
import Homepage from "./pages/Homepage";
import LandingNavbar from "./pages/LandingNavbar";
import RenterLanding from "./pages/renterLanding";
import OwnersTab from "./pages/OwnersTab";
import MaintenencePage from "./pages/MaintenencePage";
import ManagerLanding from "./pages/ManagerLanding";
import ZellePayment from "./components/ZellePaymentPage";
import OwnerRepairList from "./components/ownerComponents/OwnerRepairList";

import TenantRepairList from "./components/tenantComponents/TenantRepairList";
import OwnerRepairRequest from "./components/ownerComponents/OwnerRepairRequest";
import PropertyManagersList from "./components/ownerComponents/PropertyManagersList";
import ModifyExisiting from "./pages/ModifyExisiting";
import PropertyInfo from "./components/tenantComponents/PropertyInfo";
import ManagerTenantListDetail from "./components/managerComponents/ManagerTenantListDetail";
import ManagerDocuments from "./components/managerComponents/ManagerDocuments";
import ManagerProfile from "./components/managerComponents/ManagerProfile";
import OwnerDocuments from "./components/ownerComponents/OwnerDocuments";
import OwnerProfile from "./components/ownerComponents/OwnerProfile";
import TenantProfile from "./components/tenantComponents/TenantProfile";
import OwnerPropertyView from "./components/ownerComponents/OwnerPropertyView";
import TenantRepairRequest from "./components/tenantComponents/TenantRepairRequest";
import ManagerPayments from "./components/managerComponents/ManagerPayments";
import OwnerPayments from "./components/ownerComponents/OwnerPayments";
import TenantPayments from "./components/tenantComponents/TenantPayments";
import OwnerCashflow from "./components/ownerComponents/OwnerCashflow";
import ManagerCashflow from "./components/managerComponents/ManagerCashflow";
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
            <Route
              path="/.well-known/apple-developer-merchantid-domain-association.txt"
              render={() => (
                <link
                  rel="verification.txt file"
                  href="%PUBLIC_URL%/.well-known/verification.txt"
                />
              )}
            />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signupexisting" element={<SignupExisting />} />
            <Route path="modifyexisiting" element={<ModifyExisiting />} />
            <Route path="profileInfo" element={<ProfileInfo />} />
            <Route path="owner" element={<OwnerDashboard />} />
            <Route path="maintenance" element={<MaintenanceHome />} />
            <Route
              path="quotes-requested"
              element={<MaintenanceQuotesRequested />}
            />
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
            {/* <Route path="tenantPaymnt" element={<TenantPayment />} /> */}
            {/* <Route path="tenant_doc_upload" element={<TenantDocumentUpload />} /> */}
            <Route
              path="tenantAvailableProperties"
              element={<TenantAvailableProperties />}
            />
            <Route path="maintenencePage" element={<MaintenencePage />} />
            <Route path="OwnersTab" element={<OwnersTab />} />

            <Route path="applyToProperty" element={<ApplyToProperty />} />
            <Route
              path="reviewTenantProfile/:property_uid"
              element={<ReviewTenantProfile />}
            />
            <Route
              path="reviewTenantProfileEdit/:property_uid"
              element={<ReviewTenantProfileEdit />}
            />

            <Route path="profile-info" element={<ProfileInfo />} />
            <Route
              path="propertyApplicationView/:property_uid"
              element={<PropertyApplicationView />}
            />
            <Route
              path="reviewPropertyLease/:property_uid"
              element={<ReviewPropertyLease />}
            />
            <Route path="manager" element={<ManagerDashboard />} />
            <Route path="managerLanding" element={<ManagerLanding />} />
            <Route
              path="/:property_uid/repairRequest"
              element={<RepairRequest />}
            />
            <Route
              path="manager-announcements"
              element={<ManagerCreateAnnouncement />}
            />
            <Route
              path="detailAnnouncements"
              element={<ManagerDetailAnnouncement />}
            />
            <Route
              path="/:property_uid/repairStatus"
              element={<RepairStatus />}
            />
            <Route path="tenantDuePayments" element={<TenantDuePayments />} />
            <Route path="zelle" element={<ZellePayment />} />
            <Route path="tenant-documents" element={<TenantDocuments />} />
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
            <Route path="tenantProfile" element={<TenantProfile />} />
            <Route
              path="managerPaymentHistory"
              element={<ManagerPaymentHistory />}
            />
            <Route path="scheduleRepairs" element={<ScheduleRepairs />} />
            <Route path="rescheduleRepair" element={<RescheduleRepair />} />
            <Route
              path="/:property_uid/:maintenance_request_uid/detailRepairStatus"
              element={<DetailRepairStatus />}
            />
            <Route path="/owner-list" element={<ManagerOwnerList />} />
            <Route path="/tenant-list" element={<ManagerTenantList />} />
            <Route path="/propertyInfo" element={<PropertyInfo />} />
            <Route
              path="/tenant-list/:t_id"
              element={<ManagerTenantListDetail />}
            />
            <Route
              path="managerPropertyDetails/:mp_id"
              element={<ManagerPropertyView />}
            />
            <Route
              path="tenantPropertyDetails/:mp_id"
              element={<TenantPropertyView />}
            />
            <Route
              path="propertyDetails/:mp_id"
              element={<OwnerPropertyView />}
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
            <Route
              path="tenant-repairs/:rr_id"
              element={<TenantRepairDetails />}
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
            <Route
              path="quotes-scheduled/:q_id"
              element={<MaintenanceQuoteScheduledDetail />}
            />
            <Route path="manager-utilities" element={<ManagerUtilities />} />
            <Route path="manager-profile" element={<ManagerProfile />} />
            <Route path="manager-documents" element={<ManagerDocuments />} />
            <Route path="owner-profile" element={<OwnerProfile />} />
            <Route path="owner-documents" element={<OwnerDocuments />} />
            <Route path="owner-utilities" element={<OwnerUtilities />} />
            <Route path="owner-repairs" element={<OwnerRepairList />} />
            <Route
              path="owner-repairRequest"
              element={<OwnerRepairRequest />}
            />
            <Route path="tenant-repairs" element={<TenantRepairList />} />
            <Route
              path="tenant-repairRequest"
              element={<TenantRepairRequest />}
            />
            <Route path="pm-list" element={<PropertyManagersList />} />
            <Route path="manager-payments" element={<ManagerPayments />} />
            <Route path="owner-payments" element={<OwnerPayments />} />
            <Route path="tenant-payments" element={<TenantPayments />} />
            <Route
              path="tenant-announcements"
              element={<TenantAnnouncements />}
            />
          </Route>
          <Route path="owner-cashflow" element={<OwnerCashflow />} />
          <Route path="manager-cashflow" element={<ManagerCashflow />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;

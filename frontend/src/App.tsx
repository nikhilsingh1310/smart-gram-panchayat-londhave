import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

// Citizen Pages
import { CitizenHome } from './pages/citizen/CitizenHome';
import { ServicesCatalog } from './pages/citizen/ServicesCatalog';
import { GramPanchayatInfo } from './pages/citizen/GramPanchayatInfo';
import { VillageInfo } from './pages/citizen/VillageInfo';
import { GovernmentSchemes } from './pages/citizen/GovernmentSchemes';
import { ComplaintPortal } from './pages/citizen/ComplaintPortal';
import { TaxPaymentPortal } from './pages/citizen/TaxPaymentPortal';
import { CertificatesPortal } from './pages/citizen/CertificatesPortal';
import { NoticeBoard } from './pages/citizen/NoticeBoard';
import { EventsCalendar } from './pages/citizen/EventsCalendar';
import { ImportantContacts } from './pages/citizen/ImportantContacts';
import { VillageDevelopmentDashboard } from './pages/citizen/VillageDevelopmentDashboard';
import { UtilitiesSchedule } from './pages/citizen/UtilitiesSchedule';
import { DocumentCenter } from './pages/citizen/DocumentCenter';
import { SurveysPolls } from './pages/citizen/SurveysPolls';
import { CitizenProfile } from './pages/citizen/CitizenProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminContentCMS } from './pages/admin/AdminContentCMS';
import { AdminComplaints } from './pages/admin/AdminComplaints';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

// Protected Route Guard for Staff/Admin
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-xs">Authenticating Admin Session...</div>;

  if (!user || !['EMPLOYEE', 'GP_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin Layout Shell
const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-slate-100 flex">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="p-4 sm:p-6 flex-1 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/content" element={<AdminContentCMS />} />
              <Route path="/complaints" element={<AdminComplaints />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/reports" element={<AdminReports />} />
              <Route path="/notifications" element={<AdminNotifications />} />
              <Route path="/audit" element={<AdminAuditLogs />} />
            </Routes>
          </main>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
};

// Main App Container
export const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!isAdminPath && <Navbar />}

      <div className={isAdminPath ? '' : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6'}>
        <Routes>
          {/* Citizen Routes */}
          <Route path="/" element={<CitizenHome />} />
          <Route path="/services" element={<ServicesCatalog />} />
          <Route path="/gp-info" element={<GramPanchayatInfo />} />
          <Route path="/village-info" element={<VillageInfo />} />
          <Route path="/schemes" element={<GovernmentSchemes />} />
          <Route path="/complaints" element={<ComplaintPortal />} />
          <Route path="/taxes" element={<TaxPaymentPortal />} />
          <Route path="/certificates" element={<CertificatesPortal />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/events" element={<EventsCalendar />} />
          <Route path="/contacts" element={<ImportantContacts />} />
          <Route path="/development" element={<VillageDevelopmentDashboard />} />
          <Route path="/utilities" element={<UtilitiesSchedule />} />
          <Route path="/documents" element={<DocumentCenter />} />
          <Route path="/polls" element={<SurveysPolls />} />
          <Route path="/profile" element={<CitizenProfile />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </div>

      {!isAdminPath && <BottomNav />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;

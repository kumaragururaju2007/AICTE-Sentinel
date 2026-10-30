import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstitutionSidebar from '../../components/institution/InstitutionSidebar';
import InstitutionNavbar from '../../components/institution/InstitutionNavbar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import AuditHistoryModal from '../../components/institution/AuditHistoryModal';
import { InstitutionProvider } from './context/InstitutionContext';

function InstitutionLayoutInner({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      setLogoutLoading(false);
      setLogoutModalOpen(false);
      navigate('/login');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 antialiased font-sans flex flex-col">
      {/* Sidebar */}
      <InstitutionSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogoutClick={() => setLogoutModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex flex-1 flex-col transition-all duration-300 lg:pl-72">
        {/* Top Navbar */}
        <InstitutionNavbar
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          onLogoutClick={() => setLogoutModalOpen(true)}
          onOpenAudit={() => setAuditModalOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Standard Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              AICTE Sentinel – Intelligent Approval & Compliance Automation Platform (SIH 2026)
            </span>
            <div className="flex items-center gap-4 text-slate-400">
              <button
                type="button"
                onClick={() => setAuditModalOpen(true)}
                className="hover:text-blue-600 transition-colors font-medium text-slate-500"
              >
                View Audit Trail
              </button>
              <span>•</span>
              <span>Team VALORA</span>
              <span>•</span>
              <span>Demo Mode</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign Out of Institution Portal"
        message="Are you sure you want to end your current session? You will be safely logged out and redirected to the sign-in page."
        confirmText="Confirm Sign Out"
        cancelText="Cancel"
        type="danger"
        loading={logoutLoading}
      />

      {/* Audit History Modal */}
      <AuditHistoryModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />
    </div>
  );
}

export default function InstitutionLayout({ children }) {
  return (
    <InstitutionProvider>
      <InstitutionLayoutInner>
        {children}
      </InstitutionLayoutInner>
    </InstitutionProvider>
  );
}


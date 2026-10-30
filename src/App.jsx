import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Providers
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ApplicationProvider } from './context/ApplicationContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public Pages
import LandingPage from './pages/LandingPage'
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthPages'

// Institution Portal Layout & Pages (Developer 1)
import InstitutionLayout from './portals/institution/InstitutionLayout'
import Dashboard from './portals/institution/Dashboard'
import NewApplication from './portals/institution/NewApplication'
import MyApplications from './portals/institution/MyApplications'
import ApplicationTracking from './portals/institution/ApplicationTracking'
import DeficiencyClarifications from './portals/institution/DeficiencyClarifications'
import DocumentRepository from './portals/institution/DocumentRepository'
import UndertakingCompliance from './portals/institution/UndertakingCompliance'
import LeaseValidity from './portals/institution/LeaseValidity'
import EVCInspection from './portals/institution/EVCInspection'
import Notifications from './portals/institution/Notifications'
import HelpSupport from './portals/institution/HelpSupport'
import InstitutionProfile from './portals/institution/InstitutionProfile'
import Settings from './portals/institution/Settings'

// Officer & Admin Portals (Developer 2)
import OfficerPortal from './portals/officer'
import AdminPortal from './portals/admin'

function InstitutionPortal({ children }) {
  return <InstitutionLayout>{children}</InstitutionLayout>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApplicationProvider>
          <BrowserRouter>
            <Routes>
            {/* 1. Public Shared Routes (No authentication required) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* 2. Institution Portal Routes (Protected - Role: institution) */}
            <Route
              path="/institution"
              element={<Navigate to="/institution/dashboard" replace />}
            />
            <Route
              path="/institution/dashboard"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <Dashboard />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/new-application"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <NewApplication />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/applications"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <MyApplications />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/application-tracking"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <ApplicationTracking />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/deficiencies"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <DeficiencyClarifications />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/documents"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <DocumentRepository />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/undertakings"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <UndertakingCompliance />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/compliance"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <UndertakingCompliance />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/lease-validity"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <LeaseValidity />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/evc-inspection"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <EVCInspection />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/notifications"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <Notifications />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/help-support"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <HelpSupport />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/profile"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <InstitutionProfile />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/settings"
              element={
                <ProtectedRoute allowedRole="institution">
                  <InstitutionPortal>
                    <Settings />
                  </InstitutionPortal>
                </ProtectedRoute>
              }
            />

            {/* 3. Regional Officer Portal Routes (Protected - Role: officer) */}
            <Route
              path="/officer"
              element={<Navigate to="/officer/dashboard" replace />}
            />
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerPortal initialPage="dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/assigned"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerPortal initialPage="applications" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/applications"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerPortal initialPage="applications" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/scrutiny"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerPortal initialPage="scrutiny" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/evc"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerPortal initialPage="evc" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/evc-management"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerPortal initialPage="evc" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/compliance"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerPortal initialPage="compliance" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/deficiencies"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerPortal initialPage="compliance" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/*"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerPortal />
                </ProtectedRoute>
              }
            />

            {/* 4. Administrator Portal Routes (Protected - Role: admin) */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal initialPage="dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal initialPage="users" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/institutions"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal initialPage="users" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/workflows"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal initialPage="workflows" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sla-config"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal initialPage="sla-config" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sla"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal initialPage="sla-config" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alerts"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal initialPage="alerts" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal initialPage="audit-logs" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal />
                </ProtectedRoute>
              }
            />

            {/* 5. Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ApplicationProvider>
    </AuthProvider>
  </ThemeProvider>
  )
}

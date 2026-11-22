import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import { LandingLayout } from './components/layout/LandingLayout';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { PharmacyLayout } from './components/layout/PharmacyLayout';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Landing
import { Home } from './pages/landing/Home';

// Patient
import { Dashboard as PatientDashboard } from './pages/patient/Dashboard';
import { Search } from './pages/patient/Search';
import { Results } from './pages/patient/Results';
import { MapView } from './pages/patient/Map';
import { Profile } from './pages/patient/Profile';

// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Pharmacies } from './pages/admin/Pharmacies';
import { Medicines } from './pages/admin/Medicines';
import { PharmacyDashboard } from './pages/pharmacy/Dashboard';
import { Inventory, Users, SystemStatus, GenericAdminPage } from './pages/admin/OtherAdminPages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Landing Pages */}
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Home />} />
          </Route>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Patient App Routes */}
          <Route element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/results" element={<Results />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Pharmacy Routes */}
          <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={['PHARMACY', 'ADMIN']} />}>
            <Route element={<PharmacyLayout />}>
              <Route index element={<Navigate to="/pharmacy/dashboard" replace />} />
              <Route path="dashboard" element={<PharmacyDashboard />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="pharmacies" element={<Pharmacies />} />
              <Route path="medicines" element={<Medicines />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="users" element={<Users />} />
                <Route path="availability" element={<Inventory />} />
                <Route path="optimization" element={<GenericAdminPage title="Optimization Engine" description="View real-time Greedy Set Cover and local search plan metrics." />} />
                <Route path="ml" element={<GenericAdminPage title="Machine Learning" description="Monitor Shortage and Delivery Time prediction models." />} />
                <Route path="recommendations" element={<GenericAdminPage title="Recommendations" description="Inspect generated medicine alternatives and scores." />} />
                <Route path="routes" element={<GenericAdminPage title="Route Executions" description="Audit historical map routes and durations." />} />
                <Route path="health" element={<GenericAdminPage title="Data Health" description="Detect orphaned records and missing coordinates." />} />
                <Route path="logs" element={<GenericAdminPage title="Activity Logs" description="Audit trail for administrative changes." />} />
                <Route path="status" element={<SystemStatus />} />
                <Route path="settings" element={<GenericAdminPage title="Settings" description="Configure search radiuses, limits, and provider keys." />} />
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

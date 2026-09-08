import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import ProfileButton from './components/ProfileButton';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Lvmdp from './pages/Lvmdp';
import Stp from './pages/Stp';
import WaterLevel from './pages/WaterLevel';
import GensetLog from './pages/GensetLog';
import Elektrikal from './pages/Elektrikal';
import CheckSheets from './pages/CheckSheets';
import PhotoDocumentation from './pages/PhotoDocumentation';
import ShiftHandover from './pages/ShiftHandover';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const Layout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Desktop: always visible, Mobile: toggle) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header dengan Hamburger Menu */}
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} title={title} />

        {/* Page Content */}
        <main className="flex-1 p-4 pb-24 lg:p-6 lg:pb-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Profile Button - Floating di kanan bawah */}
      <ProfileButton />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout title="Dashboard"><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/lvmdp" element={
          <ProtectedRoute>
            <Layout title="LVMDP"><Lvmdp /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/stp" element={
          <ProtectedRoute>
            <Layout title="STP"><Stp /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/water-log" element={
          <ProtectedRoute>
            <Layout title="Water Log"><WaterLevel /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/genset-log" element={
          <ProtectedRoute>
            <Layout title="Genset Log"><GensetLog /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/electrical-log" element={
          <ProtectedRoute>
            <Layout title="Electrical Log"><Elektrikal /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/check-sheets" element={
          <ProtectedRoute>
            <Layout title="Check Sheets"><CheckSheets /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/photo-docs" element={
          <ProtectedRoute>
            <Layout title="Photo Docs"><PhotoDocumentation /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/shift-handover" element={
          <ProtectedRoute>
            <Layout title="Shift Handover"><ShiftHandover /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout title="Reports"><Reports /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
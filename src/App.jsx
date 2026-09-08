import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import ProfileDropdown from './components/ProfileDropdown';
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout Component dengan Header Profile
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header dengan Profile Dropdown */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end items-center sticky top-0 z-40 shadow-sm">
          <ProfileDropdown />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/lvmdp" element={
          <ProtectedRoute>
            <Layout><Lvmdp /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/stp" element={
          <ProtectedRoute>
            <Layout><Stp /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/water-log" element={
          <ProtectedRoute>
            <Layout><WaterLevel /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/genset-log" element={
          <ProtectedRoute>
            <Layout><GensetLog /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/electrical-log" element={
          <ProtectedRoute>
            <Layout><Elektrikal /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/check-sheets" element={
          <ProtectedRoute>
            <Layout><CheckSheets /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/photo-docs" element={
          <ProtectedRoute>
            <Layout><PhotoDocumentation /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/shift-handover" element={
          <ProtectedRoute>
            <Layout><ShiftHandover /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout><Reports /></Layout>
          </ProtectedRoute>
        } />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
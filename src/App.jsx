import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';

// Import Pages
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
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

// Public Route (Login)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // Initial app loading - 1.5 detik
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/lvmdp" element={<ProtectedRoute><Lvmdp /></ProtectedRoute>} />
        <Route path="/stp" element={<ProtectedRoute><Stp /></ProtectedRoute>} />
        <Route path="/water-level" element={<ProtectedRoute><WaterLevel /></ProtectedRoute>} />
        <Route path="/genset-log" element={<ProtectedRoute><GensetLog /></ProtectedRoute>} />
        <Route path="/elektrikal" element={<ProtectedRoute><Elektrikal /></ProtectedRoute>} />
        <Route path="/check-sheets" element={<ProtectedRoute><CheckSheets /></ProtectedRoute>} />
        <Route path="/photo-documentation" element={<ProtectedRoute><PhotoDocumentation /></ProtectedRoute>} />
        <Route path="/shift-handover" element={<ProtectedRoute><ShiftHandover /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
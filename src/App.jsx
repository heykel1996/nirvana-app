import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Lvmdp from './pages/Lvmdp';
import Stp from './pages/Stp';
import WaterLevel from './pages/WaterLevel';
import ElektrikalPln from './pages/ElektrikalPln';
import CheckSheets from './pages/CheckSheets';
import PhotoDocumentation from './pages/PhotoDocumentation';
import ShiftHandover from './pages/ShiftHandover';
import Reports from './pages/Reports';
import GensetLog from './pages/GensetLog';  // ← BARU
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen text="Initializing Nirvana MEP System..." />;

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="lvmdp" element={<Lvmdp />} />
            <Route path="stp" element={<Stp />} />
            <Route path="water-level" element={<WaterLevel />} />
            <Route path="elektrikal-pln" element={<ElektrikalPln />} />
            <Route path="check-sheets" element={<CheckSheets />} />
            <Route path="photo-documentation" element={<PhotoDocumentation />} />
            <Route path="shift-handover" element={<ShiftHandover />} />
            <Route path="genset-log" element={<GensetLog />} />  {/* ← BARU */}
            <Route path="reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    lvmdp: [],
    waterLog: [],
    stp: [],
    gensetLog: [],
    checkSheets: [],
    photos: [],
    shiftHandover: []
  });
  const [stats, setStats] = useState({
    totalReadingsToday: 0,
    photosToday: 0,
    checkSheetsToday: 0,
    handoverToday: 0
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const today = new Date().toISOString().split('T')[0];

      console.log('🔄 Fetching dashboard data...');

      // Fetch all data in parallel
      const [lvmdpRes, waterRes, stpRes, gensetRes, checkRes, photoRes, handoverRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/lvmdp`, config),
        axios.get(`${API_BASE_URL}/api/water-level`, config),
        axios.get(`${API_BASE_URL}/api/stp`, config),
        axios.get(`${API_BASE_URL}/api/genset-log`, config),
        axios.get(`${API_BASE_URL}/api/check-sheets`, config),
        axios.get(`${API_BASE_URL}/api/photo-documentation`, config),
        axios.get(`${API_BASE_URL}/api/shift-handover`, config)
      ]);

      const lvmdp = lvmdpRes.status === 'fulfilled' ? (lvmdpRes.value.data.data || []) : [];
      const waterLog = waterRes.status === 'fulfilled' ? (waterRes.value.data.data || []) : [];
      const stp = stpRes.status === 'fulfilled' ? (stpRes.value.data.data || []) : [];
      const gensetLog = gensetRes.status === 'fulfilled' ? (gensetRes.value.data.data || []) : [];
      const checkSheets = checkRes.status === 'fulfilled' ? (checkRes.value.data.data || []) : [];
      const photos = photoRes.status === 'fulfilled' ? (photoRes.value.data.data || []) : [];
      const shiftHandover = handoverRes.status === 'fulfilled' ? (handoverRes.value.data.data || []) : [];

      setDashboardData({ lvmdp, waterLog, stp, gensetLog, checkSheets, photos, shiftHandover });

      // Calculate stats for today
      const lvmdpToday = lvmdp.filter(r => r.reading_date === today).length;
      const waterToday = waterLog.filter(r => r.reading_date === today).length;
      const stpToday = stp.filter(r => r.reading_date === today).length;
      const gensetToday = gensetLog.filter(r => r.reading_date === today).length;
      const checkToday = checkSheets.filter(r => r.reading_date === today).length;
      const photosToday = photos.filter(p => p.reading_date === today).length;
      const handoverToday = shiftHandover.filter(h => h.handover_date === today).length;

      const totalReadingsToday = lvmdpToday + waterToday + stpToday + gensetToday + checkToday;

      setStats({
        totalReadingsToday,
        photosToday,
        checkSheetsToday: checkToday,
        handoverToday
      });

      console.log('✅ Dashboard data loaded:', {
        lvmdp: lvmdp.length,
        waterLog: waterLog.length,
        stp: stp.length,
        gensetLog: gensetLog.length,
        checkSheets: checkSheets.length,
        photos: photos.length,
        shiftHandover: shiftHandover.length,
        totalReadingsToday,
        photosToday,
        checkSheetsToday,
        handoverToday
      });

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
    fetchDashboardData();
    toast.success('Dashboard di-refresh!');
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh setiap 60 detik
    const interval = setInterval(() => {
      console.log('⏰ Auto-refresh triggered');
      fetchDashboardData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getUserName = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.full_name || user.username || 'User';
    } catch {
      return 'User';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {getUserName()} 👋</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <svg 
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Readings Today */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Readings Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalReadingsToday}</p>
              <p className="text-xs text-gray-500 mt-1">
                LVMDP: {dashboardData.lvmdp.filter(r => r.reading_date === new Date().toISOString().split('T')[0]).length} |
                Water: {dashboardData.waterLog.filter(r => r.reading_date === new Date().toISOString().split('T')[0]).length} |
                STP: {dashboardData.stp.filter(r => r.reading_date === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Photos Today */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Photos Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.photosToday}</p>
              <p className="text-xs text-gray-500 mt-1">Dokumentasi foto</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Check Sheets Today */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Check Sheets Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.checkSheetsToday}</p>
              <p className="text-xs text-gray-500 mt-1">Building equipment</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Handover Today */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Handover Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.handoverToday}</p>
              <p className="text-xs text-gray-500 mt-1">Serah terima shift</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <button 
            onClick={() => navigate('/lvmdp')} 
            className="flex flex-col items-center gap-2 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition text-center"
          >
            <span className="text-3xl">⚡</span>
            <span className="text-sm font-medium">LVMDP</span>
          </button>
          <button 
            onClick={() => navigate('/water-log')} 
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-center"
          >
            <span className="text-3xl">💧</span>
            <span className="text-sm font-medium">Water Log</span>
          </button>
          <button 
            onClick={() => navigate('/stp')} 
            className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-center"
          >
            <span className="text-3xl">🌊</span>
            <span className="text-sm font-medium">STP</span>
          </button>
          <button 
            onClick={() => navigate('/genset-log')} 
            className="flex flex-col items-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition text-center"
          >
            <span className="text-3xl">⚙️</span>
            <span className="text-sm font-medium">Genset</span>
          </button>
          <button 
            onClick={() => navigate('/check-sheets')} 
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-center"
          >
            <span className="text-3xl">📋</span>
            <span className="text-sm font-medium">Check Sheet</span>
          </button>
          <button 
            onClick={() => navigate('/photo-docs')} 
            className="flex flex-col items-center gap-2 p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition text-center"
          >
            <span className="text-3xl">📷</span>
            <span className="text-sm font-medium">Photo</span>
          </button>
          <button 
            onClick={() => navigate('/shift-handover')} 
            className="flex flex-col items-center gap-2 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition text-center"
          >
            <span className="text-3xl">🔄</span>
            <span className="text-sm font-medium">Handover</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
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
    handoverToday: 0,
    totalAll: 0
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

      const lvmdpToday = lvmdp.filter(r => r.reading_date === today).length;
      const waterToday = waterLog.filter(r => r.reading_date === today).length;
      const stpToday = stp.filter(r => r.reading_date === today).length;
      const gensetToday = gensetLog.filter(r => r.reading_date === today).length;
      const checkToday = checkSheets.filter(r => r.reading_date === today).length;
      const photosToday = photos.filter(p => p.reading_date === today).length;
      const handoverToday = shiftHandover.filter(h => h.handover_date === today).length;

      const totalReadingsToday = lvmdpToday + waterToday + stpToday + gensetToday + checkToday;
      const totalAll = lvmdp.length + waterLog.length + stp.length + gensetLog.length + checkSheets.length + photos.length + shiftHandover.length;

      setStats({
        totalReadingsToday,
        photosToday,
        checkSheetsToday: checkToday,
        handoverToday,
        totalAll
      });

    } catch (error) {
      console.error(' Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
    toast.success('Dashboard di-refresh!');
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData(), 60000);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    return timeStr.toString().padStart(5, '0');
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

  const latestLVMDP = dashboardData.lvmdp[0];
  const latestWater = dashboardData.waterLog[0];
  const latestSTP = dashboardData.stp[0];
  const latestGenset = dashboardData.gensetLog[0];

  const recentActivity = [
    ...dashboardData.lvmdp.slice(0, 2).map(r => ({ type: 'LVMDP', date: r.reading_date, time: r.reading_time, detail: `KW: ${r.kw || '-'}`, color: 'bg-yellow-500' })),
    ...dashboardData.waterLog.slice(0, 2).map(r => ({ type: 'Water Log', date: r.reading_date, time: r.reading_time, detail: `Stand Meter: ${r.stand_meter || '-'}`, color: 'bg-blue-500' })),
    ...dashboardData.stp.slice(0, 2).map(r => ({ type: 'STP', date: r.reading_date, time: r.period, detail: `Flow: ${r.flow_meter_reading || '-'}`, color: 'bg-green-500' })),
    ...dashboardData.gensetLog.slice(0, 2).map(r => ({ type: 'Genset', date: r.reading_date, time: r.reading_time, detail: r.is_running ? 'Running' : 'Off', color: 'bg-orange-500' })),
    ...dashboardData.checkSheets.slice(0, 2).map(r => ({ type: 'Check Sheet', date: r.reading_date, time: `Shift ${r.shift_id}`, detail: r.petugas || '-', color: 'bg-purple-500' })),
    ...dashboardData.photos.slice(0, 2).map(r => ({ type: 'Photo', date: r.reading_date, time: '', detail: r.location || '-', color: 'bg-pink-500' })),
    ...dashboardData.shiftHandover.slice(0, 2).map(r => ({ type: 'Handover', date: r.handover_date, time: `Shift ${r.from_shift_id}→${r.to_shift_id}`, detail: r.from_user || '-', color: 'bg-indigo-500' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  // HAPUS max-w-7xl mx-auto agar full width tanpa spacing berlebih
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {getUserName()} 👋</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Readings Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReadingsToday}</p>
              <p className="text-xs text-gray-500 mt-2">Total All Data: {stats.totalAll}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Photos Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.photosToday}</p>
              <p className="text-xs text-gray-500 mt-2">Total: {dashboardData.photos.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Check Sheets Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.checkSheetsToday}</p>
              <p className="text-xs text-gray-500 mt-2">Total: {dashboardData.checkSheets.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Handover Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.handoverToday}</p>
              <p className="text-xs text-gray-500 mt-2">Total: {dashboardData.shiftHandover.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Data Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> Data Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{dashboardData.lvmdp.length}</p>
            <p className="text-xs text-gray-600 mt-1">LVMDP</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{dashboardData.waterLog.length}</p>
            <p className="text-xs text-gray-600 mt-1">Water Log</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{dashboardData.stp.length}</p>
            <p className="text-xs text-gray-600 mt-1">STP</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{dashboardData.gensetLog.length}</p>
            <p className="text-xs text-gray-600 mt-1">Genset</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{dashboardData.checkSheets.length}</p>
            <p className="text-xs text-gray-600 mt-1">Check Sheets</p>
          </div>
          <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-pink-600">{dashboardData.photos.length}</p>
            <p className="text-xs text-gray-600 mt-1">Photos</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{dashboardData.shiftHandover.length}</p>
            <p className="text-xs text-gray-600 mt-1">Handover</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span></span> Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <button onClick={() => navigate('/lvmdp')} className="flex flex-col items-center justify-center gap-2 p-5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 rounded-lg transition text-center">
            <span className="text-3xl">⚡</span>
            <span className="text-sm font-medium text-gray-700">LVMDP</span>
          </button>
          <button onClick={() => navigate('/water-log')} className="flex flex-col items-center justify-center gap-2 p-5 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition text-center">
            <span className="text-3xl">💧</span>
            <span className="text-sm font-medium text-gray-700">Water Log</span>
          </button>
          <button onClick={() => navigate('/stp')} className="flex flex-col items-center justify-center gap-2 p-5 bg-green-50 hover:bg-green-100 border border-green-100 rounded-lg transition text-center">
            <span className="text-sm font-bold text-gray-700">STP</span>
          </button>
          <button onClick={() => navigate('/genset-log')} className="flex flex-col items-center justify-center gap-2 p-5 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-lg transition text-center">
            <span className="text-3xl">⚙️</span>
            <span className="text-sm font-medium text-gray-700">Genset</span>
          </button>
          <button onClick={() => navigate('/check-sheets')} className="flex flex-col items-center justify-center gap-2 p-5 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg transition text-center">
            <span className="text-3xl">📋</span>
            <span className="text-sm font-medium text-gray-700">Check Sheet</span>
          </button>
          <button onClick={() => navigate('/photo-docs')} className="flex flex-col items-center justify-center gap-2 p-5 bg-pink-50 hover:bg-pink-100 border border-pink-100 rounded-lg transition text-center">
            <span className="text-3xl"></span>
            <span className="text-sm font-medium text-gray-700">Photo</span>
          </button>
          <button onClick={() => navigate('/shift-handover')} className="flex flex-col items-center justify-center gap-2 p-5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition text-center">
            <span className="text-3xl">🔄</span>
            <span className="text-sm font-medium text-gray-700">Handover</span>
          </button>
        </div>
      </div>

      {/* Latest Readings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest LVMDP */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">⚡ Latest LVMDP Reading</h3>
            <button onClick={() => navigate('/lvmdp')} className="text-blue-600 text-sm hover:underline">View All →</button>
          </div>
          {latestLVMDP ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(latestLVMDP.reading_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{formatTime(latestLVMDP.reading_time)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Ampere R</p>
                  <p className="font-bold text-blue-600">{latestLVMDP.ampere_r || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ampere S</p>
                  <p className="font-bold text-blue-600">{latestLVMDP.ampere_s || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ampere T</p>
                  <p className="font-bold text-blue-600">{latestLVMDP.ampere_t || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Volt RS</p>
                  <p className="font-bold text-green-600">{latestLVMDP.volt_rs || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Volt ST</p>
                  <p className="font-bold text-green-600">{latestLVMDP.volt_st || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Volt TR</p>
                  <p className="font-bold text-green-600">{latestLVMDP.volt_tr || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">KW</p>
                  <p className="font-bold text-orange-600">{latestLVMDP.kw || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cos Q</p>
                  <p className="font-bold text-orange-600">{latestLVMDP.cos_q || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hz</p>
                  <p className="font-bold text-orange-600">{latestLVMDP.hz || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data LVMDP</p>
              <button onClick={() => navigate('/lvmdp')} className="mt-2 text-blue-600 text-sm hover:underline">Tambah Reading →</button>
            </div>
          )}
        </div>

        {/* Latest Water Log */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">💧 Latest Water Log</h3>
            <button onClick={() => navigate('/water-log')} className="text-blue-600 text-sm hover:underline">View All →</button>
          </div>
          {latestWater ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(latestWater.reading_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{formatTime(latestWater.reading_time)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Stand Meter</p>
                  <p className="font-bold text-blue-600">{latestWater.stand_meter || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shift</p>
                  <p className="font-bold text-blue-600">Shift {latestWater.shift_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Reservoir 1</p>
                  <p className="font-bold text-green-600">{latestWater.reservoir_1 || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reservoir 2</p>
                  <p className="font-bold text-green-600">{latestWater.reservoir_2 || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reservoir 3</p>
                  <p className="font-bold text-green-600">{latestWater.reservoir_3 || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Boster Timur</p>
                  <p className="font-bold text-orange-600">{latestWater.boster_timur || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Boster Barat</p>
                  <p className="font-bold text-orange-600">{latestWater.boster_barat || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data Water Log</p>
              <button onClick={() => navigate('/water-log')} className="mt-2 text-blue-600 text-sm hover:underline">Tambah Water Log →</button>
            </div>
          )}
        </div>

        {/* Latest STP */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🌊 Latest STP Checklist</h3>
            <button onClick={() => navigate('/stp')} className="text-blue-600 text-sm hover:underline">View All →</button>
          </div>
          {latestSTP ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(latestSTP.reading_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Period</p>
                  <p className="font-medium">{latestSTP.period || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shift</p>
                  <p className="font-bold text-blue-600">Shift {latestSTP.shift_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Grit Chamber</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${latestSTP.grit_chamber_status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {latestSTP.grit_chamber_status || '-'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Aeration</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${latestSTP.aeration_status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {latestSTP.aeration_status || '-'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Equalizing</p>
                  <p className="font-bold text-sm">{latestSTP.equalizing_tank_status || '-'}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Sedimentation</p>
                  <p className="font-bold text-sm">{latestSTP.sedimentation_tank_status || '-'}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Effluent</p>
                  <p className="font-bold text-sm">{latestSTP.effluent_tank_status || '-'}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Pump Blower</p>
                  <p className="font-bold text-sm">{latestSTP.pump_blower_status || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data STP</p>
              <button onClick={() => navigate('/stp')} className="mt-2 text-blue-600 text-sm hover:underline">Tambah Checklist →</button>
            </div>
          )}
        </div>

        {/* Latest Genset */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">⚙️ Latest Genset Log</h3>
            <button onClick={() => navigate('/genset-log')} className="text-blue-600 text-sm hover:underline">View All →</button>
          </div>
          {latestGenset ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(latestGenset.reading_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{formatTime(latestGenset.reading_time)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${latestGenset.is_running ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {latestGenset.is_running ? 'RUNNING' : 'OFF'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Running Hours</p>
                  <p className="font-bold text-blue-600">{latestGenset.running_hours || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Battery 24VDC</p>
                  <p className="font-bold text-blue-600">{latestGenset.battery_24vdc || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Charger</p>
                  <p className="font-bold text-blue-600">{latestGenset.battery_charger_status || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Temperature</p>
                  <p className="font-bold text-orange-600">{latestGenset.engine_temperature || '-'}°C</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Oil Pressure</p>
                  <p className="font-bold text-orange-600">{latestGenset.oil_pressure || '-'} Bar</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Daily Tank</p>
                  <p className="font-bold text-orange-600">{latestGenset.daily_tank_volume || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data Genset</p>
              <button onClick={() => navigate('/genset-log')} className="mt-2 text-blue-600 text-sm hover:underline">Tambah Log →</button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📋</span> Recent Activity
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-2">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
                  <div>
                    <p className="font-medium text-sm">{activity.type}</p>
                    <p className="text-xs text-gray-500">{activity.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{formatDate(activity.date)}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Belum ada aktivitas</p>
            <p className="text-xs mt-1">Mulai isi form untuk melihat aktivitas di sini</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
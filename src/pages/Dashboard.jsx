import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    latestLVMDP: null,
    latestWaterLevel: null,
    latestSTP: null,
    latestGenset: null,
    latestCheckSheet: null
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const today = new Date().toISOString().split('T')[0];

      console.log(' Fetching dashboard data...');

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
      const todayReadings = [
        ...lvmdp.filter(r => r.reading_date === today),
        ...waterLog.filter(r => r.reading_date === today),
        ...stp.filter(r => r.reading_date === today),
        ...gensetLog.filter(r => r.reading_date === today),
        ...checkSheets.filter(r => r.reading_date === today)
      ];

      const todayPhotos = photos.filter(p => p.reading_date === today);

      // Get latest readings
      const latestLVMDP = lvmdp.length > 0 ? lvmdp[0] : null;
      const latestWater = waterLog.length > 0 ? waterLog[0] : null;
      const latestSTP = stp.length > 0 ? stp[0] : null;
      const latestGenset = gensetLog.length > 0 ? gensetLog[0] : null;
      const latestCheckSheet = checkSheets.length > 0 ? checkSheets[0] : null;

      setStats({
        totalReadingsToday: todayReadings.length,
        photosToday: todayPhotos.length,
        latestLVMDP,
        latestWaterLevel: latestWater,
        latestSTP,
        latestGenset,
        latestCheckSheet
      });

      console.log('✅ Dashboard data loaded:', {
        lvmdp: lvmdp.length,
        waterLog: waterLog.length,
        stp: stp.length,
        gensetLog: gensetLog.length,
        checkSheets: checkSheets.length,
        photos: photos.length,
        shiftHandover: shiftHandover.length,
        todayReadings: todayReadings.length,
        todayPhotos: todayPhotos.length
      });

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchDashboardData, 30000);
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
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {getUserName()} 👋</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Readings Today */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Check Sheets Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardData.checkSheets.filter(r => r.reading_date === new Date().toISOString().split('T')[0]).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Building equipment</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Shift Handover Today */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Handover Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardData.shiftHandover.filter(r => r.handover_date === new Date().toISOString().split('T')[0]).length}
              </p>
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

      {/* Latest Readings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Latest LVMDP */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">⚡ Latest LVMDP Reading</h3>
            <button onClick={() => navigate('/lvmdp')} className="text-blue-600 text-sm hover:underline">View All →</button>
          </div>
          {stats.latestLVMDP ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(stats.latestLVMDP.reading_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{formatTime(stats.latestLVMDP.reading_time)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Ampere R</p>
                  <p className="font-bold text-blue-600">{stats.latestLVMDP.ampere_r || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ampere S</p>
                  <p className="font-bold text-blue-600">{stats.latestLVMDP.ampere_s || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ampere T</p>
                  <p className="font-bold text-blue-600">{stats.latestLVMDP.ampere_t || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Volt RS</p>
                  <p className="font-bold text-green-600">{stats.latestLVMDP.volt_rs || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Volt ST</p>
                  <p className="font-bold text-green-600">{stats.latestLVMDP.volt_st || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Volt TR</p>
                  <p className="font-bold text-green-600">{stats.latestLVMDP.volt_tr || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">KW</p>
                  <p className="font-bold text-orange-600">{stats.latestLVMDP.kw || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cos Q</p>
                  <p className="font-bold text-orange-600">{stats.latestLVMDP.cos_q || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hz</p>
                  <p className="font-bold text-orange-600">{stats.latestLVMDP.hz || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data LVMDP</p>
              <button onClick={() => navigate('/lvmdp')} className="mt-2 text-blue-600 text-sm hover:underline">
                Tambah Reading →
              </button>
            </div>
          )}
        </div>

        {/* Latest Water Log */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">💧 Latest Water Log</h3>
            <button onClick={() => navigate('/water-log')} className="text-blue-600 text-sm hover:underline">View All →</button>
          </div>
          {stats.latestWaterLevel ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(stats.latestWaterLevel.reading_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{formatTime(stats.latestWaterLevel.reading_time)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Stand Meter</p>
                  <p className="font-bold text-blue-600">{stats.latestWaterLevel.stand_meter || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shift</p>
                  <p className="font-bold text-blue-600">Shift {stats.latestWaterLevel.shift_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Reservoir 1</p>
                  <p className="font-bold text-green-600">{stats.latestWaterLevel.reservoir_1 || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reservoir 2</p>
                  <p className="font-bold text-green-600">{stats.latestWaterLevel.reservoir_2 || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reservoir 3</p>
                  <p className="font-bold text-green-600">{stats.latestWaterLevel.reservoir_3 || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Boster Timur</p>
                  <p className="font-bold text-orange-600">{stats.latestWaterLevel.boster_timur || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Boster Barat</p>
                  <p className="font-bold text-orange-600">{stats.latestWaterLevel.boster_barat || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data Water Log</p>
              <button onClick={() => navigate('/water-log')} className="mt-2 text-blue-600 text-sm hover:underline">
                Tambah Water Log →
              </button>
            </div>
          )}
        </div>

        {/* Latest STP */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🌊 Latest STP Checklist</h3>
            <button onClick={() => navigate('/stp')} className="text-blue-600 text-sm hover:underline">View All →</button>
          </div>
          {stats.latestSTP ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(stats.latestSTP.reading_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Period</p>
                  <p className="font-medium">{stats.latestSTP.period || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shift</p>
                  <p className="font-bold text-blue-600">Shift {stats.latestSTP.shift_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Flow Meter</p>
                  <p className="font-bold text-green-600">{stats.latestSTP.flow_meter_reading || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Grit Chamber</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    stats.latestSTP.grit_chamber_status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stats.latestSTP.grit_chamber_status || '-'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Equalizing</p>
                  <p className="font-bold text-sm">{stats.latestSTP.equalizing_tank_status || '-'}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Aeration</p>
                  <p className="font-bold text-sm">{stats.latestSTP.aeration_status || '-'}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Sedimentation</p>
                  <p className="font-bold text-sm">{stats.latestSTP.sedimentation_tank_status || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data STP</p>
              <button onClick={() => navigate('/stp')} className="mt-2 text-blue-600 text-sm hover:underline">
                Tambah Checklist →
              </button>
            </div>
          )}
        </div>

        {/* Latest Genset Log */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">️ Latest Genset Log</h3>
            <button onClick={() => navigate('/genset-log')} className="text-blue-600 text-sm hover:underline">View All →</button>
          </div>
          {stats.latestGenset ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(stats.latestGenset.reading_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{formatTime(stats.latestGenset.reading_time)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    stats.latestGenset.is_running ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stats.latestGenset.is_running ? 'RUNNING' : 'OFF'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Running Hours</p>
                  <p className="font-bold text-blue-600">{stats.latestGenset.running_hours || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Battery 24VDC</p>
                  <p className="font-bold text-blue-600">{stats.latestGenset.battery_24vdc || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Charger</p>
                  <p className="font-bold text-blue-600">{stats.latestGenset.battery_charger_status || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Temperature</p>
                  <p className="font-bold text-orange-600">{stats.latestGenset.engine_temperature || '-'}°C</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Oil Pressure</p>
                  <p className="font-bold text-orange-600">{stats.latestGenset.oil_pressure || '-'} Bar</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Daily Tank</p>
                  <p className="font-bold text-orange-600">{stats.latestGenset.daily_tank_volume || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data Genset</p>
              <button onClick={() => navigate('/genset-log')} className="mt-2 text-blue-600 text-sm hover:underline">
                Tambah Log →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Recent Activity</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {[
              ...dashboardData.lvmdp.slice(0, 2).map(r => ({ type: 'LVMDP', date: r.reading_date, time: r.reading_time, detail: `KW: ${r.kw || '-'}` })),
              ...dashboardData.waterLog.slice(0, 2).map(r => ({ type: 'Water Log', date: r.reading_date, time: r.reading_time, detail: `Stand Meter: ${r.stand_meter || '-'}` })),
              ...dashboardData.stp.slice(0, 2).map(r => ({ type: 'STP', date: r.reading_date, time: r.period, detail: `Flow: ${r.flow_meter_reading || '-'}` })),
              ...dashboardData.gensetLog.slice(0, 2).map(r => ({ type: 'Genset', date: r.reading_date, time: r.reading_time, detail: r.is_running ? 'Running' : 'Off' })),
              ...dashboardData.checkSheets.slice(0, 2).map(r => ({ type: 'Check Sheet', date: r.reading_date, time: `Shift ${r.shift_id}`, detail: r.petugas || '-' })),
              ...dashboardData.photos.slice(0, 2).map(r => ({ type: 'Photo', date: r.reading_date, time: '', detail: r.location || '-' })),
              ...dashboardData.shiftHandover.slice(0, 2).map(r => ({ type: 'Handover', date: r.handover_date, time: `Shift ${r.from_shift_id}→${r.to_shift_id}`, detail: r.from_user || '-' }))
            ]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 10)
              .map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'LVMDP' ? 'bg-yellow-500' :
                      activity.type === 'Water Log' ? 'bg-blue-500' :
                      activity.type === 'STP' ? 'bg-green-500' :
                      activity.type === 'Genset' ? 'bg-orange-500' :
                      activity.type === 'Check Sheet' ? 'bg-purple-500' :
                      activity.type === 'Photo' ? 'bg-pink-500' : 'bg-indigo-500'
                    }`}></div>
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
            {dashboardData.lvmdp.length === 0 && dashboardData.waterLog.length === 0 && dashboardData.stp.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada aktivitas</p>
                <p className="text-xs mt-1">Mulai isi form untuk melihat aktivitas di sini</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4"> Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/lvmdp')} className="w-full flex items-center gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition text-left">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-medium text-sm">LVMDP</p>
                <p className="text-xs text-gray-600">Panel Tegangan Rendah</p>
              </div>
            </button>
            <button onClick={() => navigate('/water-log')} className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-left">
              <span className="text-2xl"></span>
              <div>
                <p className="font-medium text-sm">Water Log</p>
                <p className="text-xs text-gray-600">Water Log Sheet</p>
              </div>
            </button>
            <button onClick={() => navigate('/stp')} className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition text-left">
              <span className="text-2xl">🌊</span>
              <div>
                <p className="font-medium text-sm">STP</p>
                <p className="text-xs text-gray-600">Sewage Treatment Plant</p>
              </div>
            </button>
            <button onClick={() => navigate('/genset-log')} className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition text-left">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="font-medium text-sm">Genset Log</p>
                <p className="text-xs text-gray-600">Log Sheet Genset</p>
              </div>
            </button>
            <button onClick={() => navigate('/check-sheets')} className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-left">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-medium text-sm">Check Sheets</p>
                <p className="text-xs text-gray-600">Building Equipment</p>
              </div>
            </button>
            <button onClick={() => navigate('/photo-docs')} className="w-full flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition text-left">
              <span className="text-2xl">📷</span>
              <div>
                <p className="font-medium text-sm">Photo Docs</p>
                <p className="text-xs text-gray-600">Photo Documentation</p>
              </div>
            </button>
            <button onClick={() => navigate('/shift-handover')} className="w-full flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition text-left">
              <span className="text-2xl">🔄</span>
              <div>
                <p className="font-medium text-sm">Shift Handover</p>
                <p className="text-xs text-gray-600">Serah Terima Shift</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
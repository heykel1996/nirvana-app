import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    lvmdp_load: 0,
    water_level: 0,
    total_readings: 0,
    photos_today: 0,
    recent_lvmdp: []
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000 // 5 detik timeout
      };

      // Fetch semua data secara parallel
      const [lvmdpRes, waterRes, photoRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/lvmdp`, config).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE_URL}/api/water-level`, config).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE_URL}/api/photo-documentation`, config).catch(() => ({ data: { data: [] } }))
      ]);

      const lvmdpData = lvmdpRes.data.data || [];
      const waterData = waterRes.data.data || [];
      const photoData = photoRes.data.data || [];

      // Hitung statistik
      const today = new Date().toISOString().split('T')[0];
      const todayReadings = lvmdpData.filter(item => item.reading_date === today).length +
                           waterData.filter(item => item.reading_date === today).length;
      const todayPhotos = photoData.filter(item => item.reading_date === today).length;

      // Ambil LVMDP terbaru (5 data)
      const recentLvmdp = lvmdpData.slice(0, 5);

      // Hitung load kW terakhir
      const lastKw = lvmdpData.length > 0 ? lvmdpData[0].kw || 0 : 0;

      // Hitung water level percentage
      let waterPercentage = 0;
      if (waterData.length > 0) {
        const lastWater = waterData[0];
        if (lastWater.reservoir_level === 'F') waterPercentage = 100;
        else if (lastWater.reservoir_level === 'M') waterPercentage = 50;
        else if (lastWater.reservoir_level === 'L') waterPercentage = 10;
      }

      setStats({
        lvmdp_load: lastKw,
        water_level: waterPercentage,
        total_readings: todayReadings,
        photos_today: todayPhotos,
        recent_lvmdp: recentLvmdp
      });

    } catch (error) {
      console.warn('Dashboard fetch error (non-critical):', error.message);
      // Jangan tampilkan error ke user, cukup log di console
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Selamat datang di Nirvana MEP Engineering System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* LVMDP Load */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">LVMDP Load</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lvmdp_load} kW</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>

        {/* Water Level */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Water Level</p>
              <p className="text-2xl font-bold text-gray-900">{stats.water_level}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💧</span>
            </div>
          </div>
        </div>

        {/* Total Readings */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Readings Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_readings}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        {/* Photos Today */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Photos Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.photos_today}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent LVMDP Readings */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent LVMDP Readings</h2>
          <p className="text-sm text-gray-500 mt-1">5 pembacaan terakhir</p>
        </div>
        
        {stats.recent_lvmdp.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="mb-4">Belum ada data LVMDP. Silakan tambah data baru.</p>
            <button 
              onClick={() => navigate('/lvmdp')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              + Tambah Data LVMDP
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Load (kW)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voltage RS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current R</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recent_lvmdp.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.reading_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.reading_time}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.kw}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.volt_rs}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.ampere_r}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Normal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => navigate('/lvmdp')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <div className="text-left">
              <h3 className="font-bold text-lg">LVMDP</h3>
              <p className="text-sm text-blue-100">Panel Tegangan Rendah</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/stp')}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl"></span>
            <div className="text-left">
              <h3 className="font-bold text-lg">STP</h3>
              <p className="text-sm text-green-100">Sewage Treatment Plant</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/water-level')}
          className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">💧</span>
            <div className="text-left">
              <h3 className="font-bold text-lg">Water Log</h3>
              <p className="text-sm text-cyan-100">Water Log Sheet</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
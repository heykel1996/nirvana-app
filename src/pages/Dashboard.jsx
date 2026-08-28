import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    lvmdp: { load_kw: 0, voltage: 0, current: 0 },
    water_level: 0,
    total_readings: 0,
    photos_today: 0,
    recent_readings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch summary data
      const [summaryRes, lvmdpRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/lvmdp`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (summaryRes.data.success) {
        setSummary(summaryRes.data.data);
      }

      if (lvmdpRes.data.success) {
        setSummary(prev => ({
          ...prev,
          recent_readings: lvmdpRes.data.data.slice(0, 5)
        }));
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Selamat datang di Nirvana MEP Engineering System</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<span className="text-2xl">⚡</span>}
          title="LVMDP Load"
          value={`${summary.lvmdp.load_kw} kW`}
          color="bg-blue-100"
        />
        <StatCard
          icon={<span className="text-2xl">💧</span>}
          title="Water Level"
          value={`${summary.water_level}%`}
          color="bg-green-100"
        />
        <StatCard
          icon={<span className="text-2xl">📊</span>}
          title="Total Readings Today"
          value={summary.total_readings}
          color="bg-purple-100"
        />
        <StatCard
          icon={<span className="text-2xl">📷</span>}
          title="Photos Today"
          value={summary.photos_today}
          color="bg-yellow-100"
        />
      </div>

      {/* Recent LVMDP Readings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent LVMDP Readings</h3>
          <p className="text-sm text-gray-500 mt-1">5 pembacaan terakhir</p>
        </div>
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
              {summary.recent_readings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Belum ada data LVMDP. Silakan tambah data baru.
                  </td>
                </tr>
              ) : (
                summary.recent_readings.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.reading_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.reading_time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.kw} kW</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.volt_rs} V</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.ampere_r} A</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Normal
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/lvmdp" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:shadow-lg transition-shadow">
          <h3 className="font-semibold"> LVMDP</h3>
          <p className="text-sm opacity-90">Panel Tegangan Rendah</p>
        </a>
        <a href="/stp" className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:shadow-lg transition-shadow">
          <h3 className="font-semibold">🧪 STP</h3>
          <p className="text-sm opacity-90">Sewage Treatment Plant</p>
        </a>
        <a href="/water-level" className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-xl hover:shadow-lg transition-shadow">
          <h3 className="font-semibold">💧 Water Log</h3>
          <p className="text-sm opacity-90">Water Log Sheet</p>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
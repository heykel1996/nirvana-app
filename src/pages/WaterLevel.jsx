import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const WaterLevels = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shift_id: 1,
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: new Date().toTimeString().split(' ')[0],
    tank_name: '',
    tank_location: '',
    capacity_liters: '',
    current_level_liters: '',
    level_percentage: '',
    water_quality: 'good',
    ph_level: '',
    temperature: '',
    status: 'normal',
    notes: '',
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/water-levels`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch water levels');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/water-levels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Data berhasil dihapus!');
      fetchData();
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/water-levels`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Water level data berhasil disimpan!');
      setShowForm(false);
      fetchData();
      setFormData({
        shift_id: 1,
        reading_date: new Date().toISOString().split('T')[0],
        reading_time: new Date().toTimeString().split(' ')[0],
        tank_name: '',
        tank_location: '',
        capacity_liters: '',
        current_level_liters: '',
        level_percentage: '',
        water_quality: 'good',
        ph_level: '',
        temperature: '',
        status: 'normal',
        notes: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Gagal menyimpan data');
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Water Levels</h1>
          <p className="text-gray-600 mt-1">Tangki Air Monitoring System</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg font-medium"
        >
          {showForm ? '✕ Cancel' : '+ Add New Reading'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Add Water Level Reading</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={formData.reading_date} onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" value={formData.reading_time} onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tank Name</label>
              <input type="text" value={formData.tank_name} onChange={(e) => setFormData({ ...formData, tank_name: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" placeholder="e.g., Main Tank" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tank Location</label>
              <input type="text" value={formData.tank_location} onChange={(e) => setFormData({ ...formData, tank_location: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" placeholder="e.g., Basement" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Liters)</label>
              <input type="number" value={formData.capacity_liters} onChange={(e) => setFormData({ ...formData, capacity_liters: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Level (Liters)</label>
              <input type="number" value={formData.current_level_liters} onChange={(e) => setFormData({ ...formData, current_level_liters: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level Percentage (%)</label>
              <input type="number" step="0.01" value={formData.level_percentage} onChange={(e) => setFormData({ ...formData, level_percentage: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water Quality</label>
              <select value={formData.water_quality} onChange={(e) => setFormData({ ...formData, water_quality: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5">
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">pH Level</label>
              <input type="number" step="0.01" value={formData.ph_level} onChange={(e) => setFormData({ ...formData, ph_level: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
              <input type="number" step="0.01" value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5">
                <option value="normal">Normal</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">
                Save Water Level Reading
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-x-auto">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Water Level Readings</h3>
          <p className="text-sm text-gray-500 mt-1">{data.length} records found</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No water level readings yet.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.reading_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.tank_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.tank_location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.level_percentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.water_quality}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                      item.status === 'normal' ? 'bg-green-100 text-green-800' : 
                      item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      ️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaterLevels;
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const ElektrikalPln = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: '07:00',
    shift_id: 1,
    petugas: '',
    lvmdp_reading: '',
    capacitor_bank_reading: '',
    hvmdp_reading: '',
    transformer_temp: '',
    transformer_vol: '',
    volume_solar_harian: '',
    volume_solar_utama: '',
    battery_charger_status: 'ON',
    battery_24vdc: '',
    meter_pam: '',
    meter_deep_well: '',
    pompa_delivery_a: '',
    pompa_delivery_b: '',
    pompa_boster_1a: '',
    pompa_boster_2a: '',
    pompa_boster_1b: '',
    pompa_boster_2b: '',
    ground_tank_level: 'F',
    roof_tank_a_level: 'F',
    roof_tank_b_level: 'F',
    notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/elektrikal-pln`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch electrical log');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/elektrikal-pln/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Data berhasil dihapus!');
      fetchData();
    } catch (error) { toast.error('Gagal menghapus data'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/elektrikal-pln`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Electrical log berhasil disimpan!');
      setShowForm(false);
      fetchData();
    } catch (error) { toast.error(error.response?.data?.error || 'Gagal menyimpan'); }
  };

  const InputField = ({ label, name, type = 'text', step = '0.01' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        step={type === 'number' ? step : undefined}
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className="w-full rounded-lg border-gray-300 border p-2.5"
      />
    </div>
  );

  const LevelSelect = ({ label, name }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className="w-full rounded-lg border-gray-300 border p-2.5"
      >
        <option value="F">F - Full</option>
        <option value="M">M - Medium</option>
        <option value="L">L - Low</option>
        <option value="E">E - Empty</option>
      </select>
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Electrical Log Sheet (PLN)</h1>
          <p className="text-gray-600 mt-1">Catatan Meter Listrik PLN & Peralatan</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg font-medium"
        >
          {showForm ? '✕ Cancel' : '+ Add New Log'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Add Electrical Log</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={formData.reading_date} onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
                <input type="time" value={formData.reading_time} onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                <select value={formData.shift_id} onChange={(e) => setFormData({ ...formData, shift_id: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 border p-2.5">
                  <option value="1">Shift 1 (07:00-15:00)</option>
                  <option value="2">Shift 2 (15:00-22:00)</option>
                  <option value="3">Shift 3 (22:00-07:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Petugas</label>
                <input type="text" value={formData.petugas} onChange={(e) => setFormData({ ...formData, petugas: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">📊 Catat Meter Listrik PLN</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="LVMDP" name="lvmdp_reading" />
                <InputField label="Capacitor Bank" name="capacitor_bank_reading" />
                <InputField label="HVMDP" name="hvmdp_reading" />
                <InputField label="Transformer Temp (°C)" name="transformer_temp" />
                <InputField label="Transformer Vol" name="transformer_vol" />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">⛽ Volume Solar & Battery</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Volume Solar Harian (Liter)" name="volume_solar_harian" />
                <InputField label="Volume Solar Utama (Liter)" name="volume_solar_utama" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Battery Charger</label>
                  <select value={formData.battery_charger_status} onChange={(e) => setFormData({ ...formData, battery_charger_status: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5">
                    <option value="ON">ON</option>
                    <option value="OFF">OFF</option>
                    <option value="Broken">Broken</option>
                  </select>
                </div>
                <InputField label="Battery 24VDC (Volt)" name="battery_24vdc" />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">💧 Water Meter</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Meter PAM" name="meter_pam" />
                <InputField label="Meter Deep Well" name="meter_deep_well" />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">🔧 Pompa</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField label="Pompa Delivery A" name="pompa_delivery_a" />
                <InputField label="Pompa Delivery B" name="pompa_delivery_b" />
                <InputField label="Pompa Boster 1A" name="pompa_boster_1a" />
                <InputField label="Pompa Boster 2A" name="pompa_boster_2a" />
                <InputField label="Pompa Boster 1B" name="pompa_boster_1b" />
                <InputField label="Pompa Boster 2B" name="pompa_boster_2b" />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">🏊 Tank Levels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LevelSelect label="Ground Tank" name="ground_tank_level" />
                <LevelSelect label="Roof Tank A" name="roof_tank_a_level" />
                <LevelSelect label="Roof Tank B" name="roof_tank_b_level" />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" rows="2" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">
              Save Electrical Log
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-x-auto">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Electrical Logs</h3>
          <p className="text-sm text-gray-500 mt-1">{data.length} records found</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Petugas</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">LVMDP</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cap. Bank</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HVMDP</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trans. Temp</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solar Harian</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solar Utama</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Battery</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Meter PAM</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deep Well</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ground</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roof A</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roof B</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr><td colSpan="17" className="px-6 py-8 text-center text-gray-500">No electrical logs yet.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-sm">{item.reading_date}</td>
                  <td className="px-3 py-3 text-sm">{item.reading_time}</td>
                  <td className="px-3 py-3 text-sm">{item.shift_name || `Shift ${item.shift_id}`}</td>
                  <td className="px-3 py-3 text-sm">{item.petugas || item.user_name}</td>
                  <td className="px-3 py-3 text-sm">{item.lvmdp_reading}</td>
                  <td className="px-3 py-3 text-sm">{item.capacitor_bank_reading}</td>
                  <td className="px-3 py-3 text-sm">{item.hvmdp_reading}</td>
                  <td className="px-3 py-3 text-sm">{item.transformer_temp}°C</td>
                  <td className="px-3 py-3 text-sm">{item.volume_solar_harian}L</td>
                  <td className="px-3 py-3 text-sm">{item.volume_solar_utama}L</td>
                  <td className="px-3 py-3 text-sm">{item.battery_24vdc}V</td>
                  <td className="px-3 py-3 text-sm">{item.meter_pam}</td>
                  <td className="px-3 py-3 text-sm">{item.meter_deep_well}</td>
                  <td className="px-3 py-3 text-sm"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{item.ground_tank_level}</span></td>
                  <td className="px-3 py-3 text-sm"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{item.roof_tank_a_level}</span></td>
                  <td className="px-3 py-3 text-sm"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{item.roof_tank_b_level}</span></td>
                  <td className="px-3 py-3">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
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

export default ElektrikalPln;
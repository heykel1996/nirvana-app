import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const GensetLog = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: '07:00',
    shift_id: 1,
    petugas: '',
    is_running: 0,
    running_hours: '',
    daily_tank_volume: '',
    storage_tank_volume: '',
    battery_24vdc: '',
    battery_charger_status: 'ON',
    engine_temperature: '',
    oil_pressure: '',
    ampere_accu: '',
    pipa_bahan_bakar_checked: 0,
    filter_checked: 0,
    visual_inspection: 0,
    air_filter_connection: 0,
    air_filter_pipe: 0,
    air_filter_replace: 0,
    air_filter_clean: 0,
    mesin_bersih: 0,
    kabel_accu_checked: 0,
    notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/genset-log`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
    } catch (error) { toast.error('Failed to fetch genset log'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/genset-log/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Data dihapus!');
      fetchData();
    } catch (error) { toast.error('Gagal menghapus'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/genset-log`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Genset log berhasil disimpan!');
      setShowForm(false);
      fetchData();
    } catch (error) { toast.error('Gagal menyimpan'); }
  };

  const CheckboxItem = ({ label, field }) => (
    <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
      <input
        type="checkbox"
        checked={formData[field] === 1}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.checked ? 1 : 0 })}
        className="w-4 h-4 text-blue-600 rounded"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
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
          <h1 className="text-3xl font-bold text-gray-900">Log Sheet Genset</h1>
          <p className="text-gray-600 mt-1">Monitoring Genset, Battery & Checklist</p>
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
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Add Genset Log</h2>
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
              <h3 className="text-lg font-medium text-gray-900 mb-3">⚙️ Running Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Is Genset Running?</label>
                  <select value={formData.is_running} onChange={(e) => setFormData({ ...formData, is_running: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 border p-2.5">
                    <option value="0">❌ No (OFF)</option>
                    <option value="1">✅ Yes (ON)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Running Hours</label>
                  <input type="number" step="0.01" value={formData.running_hours} onChange={(e) => setFormData({ ...formData, running_hours: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">⛽ Volume Solar (Liter)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Tank</label>
                  <input type="number" step="0.01" value={formData.daily_tank_volume} onChange={(e) => setFormData({ ...formData, daily_tank_volume: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Tank</label>
                  <input type="number" step="0.01" value={formData.storage_tank_volume} onChange={(e) => setFormData({ ...formData, storage_tank_volume: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3"> Battery 24VDC (25-29 Volt DC)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Battery 24VDC (Volt)</label>
                  <input type="number" step="0.01" value={formData.battery_24vdc} onChange={(e) => setFormData({ ...formData, battery_24vdc: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Battery Charger</label>
                  <select value={formData.battery_charger_status} onChange={(e) => setFormData({ ...formData, battery_charger_status: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5">
                    <option value="ON">ON</option>
                    <option value="OFF">OFF</option>
                    <option value="Broken">Broken</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">🌡️ Monitor Mesin</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                  <input type="number" step="0.01" value={formData.engine_temperature} onChange={(e) => setFormData({ ...formData, engine_temperature: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" placeholder="OFF: 36-40°C, Run: 70-90°C" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Oil Pressure (Bar)</label>
                  <input type="number" step="0.01" value={formData.oil_pressure} onChange={(e) => setFormData({ ...formData, oil_pressure: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" placeholder="OFF: 0 Bar, Run: 3.5-5 Bar" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ampere Accu</label>
                  <input type="number" step="0.01" value={formData.ampere_accu} onChange={(e) => setFormData({ ...formData, ampere_accu: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" placeholder="OFF: 0A, Run: ...A" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">✅ Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <CheckboxItem label="1. Check pipa supply & return bahan bakar" field="pipa_bahan_bakar_checked" />
                <CheckboxItem label="2. Check filter (bahan bakar, radiator, kebocoran)" field="filter_checked" />
                <CheckboxItem label="3. Object visual kondisi mesin" field="visual_inspection" />
                <CheckboxItem label="4. Connection udara (air filter)" field="air_filter_connection" />
                <CheckboxItem label="5. Check pipa penghubung & rumah filter" field="air_filter_pipe" />
                <CheckboxItem label="6. Ganti saringan udara bila penuh" field="air_filter_replace" />
                <CheckboxItem label="7. Check & bersihkan saringan udara (turbo)" field="air_filter_clean" />
                <CheckboxItem label="8. Bersihkan keseluruhan bagian mesin" field="mesin_bersih" />
                <CheckboxItem label="9. Check kabel accu (korosi)" field="kabel_accu_checked" />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" rows="2" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">
              Save Genset Log
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-x-auto">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Genset Logs</h3>
          <p className="text-sm text-gray-500 mt-1">{data.length} records found</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Petugas</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Tank</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Storage</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Battery</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Charger</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temp</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oil</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ampere</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr><td colSpan="14" className="px-6 py-8 text-center text-gray-500">No genset logs yet.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-sm">{item.reading_date}</td>
                  <td className="px-3 py-3 text-sm">{item.reading_time}</td>
                  <td className="px-3 py-3 text-sm">{item.shift_name || `Shift ${item.shift_id}`}</td>
                  <td className="px-3 py-3 text-sm">{item.petugas || item.user_name}</td>
                  <td className="px-3 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.is_running ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.is_running ? 'RUNNING' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm">{item.running_hours}</td>
                  <td className="px-3 py-3 text-sm">{item.daily_tank_volume}L</td>
                  <td className="px-3 py-3 text-sm">{item.storage_tank_volume}L</td>
                  <td className="px-3 py-3 text-sm">{item.battery_24vdc}V</td>
                  <td className="px-3 py-3 text-sm">{item.battery_charger_status}</td>
                  <td className="px-3 py-3 text-sm">{item.engine_temperature}°C</td>
                  <td className="px-3 py-3 text-sm">{item.oil_pressure} Bar</td>
                  <td className="px-3 py-3 text-sm">{item.ampere_accu}A</td>
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

export default GensetLog;
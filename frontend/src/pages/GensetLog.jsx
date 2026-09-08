import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const GensetLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: '07:00',
    shift_id: 1,
    is_running: 0,
    running_hours: '',
    daily_tank_volume: '',
    storage_tank_volume: '',
    battery_24vdc: '',
    battery_charger_status: 'OFF',
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

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/genset-log`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching genset logs:', error);
      toast.error('Gagal memuat data genset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('📤 Sending Genset data:', formData);

      const response = await axios.post(
        `${API_BASE_URL}/api/genset-log`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Genset Response:', response.data);

      if (response.data && response.data.success) {
        toast.success('Log genset berhasil disimpan!');
        setShowForm(false);
        fetchLogs();
      } else {
        toast.error('Gagal menyimpan data');
      }
    } catch (error) {
      console.error('❌ Genset Error:', error);
      toast.error('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/genset-log/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Data dihapus');
      fetchLogs();
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Log Sheet Genset</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Tutup Form' : '+ Add New Log'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
          <h2 className="text-xl font-semibold">Input Log Genset</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal</label>
              <input type="date" name="reading_date" value={formData.reading_date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jam</label>
              <input type="time" name="reading_time" value={formData.reading_time} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shift</label>
              <select name="shift_id" value={formData.shift_id} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value={1}>Shift 1</option>
                <option value={2}>Shift 2</option>
                <option value={3}>Shift 3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status Running</label>
              <select name="is_running" value={formData.is_running} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value={0}>OFF</option>
                <option value={1}>ON</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Running Hours</label>
              <input type="number" name="running_hours" value={formData.running_hours} onChange={handleChange} step="0.1" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Daily Tank Volume</label>
              <input type="number" name="daily_tank_volume" value={formData.daily_tank_volume} onChange={handleChange} step="0.01" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Storage Tank Volume</label>
              <input type="number" name="storage_tank_volume" value={formData.storage_tank_volume} onChange={handleChange} step="0.01" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Battery 24VDC (Volt)</label>
              <input type="number" name="battery_24vdc" value={formData.battery_24vdc} onChange={handleChange} step="0.1" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Battery Charger</label>
              <select name="battery_charger_status" value={formData.battery_charger_status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="OFF">OFF</option>
                <option value="ON">ON</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Engine Temperature (°C)</label>
              <input type="number" name="engine_temperature" value={formData.engine_temperature} onChange={handleChange} step="0.1" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Oil Pressure (Bar)</label>
              <input type="number" name="oil_pressure" value={formData.oil_pressure} onChange={handleChange} step="0.1" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ampere Accu</label>
              <input type="number" name="ampere_accu" value={formData.ampere_accu} onChange={handleChange} step="0.1" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Checklist</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'pipa_bahan_bakar_checked', label: '1. Check pipa supply & return bahan bakar' },
                { name: 'filter_checked', label: '2. Check filter (bahan bakar, radiator, kebocoran)' },
                { name: 'visual_inspection', label: '3. Object visual kondisi mesin' },
                { name: 'air_filter_connection', label: '4. Connection udara (air filter)' },
                { name: 'air_filter_pipe', label: '5. Check pipa penghubung & rumah filter' },
                { name: 'air_filter_replace', label: '6. Ganti saringan udara bila penuh' },
                { name: 'air_filter_clean', label: '7. Check & bersihkan saringan udara (turbo)' },
                { name: 'mesin_bersih', label: '8. Bersihkan keseluruhan bagian mesin' },
                { name: 'kabel_accu_checked', label: '9. Check kabel accu (korosi)' }
              ].map((item, idx) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input type="checkbox" name={item.name} checked={formData[item.name] === 1} onChange={handleChange} className="rounded" />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full border rounded px-3 py-2" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Simpan Log Genset
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-bold p-4 border-b">All Genset Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Daily Tank</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Storage</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Battery</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Charger</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Temp</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Oil</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ampere</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="13" className="px-4 py-8 text-center">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="13" className="px-4 py-8 text-center text-gray-500">No genset logs yet.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(log.reading_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">{log.reading_time}</td>
                    <td className="px-4 py-2">Shift {log.shift_id}</td>
                    <td className="px-4 py-2">{log.is_running ? 'ON' : 'OFF'}</td>
                    <td className="px-4 py-2">{log.running_hours}</td>
                    <td className="px-4 py-2">{log.daily_tank_volume}</td>
                    <td className="px-4 py-2">{log.storage_tank_volume}</td>
                    <td className="px-4 py-2">{log.battery_24vdc}</td>
                    <td className="px-4 py-2">{log.battery_charger_status}</td>
                    <td className="px-4 py-2">{log.engine_temperature}</td>
                    <td className="px-4 py-2">{log.oil_pressure}</td>
                    <td className="px-4 py-2">{log.ampere_accu}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleDelete(log.id)} className="text-red-600 hover:text-red-800 text-sm">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GensetLog;
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const WaterLevel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: '07:00',
    shift_id: 1,
    stand_meter: '',
    reservoir_1: 'M',
    reservoir_2: 'M',
    reservoir_3: 'M',
    boster_timur: '',
    boster_barat: '',
    transfer_timur: '',
    transfer_barat: '',
    notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/water-level`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
    } catch (error) { toast.error('Failed to fetch water level data'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/water-level/${id}`, {
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
      await axios.post(`${API_BASE_URL}/api/water-level`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Water Log berhasil disimpan!');
      setShowForm(false);
      setFormData({
        reading_date: new Date().toISOString().split('T')[0],
        reading_time: '07:00',
        shift_id: 1,
        stand_meter: '',
        reservoir_1: 'M',
        reservoir_2: 'M',
        reservoir_3: 'M',
        boster_timur: '',
        boster_barat: '',
        transfer_timur: '',
        transfer_barat: '',
        notes: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Gagal menyimpan');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const ReservoirSelect = ({ label, field }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select 
        value={formData[field]} 
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="F">F - Full (Penuh)</option>
        <option value="M">M - Medium (Sedang)</option>
        <option value="L">L - Low (Rendah)</option>
      </select>
    </div>
  );

  const PressureInput = ({ label, field }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} (Bar)</label>
      <input
        type="number"
        step="0.01"
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
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
          <h1 className="text-3xl font-bold text-gray-900">Water Log Sheet</h1>
          <p className="text-gray-600 mt-1">Monitoring Tangki Air & Pressure</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg font-medium"
        >
          {showForm ? '✕ Cancel' : '+ Add Water Log'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Add Water Log</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={formData.reading_date} onChange={(e) => handleChange('reading_date', e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                <input type="time" value={formData.reading_time} onChange={(e) => handleChange('reading_time', e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                <select value={formData.shift_id} onChange={(e) => handleChange('shift_id', parseInt(e.target.value))} className="w-full rounded-lg border-gray-300 border p-2.5">
                  <option value="1">Shift 1 (07:00-15:00)</option>
                  <option value="2">Shift 2 (15:00-22:00)</option>
                  <option value="3">Shift 3 (22:00-07:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stand Meter</label>
                <input type="number" step="0.01" value={formData.stand_meter} onChange={(e) => handleChange('stand_meter', e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
            </div>

            {/* Reservoir (3 kolom sesuai PDF) */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">💧 Reservoir (F/M/L)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReservoirSelect label="Reservoir 1" field="reservoir_1" />
                <ReservoirSelect label="Reservoir 2" field="reservoir_2" />
                <ReservoirSelect label="Reservoir 3" field="reservoir_3" />
              </div>
            </div>

            {/* Pressure Boster */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3"> Pressure Boster (Bar)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PressureInput label="Boster Timur" field="boster_timur" />
                <PressureInput label="Boster Barat" field="boster_barat" />
              </div>
            </div>

            {/* Pressure Transfer */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">🟢 Pressure Transfer (Bar)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PressureInput label="Transfer Timur" field="transfer_timur" />
                <PressureInput label="Transfer Barat" field="transfer_barat" />
              </div>
            </div>

            {/* Notes */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5" rows="2" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">
              Save Water Log
            </button>
          </form>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-x-auto">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Water Logs</h3>
          <p className="text-sm text-gray-500 mt-1">{data.length} records found</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stand Meter</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservoir 1</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservoir 2</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservoir 3</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boster Timur</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boster Barat</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transfer Timur</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transfer Barat</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr><td colSpan="12" className="px-6 py-8 text-center text-gray-500">No water logs yet.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-sm">{item.reading_date}</td>
                  <td className="px-3 py-3 text-sm">{item.reading_time}</td>
                  <td className="px-3 py-3 text-sm">{item.shift_name || `Shift ${item.shift_id}`}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.stand_meter}</td>
                  <td className="px-3 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.reservoir_1 === 'F' ? 'bg-green-100 text-green-800' :
                      item.reservoir_1 === 'M' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{item.reservoir_1}</span>
                  </td>
                  <td className="px-3 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.reservoir_2 === 'F' ? 'bg-green-100 text-green-800' :
                      item.reservoir_2 === 'M' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{item.reservoir_2}</span>
                  </td>
                  <td className="px-3 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.reservoir_3 === 'F' ? 'bg-green-100 text-green-800' :
                      item.reservoir_3 === 'M' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{item.reservoir_3}</span>
                  </td>
                  <td className="px-3 py-3 text-sm font-mono">{item.boster_timur} Bar</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.boster_barat} Bar</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.transfer_timur} Bar</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.transfer_barat} Bar</td>
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

export default WaterLevel;
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const WaterLevel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: '07:00',
    shift_id: 1,
    stand_meter: '',
    flow_meter: '',
    ph_inlet: '',
    ph_outlet: '',
    reservoir_1: '',
    reservoir_2: '',
    reservoir_3: '',
    boster_timur: '',
    boster_barat: '',
    transfer_timur: '',
    transfer_barat: '',
    notes: '',
    petugas: ''
  });

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/water-level`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching water logs:', error);
      toast.error('Gagal memuat data water log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('📤 Sending Water Level data:', formData);

      const response = await axios.post(
        `${API_BASE_URL}/api/water-level`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Water Level Response:', response.data);

      if (response.data && response.data.success) {
        toast.success('Water log berhasil disimpan!');
        setShowForm(false);
        fetchLogs();
        setFormData({
          reading_date: new Date().toISOString().split('T')[0],
          reading_time: '07:00',
          shift_id: 1,
          stand_meter: '',
          flow_meter: '',
          ph_inlet: '',
          ph_outlet: '',
          reservoir_1: '',
          reservoir_2: '',
          reservoir_3: '',
          boster_timur: '',
          boster_barat: '',
          transfer_timur: '',
          transfer_barat: '',
          notes: '',
          petugas: ''
        });
      } else {
        toast.error('Gagal menyimpan data');
      }
    } catch (error) {
      console.error('❌ Water Level Error:', error);
      toast.error('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/water-level/${id}`, {
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
        <h1 className="text-2xl font-bold">Water Log Sheet</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Tutup Form' : '+ Tambah Water Log'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
          <h2 className="text-xl font-semibold">Input Water Log</h2>
          
          <div className="grid grid-cols-4 gap-4">
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
            <div>
              <label className="block text-sm font-medium mb-1">Petugas</label>
              <input type="text" name="petugas" value={formData.petugas} onChange={handleChange} placeholder="Nama petugas" className="w-full border rounded px-3 py-2" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stand Meter</label>
              <input type="number" name="stand_meter" value={formData.stand_meter} onChange={handleChange} step="0.01" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Flow Meter</label>
              <input type="number" name="flow_meter" value={formData.flow_meter} onChange={handleChange} step="0.01" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">pH Inlet</label>
              <input type="number" name="ph_inlet" value={formData.ph_inlet} onChange={handleChange} step="0.1" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">pH Outlet</label>
              <input type="number" name="ph_outlet" value={formData.ph_outlet} onChange={handleChange} step="0.1" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reservoir 1</label>
              <input type="text" name="reservoir_1" value={formData.reservoir_1} onChange={handleChange} placeholder="B/R/N/T" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reservoir 2</label>
              <input type="text" name="reservoir_2" value={formData.reservoir_2} onChange={handleChange} placeholder="B/R/N/T" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reservoir 3</label>
              <input type="text" name="reservoir_3" value={formData.reservoir_3} onChange={handleChange} placeholder="B/R/N/T" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Boster Timur</label>
              <input type="number" name="boster_timur" value={formData.boster_timur} onChange={handleChange} step="0.01" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Boster Barat</label>
              <input type="number" name="boster_barat" value={formData.boster_barat} onChange={handleChange} step="0.01" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Transfer Timur</label>
              <input type="number" name="transfer_timur" value={formData.transfer_timur} onChange={handleChange} step="0.01" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transfer Barat</label>
              <input type="number" name="transfer_barat" value={formData.transfer_barat} onChange={handleChange} step="0.01" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full border rounded px-3 py-2" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Simpan Water Log
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-bold p-4 border-b">Riwayat Water Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jam</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Petugas</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stand Meter</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Flow Meter</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">pH In</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">pH Out</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reservoir 1</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reservoir 2</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reservoir 3</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Boster Tmr</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Boster Brt</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transfer Tmr</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transfer Brt</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="16" className="px-4 py-8 text-center">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="16" className="px-4 py-8 text-center text-gray-500">Belum ada data</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(log.reading_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">{log.reading_time}</td>
                    <td className="px-4 py-2">Shift {log.shift_id}</td>
                    <td className="px-4 py-2 font-medium">{log.petugas || '-'}</td>
                    <td className="px-4 py-2">{log.stand_meter ?? '-'}</td>
                    <td className="px-4 py-2 font-bold text-blue-600">{log.flow_meter ?? '-'}</td>
                    <td className="px-4 py-2">{log.ph_inlet ?? '-'}</td>
                    <td className="px-4 py-2">{log.ph_outlet ?? '-'}</td>
                    <td className="px-4 py-2">{log.reservoir_1 ?? '-'}</td>
                    <td className="px-4 py-2">{log.reservoir_2 ?? '-'}</td>
                    <td className="px-4 py-2">{log.reservoir_3 ?? '-'}</td>
                    <td className="px-4 py-2">{log.boster_timur ?? '-'}</td>
                    <td className="px-4 py-2">{log.boster_barat ?? '-'}</td>
                    <td className="px-4 py-2">{log.transfer_timur ?? '-'}</td>
                    <td className="px-4 py-2">{log.transfer_barat ?? '-'}</td>
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

export default WaterLevel;
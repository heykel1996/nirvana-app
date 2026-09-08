import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const ShiftHandover = () => {
  const [handovers, setHandovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    handover_date: new Date().toISOString().split('T')[0],
    from_shift_id: 1,
    to_shift_id: 2,
    from_user: '',
    to_user: '',
    completed_tasks: '',
    pending_tasks: '',
    issues: '',
    notes: ''
  });

  const fetchHandovers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/shift-handover`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHandovers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching handovers:', error);
      toast.error('Gagal memuat data handover');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHandovers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log(' Sending Handover data:', formData);

      const response = await axios.post(
        `${API_BASE_URL}/api/shift-handover`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Handover Response:', response.data);

      if (response.data && response.data.success) {
        toast.success('Handover berhasil disimpan!');
        setShowForm(false);
        fetchHandovers();
        setFormData({
          handover_date: new Date().toISOString().split('T')[0],
          from_shift_id: 1,
          to_shift_id: 2,
          from_user: '',
          to_user: '',
          completed_tasks: '',
          pending_tasks: '',
          issues: '',
          notes: ''
        });
      } else {
        toast.error('Gagal menyimpan handover');
      }
    } catch (error) {
      console.error('❌ Handover Error:', error);
      toast.error('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/shift-handover/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Data dihapus');
      fetchHandovers();
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shift Handover (Serah Terima)</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Tutup Form' : '+ Tambah Handover'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
          <h2 className="text-xl font-semibold">Form Shift Handover</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal</label>
              <input type="date" name="handover_date" value={formData.handover_date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dari Shift</label>
              <select name="from_shift_id" value={formData.from_shift_id} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value={1}>Shift 1</option>
                <option value={2}>Shift 2</option>
                <option value={3}>Shift 3</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ke Shift</label>
            <select name="to_shift_id" value={formData.to_shift_id} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value={1}>Shift 1</option>
              <option value={2}>Shift 2</option>
              <option value={3}>Shift 3</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Petugas Shift Ini</label>
              <input type="text" name="from_user" value={formData.from_user} onChange={handleChange} placeholder="Nama petugas" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Petugas Shift Berikutnya</label>
              <input type="text" name="to_user" value={formData.to_user} onChange={handleChange} placeholder="Nama petugas" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pekerjaan Selesai</label>
            <textarea name="completed_tasks" value={formData.completed_tasks} onChange={handleChange} rows="3" className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pekerjaan Pending (Belum Selesai)</label>
            <textarea name="pending_tasks" value={formData.pending_tasks} onChange={handleChange} rows="3" className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Isu / Masalah</label>
            <textarea name="issues" value={formData.issues} onChange={handleChange} rows="3" className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full border rounded px-3 py-2" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Simpan Handover
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-bold p-4 border-b">Riwayat Handover</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dari Shift</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ke Shift</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Petugas</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center">Loading...</td></tr>
              ) : handovers.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Belum ada data</td></tr>
              ) : (
                handovers.map(item => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(item.handover_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">Shift {item.from_shift_id}</td>
                    <td className="px-4 py-2">Shift {item.to_shift_id}</td>
                    <td className="px-4 py-2">{item.from_user} → {item.to_user}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-sm">Hapus</button>
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

export default ShiftHandover;
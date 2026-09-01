import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const ShiftHandover = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    handover_date: new Date().toISOString().split('T')[0],
    from_shift_id: 1, to_shift_id: 2,
    from_user: '', to_user: '',
    pending_tasks: '', completed_tasks: '', issues: '', notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/shift-handover`, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data.data || []);
    } catch (error) { toast.error('Gagal memuat data'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/shift-handover`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Handover berhasil disimpan!');
      setShowForm(false);
      fetchData();
    } catch (error) { toast.error('Gagal menyimpan'); }
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Shift Handover (Serah Terima)</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {showForm ? 'Batal' : '+ Buat Handover'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" value={formData.handover_date} onChange={(e) => handleChange('handover_date', e.target.value)} className="w-full border rounded p-2" required /></div>
              <div><label className="block text-sm font-medium mb-1">Dari Shift</label><select value={formData.from_shift_id} onChange={(e) => handleChange('from_shift_id', parseInt(e.target.value))} className="w-full border rounded p-2"><option value="1">Shift 1</option><option value="2">Shift 2</option><option value="3">Shift 3</option></select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Petugas Shift Ini</label><input type="text" value={formData.from_user} onChange={(e) => handleChange('from_user', e.target.value)} className="w-full border rounded p-2" required /></div>
              <div><label className="block text-sm font-medium mb-1">Petugas Shift Berikutnya</label><input type="text" value={formData.to_user} onChange={(e) => handleChange('to_user', e.target.value)} className="w-full border rounded p-2" required /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Pekerjaan Selesai</label><textarea value={formData.completed_tasks} onChange={(e) => handleChange('completed_tasks', e.target.value)} className="w-full border rounded p-2" rows="2"></textarea></div>
            <div><label className="block text-sm font-medium mb-1">Pekerjaan Pending (Belum Selesai)</label><textarea value={formData.pending_tasks} onChange={(e) => handleChange('pending_tasks', e.target.value)} className="w-full border rounded p-2" rows="2"></textarea></div>
            <div><label className="block text-sm font-medium mb-1">Isu / Masalah</label><textarea value={formData.issues} onChange={(e) => handleChange('issues', e.target.value)} className="w-full border rounded p-2" rows="2"></textarea></div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Simpan Handover</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShiftHandover;
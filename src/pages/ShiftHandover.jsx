import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// PENTING: Gunakan VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ShiftHandover = () => {
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      console.log('📤 Sending to:', `${API_BASE_URL}/api/shift-handover`);
      console.log('Data:', formData);

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

      console.log('✅ Response:', response.data);

      if (response.data && response.data.success) {
        toast.success('Handover berhasil disimpan!');
        // Reset form
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
        toast.error('Gagal menyimpan: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error:', error);
      console.error('Response:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Sesi expired. Silakan login ulang.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 500) {
        toast.error('Server error: ' + (error.response?.data?.message || error.message));
      } else {
        toast.error('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shift Handover (Serah Terima)</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <input
              type="date"
              name="handover_date"
              value={formData.handover_date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dari Shift</label>
            <select
              name="from_shift_id"
              value={formData.from_shift_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value={1}>Shift 1</option>
              <option value={2}>Shift 2</option>
              <option value={3}>Shift 3</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Petugas Shift Ini</label>
            <input
              type="text"
              name="from_user"
              value={formData.from_user}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Nama petugas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Petugas Shift Berikutnya</label>
            <input
              type="text"
              name="to_user"
              value={formData.to_user}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Nama petugas"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pekerjaan Selesai</label>
          <textarea
            name="completed_tasks"
            value={formData.completed_tasks}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pekerjaan Pending (Belum Selesai)</label>
          <textarea
            name="pending_tasks"
            value={formData.pending_tasks}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Isu / Masalah</label>
          <textarea
            name="issues"
            value={formData.issues}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan Handover'}
        </button>
      </form>
    </div>
  );
};

export default ShiftHandover;
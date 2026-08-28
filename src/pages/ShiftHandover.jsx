import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const ShiftHandover = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    from_user_id: 1,
    to_user_id: '',
    from_shift_id: 1,
    to_shift_id: 2,
    handover_date: new Date().toISOString().split('T')[0],
    handover_time: new Date().toTimeString().split(' ')[0],
    pending_tasks: '',
    completed_tasks: '',
    issues: '',
    notes: '',
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/shift-handover`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch shift handovers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        pending_tasks: formData.pending_tasks.split('\n').filter(t => t.trim()),
        completed_tasks: formData.completed_tasks.split('\n').filter(t => t.trim()),
        issues: formData.issues.split('\n').filter(t => t.trim()),
      };
      await axios.post(`${API_BASE_URL}/api/shift-handover`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Shift handover berhasil disimpan!');
      setShowForm(false);
      fetchData();
      setFormData({
        from_user_id: 1,
        to_user_id: '',
        from_shift_id: 1,
        to_shift_id: 2,
        handover_date: new Date().toISOString().split('T')[0],
        handover_time: new Date().toTimeString().split(' ')[0],
        pending_tasks: '',
        completed_tasks: '',
        issues: '',
        notes: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Gagal menyimpan');
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
          <h1 className="text-3xl font-bold text-gray-900">Shift Handover</h1>
          <p className="text-gray-600 mt-1">Shift Change Documentation</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg font-medium"
        >
          {showForm ? '✕ Cancel' : '+ New Handover'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">New Shift Handover</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Handover Date</label>
                <input type="date" value={formData.handover_date} onChange={(e) => setFormData({ ...formData, handover_date: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Handover Time</label>
                <input type="time" value={formData.handover_time} onChange={(e) => setFormData({ ...formData, handover_time: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Shift ID</label>
                <input type="number" value={formData.from_shift_id} onChange={(e) => setFormData({ ...formData, from_shift_id: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Shift ID</label>
                <input type="number" value={formData.to_shift_id} onChange={(e) => setFormData({ ...formData, to_shift_id: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To User ID</label>
                <input type="number" value={formData.to_user_id} onChange={(e) => setFormData({ ...formData, to_user_id: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Completed Tasks (one per line)</label>
              <textarea value={formData.completed_tasks} onChange={(e) => setFormData({ ...formData, completed_tasks: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" rows="3" placeholder="Task 1&#10;Task 2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pending Tasks (one per line)</label>
              <textarea value={formData.pending_tasks} onChange={(e) => setFormData({ ...formData, pending_tasks: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" rows="3" placeholder="Task 1&#10;Task 2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issues (one per line)</label>
              <textarea value={formData.issues} onChange={(e) => setFormData({ ...formData, issues: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" rows="3" placeholder="Issue 1&#10;Issue 2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" rows="2" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">
              Save Shift Handover
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl">
            No shift handovers yet.
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Shift Handover - {item.handover_date} {item.handover_time}
                  </h3>
                  <p className="text-sm text-gray-600">
                    From: {item.from_user_name || 'User ' + item.from_user_id} 
                    → To: {item.to_user_name || 'User ' + item.to_user_id}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Shift {item.from_shift_id} → {item.to_shift_id}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {item.completed_tasks && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <h4 className="font-medium text-green-900 mb-2">✅ Completed Tasks</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      {(typeof item.completed_tasks === 'string' ? JSON.parse(item.completed_tasks) : item.completed_tasks || []).map((task, i) => (
                        <li key={i}>• {task}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.pending_tasks && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <h4 className="font-medium text-yellow-900 mb-2">⏳ Pending Tasks</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {(typeof item.pending_tasks === 'string' ? JSON.parse(item.pending_tasks) : item.pending_tasks || []).map((task, i) => (
                        <li key={i}>• {task}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.issues && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <h4 className="font-medium text-red-900 mb-2">⚠️ Issues</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      {(typeof item.issues === 'string' ? JSON.parse(item.issues) : item.issues || []).map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {item.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">📝 Notes</h4>
                  <p className="text-sm text-gray-700">{item.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShiftHandover;
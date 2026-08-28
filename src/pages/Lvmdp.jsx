import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const Lvmdp = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: '07:00',
    shift_id: 1,
    ampere_r: '', ampere_s: '', ampere_t: '',
    volt_rs: '', volt_st: '', volt_tr: '',
    cos_q: '', kw: '', kwh: '', hz: '', notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/lvmdp`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch LVMDP data');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/lvmdp/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Data berhasil dihapus!');
      fetchData();
    } catch (error) { toast.error('Gagal menghapus data'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/lvmdp`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('LVMDP reading berhasil disimpan!');
      setShowForm(false);
      fetchData();
    } catch (error) { toast.error(error.response?.data?.error || 'Gagal menyimpan'); }
  };

  const InputField = ({ label, name, step = '0.01' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="number" step={step} value={formData[name]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">LVMDP - Panel Tegangan Rendah</h1>
          <p className="text-gray-600 mt-1">Inspeksi Harian Incoming Trafo</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg font-medium">
          {showForm ? '✕ Cancel' : '+ Add New Reading'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Add LVMDP Reading</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={formData.reading_date} onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
                <select value={formData.reading_time} onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required>
                  {['07:00','09:00','11:00','13:00','15:00','17:00','19:00','21:00','00:00','05:00'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                <select value={formData.shift_id} onChange={(e) => setFormData({ ...formData, shift_id: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 border p-2.5">
                  <option value="1">Shift 1 (07:00-15:00)</option>
                  <option value="2">Shift 2 (15:00-22:00)</option>
                  <option value="3">Shift 3 (22:00-07:00)</option>
                </select>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Incoming Trafo - Ampere</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Ampere R" name="ampere_r" />
                <InputField label="Ampere S" name="ampere_s" />
                <InputField label="Ampere T" name="ampere_t" />
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Incoming Trafo - Volt</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Volt RS" name="volt_rs" />
                <InputField label="Volt ST" name="volt_st" />
                <InputField label="Volt TR" name="volt_tr" />
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Power Measurements</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField label="Cos Q" name="cos_q" />
                <InputField label="Kw" name="kw" />
                <InputField label="Kwh" name="kwh" />
                <InputField label="Hz" name="hz" />
              </div>
            </div>
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" rows="2" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">Save LVMDP Reading</button>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-x-auto">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All LVMDP Readings</h3>
          <p className="text-sm text-gray-500 mt-1">{data.length} records found</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amp R</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amp S</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amp T</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volt RS</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volt ST</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volt TR</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cos Q</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kw</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kwh</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hz</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr><td colSpan="13" className="px-6 py-8 text-center text-gray-500">No LVMDP readings yet.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.reading_date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.reading_time}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.ampere_r}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.ampere_s}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.ampere_t}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.volt_rs}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.volt_st}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.volt_tr}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.cos_q}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.kw}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.kwh}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{item.hz}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
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

export default Lvmdp;
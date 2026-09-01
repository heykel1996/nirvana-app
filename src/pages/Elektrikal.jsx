import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const Elektrikal = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: '07:00',
    shift_id: 1,
    petugas: '',
    daya_saat_ini: '',
    kwh_wbp: '',
    kwh_lwbp: '',
    total_kwh: '',
    kwh_kvarh: '',
    tag_phasa_r: '',
    tag_phasa_s: '',
    tag_phasa_t: '',
    arus_phasa_r: '',
    arus_phasa_s: '',
    arus_phasa_t: '',
    penalty: '',
    paraf: '',
    notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/elektrikal`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
    } catch (error) { toast.error('Failed to fetch electrical log data'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/elektrikal/${id}`, {
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
      await axios.post(`${API_BASE_URL}/api/elektrikal`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Electrical Log berhasil disimpan!');
      setShowForm(false);
      setFormData({
        reading_date: new Date().toISOString().split('T')[0],
        reading_time: '07:00',
        shift_id: 1,
        petugas: '',
        daya_saat_ini: '',
        kwh_wbp: '',
        kwh_lwbp: '',
        total_kwh: '',
        kwh_kvarh: '',
        tag_phasa_r: '',
        tag_phasa_s: '',
        tag_phasa_t: '',
        arus_phasa_r: '',
        arus_phasa_s: '',
        arus_phasa_t: '',
        penalty: '',
        paraf: '',
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

  const InputField = ({ label, field, type = 'number', step = '0.01', placeholder = '' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        step={step}
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
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
          <h1 className="text-3xl font-bold text-gray-900">Electrical Log Sheet</h1>
          <p className="text-gray-600 mt-1">Monitoring Daya Listrik & KWH</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg font-medium"
        >
          {showForm ? '✕ Cancel' : '+ Add Electrical Log'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Add Electrical Log</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={formData.reading_date} onChange={(e) => handleChange('reading_date', e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Petugas</label>
                <input type="text" value={formData.petugas} onChange={(e) => handleChange('petugas', e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
            </div>

            {/* Daya Saat Ini */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">⚡ Daya Saat Ini</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Daya Saat Ini (kW)" field="daya_saat_ini" />
              </div>
            </div>

            {/* KWH Readings */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">📊 KWH Readings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField label="KWH WBP" field="kwh_wbp" />
                <InputField label="KWH LWBP" field="kwh_lwbp" />
                <InputField label="Total KWH" field="total_kwh" />
                <InputField label="KWH KVARH" field="kwh_kvarh" />
              </div>
            </div>

            {/* Tag Phasa */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">️ Tag Phasa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label='Tag Phasa "R"' field="tag_phasa_r" />
                <InputField label='Tag Phasa "S"' field="tag_phasa_s" />
                <InputField label='Tag Phasa "T"' field="tag_phasa_t" />
              </div>
            </div>

            {/* Arus Phasa */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">⚡ Arus Phasa (Ampere)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label='Arus Phasa "R"' field="arus_phasa_r" />
                <InputField label='Arus Phasa "S"' field="arus_phasa_s" />
                <InputField label='Arus Phasa "T"' field="arus_phasa_t" />
              </div>
            </div>

            {/* Penalty & Paraf */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3"> Penalty & Paraf</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Penalty" field="penalty" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paraf</label>
                  <input
                    type="text"
                    value={formData.paraf}
                    onChange={(e) => handleChange('paraf', e.target.value)}
                    placeholder="Nama petugas yang paraf"
                    className="w-full rounded-lg border-gray-300 border p-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5" rows="2" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">
              Save Electrical Log
            </button>
          </form>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-x-auto">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Electrical Logs</h3>
          <p className="text-sm text-gray-500 mt-1">{data.length} records found</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TGL</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">JAM</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DAYA</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">KWH WBP</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">KWH LWBP</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TOTAL KWH</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">KVARH</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TAG R</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TAG S</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TAG T</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ARUS R</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ARUS S</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ARUS T</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">PENALTY</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">PARAF</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr><td colSpan="16" className="px-6 py-8 text-center text-gray-500">No electrical logs yet.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-sm">{item.reading_date}</td>
                  <td className="px-3 py-3 text-sm">{item.reading_time}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.daya_saat_ini}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.kwh_wbp}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.kwh_lwbp}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.total_kwh}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.kwh_kvarh}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.tag_phasa_r}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.tag_phasa_s}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.tag_phasa_t}</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.arus_phasa_r}A</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.arus_phasa_s}A</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.arus_phasa_t}A</td>
                  <td className="px-3 py-3 text-sm font-mono">{item.penalty}</td>
                  <td className="px-3 py-3 text-sm">{item.paraf}</td>
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

export default Elektrikal;
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const Lvmdp = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: '07:00',
    shift_id: 1,
    ampere_r: '', ampere_s: '', ampere_t: '',
    volt_rs: '', volt_st: '', volt_tr: '',
    cos_q: '', kw: '', kwh: '', hz: '',
    notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/lvmdp`, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data.data || []);
    } catch (error) { toast.error('Gagal memuat data LVMDP'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/lvmdp`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Data LVMDP berhasil disimpan!');
      setShowForm(false);
      setFormData({ ...formData, reading_date: new Date().toISOString().split('T')[0], ampere_r: '', ampere_s: '', ampere_t: '', volt_rs: '', volt_st: '', volt_tr: '', cos_q: '', kw: '', kwh: '', hz: '', notes: '' });
      fetchData();
    } catch (error) { toast.error(error.response?.data?.error || 'Gagal menyimpan'); }
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">LVMDP - Panel Tegangan Rendah</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {showForm ? 'Batal' : '+ Tambah Reading'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Input Reading LVMDP</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal</label>
                <input type="date" value={formData.reading_date} onChange={(e) => handleChange('reading_date', e.target.value)} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jam</label>
                <input type="time" value={formData.reading_time} onChange={(e) => handleChange('reading_time', e.target.value)} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shift</label>
                <select value={formData.shift_id} onChange={(e) => handleChange('shift_id', parseInt(e.target.value))} className="w-full border rounded p-2">
                  <option value="1">Shift 1</option>
                  <option value="2">Shift 2</option>
                  <option value="3">Shift 3</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-3 text-blue-700">Incoming Trafo - Ampere</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm">Ampere R</label><input type="number" step="0.1" value={formData.ampere_r} onChange={(e) => handleChange('ampere_r', e.target.value)} className="w-full border rounded p-2" /></div>
                <div><label className="text-sm">Ampere S</label><input type="number" step="0.1" value={formData.ampere_s} onChange={(e) => handleChange('ampere_s', e.target.value)} className="w-full border rounded p-2" /></div>
                <div><label className="text-sm">Ampere T</label><input type="number" step="0.1" value={formData.ampere_t} onChange={(e) => handleChange('ampere_t', e.target.value)} className="w-full border rounded p-2" /></div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-3 text-blue-700">Incoming Trafo - Volt</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm">Volt RS</label><input type="number" step="0.1" value={formData.volt_rs} onChange={(e) => handleChange('volt_rs', e.target.value)} className="w-full border rounded p-2" /></div>
                <div><label className="text-sm">Volt ST</label><input type="number" step="0.1" value={formData.volt_st} onChange={(e) => handleChange('volt_st', e.target.value)} className="w-full border rounded p-2" /></div>
                <div><label className="text-sm">Volt TR</label><input type="number" step="0.1" value={formData.volt_tr} onChange={(e) => handleChange('volt_tr', e.target.value)} className="w-full border rounded p-2" /></div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-3 text-blue-700">Power & Frequency</h3>
              <div className="grid grid-cols-4 gap-4">
                <div><label className="text-sm">Cos Q</label><input type="number" step="0.01" value={formData.cos_q} onChange={(e) => handleChange('cos_q', e.target.value)} className="w-full border rounded p-2" /></div>
                <div><label className="text-sm">Kw</label><input type="number" step="0.01" value={formData.kw} onChange={(e) => handleChange('kw', e.target.value)} className="w-full border rounded p-2" /></div>
                <div><label className="text-sm">Kwh</label><input type="number" step="0.01" value={formData.kwh} onChange={(e) => handleChange('kwh', e.target.value)} className="w-full border rounded p-2" /></div>
                <div><label className="text-sm">Hz</label><input type="number" step="0.1" value={formData.hz} onChange={(e) => handleChange('hz', e.target.value)} className="w-full border rounded p-2" /></div>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} className="w-full border rounded p-2" rows="2"></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Simpan Data LVMDP</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amp R</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amp S</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amp T</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volt RS</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volt ST</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volt TR</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cos Q</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kw</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hz</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm">{item.reading_date}</td>
                <td className="px-3 py-2 text-sm">{item.reading_time}</td>
                <td className="px-3 py-2 text-sm">{item.ampere_r}</td>
                <td className="px-3 py-2 text-sm">{item.ampere_s}</td>
                <td className="px-3 py-2 text-sm">{item.ampere_t}</td>
                <td className="px-3 py-2 text-sm">{item.volt_rs}</td>
                <td className="px-3 py-2 text-sm">{item.volt_st}</td>
                <td className="px-3 py-2 text-sm">{item.volt_tr}</td>
                <td className="px-3 py-2 text-sm">{item.cos_q}</td>
                <td className="px-3 py-2 text-sm">{item.kw}</td>
                <td className="px-3 py-2 text-sm">{item.hz}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lvmdp;
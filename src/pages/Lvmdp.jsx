import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const Lvmdp = () => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: '07:00',
    shift_id: 1,
    ampere_r: '',
    ampere_s: '',
    ampere_t: '',
    volt_rs: '',
    volt_st: '',
    volt_tr: '',
    cos_q: '',
    kw: '',
    kwh: '',
    hz: '',
    notes: ''
  });

  const fetchReadings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/lvmdp`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReadings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching readings:', error);
      toast.error('Gagal mengambil data LVMDP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/lvmdp`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Data berhasil disimpan!');
      setShowForm(false);
      fetchReadings();
      // Reset form
      setFormData({
        reading_date: new Date().toISOString().split('T')[0],
        reading_time: '07:00',
        shift_id: 1,
        ampere_r: '',
        ampere_s: '',
        ampere_t: '',
        volt_rs: '',
        volt_st: '',
        volt_tr: '',
        cos_q: '',
        kw: '',
        kwh: '',
        hz: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Gagal menyimpan data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/lvmdp/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Data berhasil dihapus!');
      fetchReadings();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Gagal menghapus data');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">LVMDP - Panel Tegangan Rendah</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Tutup Form' : '+ Tambah Reading'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Input Reading LVMDP</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal</label>
              <input
                type="date"
                name="reading_date"
                value={formData.reading_date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jam</label>
              <input
                type="time"
                name="reading_time"
                value={formData.reading_time}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shift</label>
              <select
                name="shift_id"
                value={formData.shift_id}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value={1}>Shift 1</option>
                <option value={2}>Shift 2</option>
                <option value={3}>Shift 3</option>
              </select>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-600">Incoming Trafo - Ampere</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ampere R</label>
              <input
                type="number"
                name="ampere_r"
                value={formData.ampere_r}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ampere S</label>
              <input
                type="number"
                name="ampere_s"
                value={formData.ampere_s}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ampere T</label>
              <input
                type="number"
                name="ampere_t"
                value={formData.ampere_t}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-600">Incoming Trafo - Volt</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Volt RS</label>
              <input
                type="number"
                name="volt_rs"
                value={formData.volt_rs}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Volt ST</label>
              <input
                type="number"
                name="volt_st"
                value={formData.volt_st}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Volt TR</label>
              <input
                type="number"
                name="volt_tr"
                value={formData.volt_tr}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-600">Power & Frequency</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cos Q</label>
              <input
                type="number"
                name="cos_q"
                value={formData.cos_q}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kw</label>
              <input
                type="number"
                name="kw"
                value={formData.kw}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kwh</label>
              <input
                type="number"
                name="kwh"
                value={formData.kwh}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hz</label>
              <input
                type="number"
                name="hz"
                value={formData.hz}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              rows="2"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Simpan Data LVMDP
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jam</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amp R</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amp S</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amp T</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Volt RS</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Volt ST</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Volt TR</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cos Q</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kw</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hz</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : readings.length === 0 ? (
              <tr>
                <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                  Tidak ada data LVMDP
                </td>
              </tr>
            ) : (
              readings.map((reading) => (
                <tr key={reading.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(reading.reading_date).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-2">{reading.reading_time}</td>
                  <td className="px-4 py-2">{reading.ampere_r}</td>
                  <td className="px-4 py-2">{reading.ampere_s}</td>
                  <td className="px-4 py-2">{reading.ampere_t}</td>
                  <td className="px-4 py-2">{reading.volt_rs}</td>
                  <td className="px-4 py-2">{reading.volt_st}</td>
                  <td className="px-4 py-2">{reading.volt_tr}</td>
                  <td className="px-4 py-2">{reading.cos_q}</td>
                  <td className="px-4 py-2">{reading.kw}</td>
                  <td className="px-4 py-2">{reading.hz}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(reading.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Hapus
                    </button>
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
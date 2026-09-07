import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const Stp = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    period: '09.00',
    shift_id: 1,
    grit_chamber_status: 'OK',
    grit_chamber_notes: '',
    equalizing_tank_status: 'OK',
    equalizing_tank_notes: '',
    aeration_status: 'OK',
    aeration_notes: '',
    sedimentation_tank_status: 'OK',
    sedimentation_tank_notes: '',
    effluent_tank_status: 'OK',
    effluent_tank_notes: '',
    pump_blower_status: 'OK',
    pump_blower_notes: '',
    general_notes: ''
  });

  const fetchChecklists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/stp`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChecklists(response.data.data || []);
    } catch (error) {
      console.error('Error fetching STP:', error);
      toast.error('Gagal memuat data STP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('📤 Sending STP data:', formData);

      const response = await axios.post(
        `${API_BASE_URL}/api/stp`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ STP Response:', response.data);

      if (response.data && response.data.success) {
        toast.success('Checklist STP berhasil disimpan!');
        setShowForm(false);
        fetchChecklists();
        setFormData({
          reading_date: new Date().toISOString().split('T')[0],
          period: '09.00',
          shift_id: 1,
          grit_chamber_status: 'OK',
          grit_chamber_notes: '',
          equalizing_tank_status: 'OK',
          equalizing_tank_notes: '',
          aeration_status: 'OK',
          aeration_notes: '',
          sedimentation_tank_status: 'OK',
          sedimentation_tank_notes: '',
          effluent_tank_status: 'OK',
          effluent_tank_notes: '',
          pump_blower_status: 'OK',
          pump_blower_notes: '',
          general_notes: ''
        });
      } else {
        toast.error('Gagal menyimpan data');
      }
    } catch (error) {
      console.error('❌ STP Error:', error);
      console.error('Response:', error.response?.data);
      toast.error('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/stp/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Data dihapus');
      fetchChecklists();
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  const checklistItems = [
    { label: 'I. Grit Chamber', status: 'grit_chamber_status', notes: 'grit_chamber_notes' },
    { label: 'II. Equalizing Tank', status: 'equalizing_tank_status', notes: 'equalizing_tank_notes' },
    { label: 'III. Aeration', status: 'aeration_status', notes: 'aeration_notes' },
    { label: 'IV. Sedimentation Tank', status: 'sedimentation_tank_status', notes: 'sedimentation_tank_notes' },
    { label: 'V. Effluent Tank', status: 'effluent_tank_status', notes: 'effluent_tank_notes' },
    { label: 'VI. Pump Blower', status: 'pump_blower_status', notes: 'pump_blower_notes' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Peralatan STP (Sewage Treatment Plant)</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Tutup Form' : '+ Tambah Checklist'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Formulir Inspeksi Harian STP</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
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
              <label className="block text-sm font-medium mb-1">Periode (Jam)</label>
              <select
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="09.00">09.00</option>
                <option value="13.00">13.00</option>
                <option value="17.00">17.00</option>
                <option value="21.00">21.00</option>
              </select>
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

          <h3 className="text-lg font-bold mb-3 text-green-600">Checklist Peralatan</h3>
          
          {checklistItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 mb-3 items-center">
              <div className="font-medium">{item.label}</div>
              <select
                name={item.status}
                value={formData[item.status]}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              >
                <option value="OK">OK</option>
                <option value="N.OK">N.OK</option>
              </select>
              <input
                type="text"
                name={item.notes}
                value={formData[item.notes]}
                onChange={handleChange}
                placeholder="Keterangan jika N.OK"
                className="border rounded px-3 py-2"
              />
            </div>
          ))}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">General Notes</label>
            <textarea
              name="general_notes"
              value={formData.general_notes}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Catatan tambahan..."
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Simpan Checklist STP
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-bold p-4 border-b">Riwayat Checklist STP</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grit Chamber</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equalizing</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aeration</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sedimentation</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Effluent</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pump Blower</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="px-4 py-8 text-center">Loading...</td></tr>
              ) : checklists.length === 0 ? (
                <tr><td colSpan="10" className="px-4 py-8 text-center text-gray-500">Belum ada data</td></tr>
              ) : (
                checklists.map(item => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(item.reading_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">{item.period}</td>
                    <td className="px-4 py-2">Shift {item.shift_id}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.grit_chamber_status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.grit_chamber_status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.equalizing_tank_status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.equalizing_tank_status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.aeration_status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.aeration_status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.sedimentation_tank_status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.sedimentation_tank_status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.effluent_tank_status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.effluent_tank_status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.pump_blower_status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.pump_blower_status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
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
    </div>
  );
};

export default Stp;
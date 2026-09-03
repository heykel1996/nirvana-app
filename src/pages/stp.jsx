import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const Stp = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    period: '09.00',
    shift_id: 1,
    grit_chamber_status: 'OK', grit_chamber_notes: '',
    equalizing_tank_status: 'OK', equalizing_tank_notes: '',
    aeration_status: 'OK', aeration_notes: '',
    sedimentation_tank_status: 'OK', sedimentation_tank_notes: '',
    effluent_tank_status: 'OK', effluent_tank_notes: '',
    pump_blower_status: 'OK', pump_blower_notes: '',
    flow_meter_reading: '',
    general_notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/stp`, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data.data || []);
    } catch (error) { toast.error('Gagal memuat data STP'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/stp`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Data STP berhasil disimpan!');
      setShowForm(false);
      fetchData();
    } catch (error) { toast.error('Gagal menyimpan'); }
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const ChecklistRow = ({ label, statusField, notesField }) => (
    <div className="grid grid-cols-12 gap-2 items-center mb-3 border-b pb-2">
      <div className="col-span-4 font-medium text-sm">{label}</div>
      <div className="col-span-3">
        <select value={formData[statusField]} onChange={(e) => handleChange(statusField, e.target.value)} className="w-full border rounded p-1.5 text-sm">
          <option value="OK">OK</option>
          <option value="N.OK">N.OK</option>
        </select>
      </div>
      <div className="col-span-5">
        <input type="text" value={formData[notesField]} onChange={(e) => handleChange(notesField, e.target.value)} placeholder="Keterangan jika N.OK" className="w-full border rounded p-1.5 text-sm" />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Peralatan STP (Sewage Treatment Plant)</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {showForm ? 'Batal' : '+ Tambah Checklist'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Formulir Inspeksi Harian STP</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" value={formData.reading_date} onChange={(e) => handleChange('reading_date', e.target.value)} className="w-full border rounded p-2" required /></div>
              <div><label className="block text-sm font-medium mb-1">Periode (Jam)</label><select value={formData.period} onChange={(e) => handleChange('period', e.target.value)} className="w-full border rounded p-2"><option value="09.00">09.00</option><option value="15.00">15.00</option><option value="22.00">22.00</option></select></div>
              <div><label className="block text-sm font-medium mb-1">Shift</label><select value={formData.shift_id} onChange={(e) => handleChange('shift_id', parseInt(e.target.value))} className="w-full border rounded p-2"><option value="1">Shift 1</option><option value="2">Shift 2</option><option value="3">Shift 3</option></select></div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-3 text-green-700">Checklist Peralatan</h3>
              <ChecklistRow label="I. Grit Chamber" statusField="grit_chamber_status" notesField="grit_chamber_notes" />
              <ChecklistRow label="II. Equalizing Tank" statusField="equalizing_tank_status" notesField="equalizing_tank_notes" />
              <ChecklistRow label="III. Aeration" statusField="aeration_status" notesField="aeration_notes" />
              <ChecklistRow label="IV. Sedimentation Tank" statusField="sedimentation_tank_status" notesField="sedimentation_tank_notes" />
              <ChecklistRow label="V. Effluent Tank" statusField="effluent_tank_status" notesField="effluent_tank_notes" />
              <ChecklistRow label="VI. Pump Blower" statusField="pump_blower_status" notesField="pump_blower_notes" />
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-1">Catat Flow Meter</label>
              <input type="number" step="0.01" value={formData.flow_meter_reading} onChange={(e) => handleChange('flow_meter_reading', e.target.value)} className="w-full border rounded p-2" />
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-1">General Notes</label>
              <textarea value={formData.general_notes} onChange={(e) => handleChange('general_notes', e.target.value)} className="w-full border rounded p-2" rows="2"></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Simpan Checklist STP</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Stp;
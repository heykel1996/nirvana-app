import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const statusOptions = [
  { value: '', label: '-' },
  { value: 'B', label: 'B - Baik' },
  { value: 'R', label: 'R - Rusak' },
  { value: 'N', label: 'N - Normal' },
  { value: 'T', label: 'T - Tidak beroperasi' },
  { value: 'G', label: 'G - Ganti spare part' },
  { value: 'P', label: 'P - Perlu perbaikan' },
  { value: 'E', label: 'E - Level kurang' },
  { value: 'F', label: 'F - Level penuh' },
  { value: 'C', label: 'C - Jernih' },
  { value: 'D', label: 'D - Kotor' },
];

const levelOptions = [
  { value: '', label: '-' },
  { value: 'F', label: 'F - Full' },
  { value: 'M', label: 'M - Medium' },
  { value: 'L', label: 'L - Low' },
];

const CheckSheets = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    shift_id: 1,
    petugas: '',
    // Shift 1
    water_level_status: '', water_level_remarks: '',
    motor_equalizing_1_status: '', motor_equalizing_1_remarks: '',
    motor_equalizing_2_status: '', motor_equalizing_2_remarks: '',
    motor_boster_1_status: '', motor_boster_1_remarks: '',
    motor_boster_2_status: '', motor_boster_2_remarks: '',
    buzzer_status: '', buzzer_remarks: '',
    screen_status: '', screen_remarks: '',
    exhaust_fan_status: '', exhaust_fan_remarks: '',
    pressure_air_status: '', pressure_air_remarks: '',
    chiller_dosing_pump_status: '', chiller_dosing_pump_remarks: '',
    water_level_dosing_pump_status: '', water_level_dosing_pump_remarks: '',
    // Shift 2
    floor_ceiling_light_status: '', floor_ceiling_light_remarks: '',
    facade_light_status: '', facade_light_remarks: '',
    swimming_light_status: '', swimming_light_remarks: '',
    light_b1_status: '', light_b1_remarks: '',
    light_b2_status: '', light_b2_remarks: '',
    stairs_zone_a_status: '', stairs_zone_a_remarks: '',
    stairs_zone_b_status: '', stairs_zone_b_remarks: '',
    radiator_water_status: '', radiator_water_remarks: '',
    jocky_pump_status: '', jocky_pump_remarks: '',
    hydrant_pump_status: '', hydrant_pump_remarks: '',
    hydrant_diesel_status: '', hydrant_diesel_remarks: '',
    sumpit_pump_1_status: '', sumpit_pump_1_remarks: '',
    sumpit_pump_2_status: '', sumpit_pump_2_remarks: '',
    sumpit_pump_3_status: '', sumpit_pump_3_remarks: '',
    sumpit_pump_4_status: '', sumpit_pump_4_remarks: '',
    // Shift 3
    panel_control_genset_status: '', panel_control_genset_remarks: '',
    elevator_1_status: '', elevator_1_remarks: '',
    elevator_2_status: '', elevator_2_remarks: '',
    elevator_3_status: '', elevator_3_remarks: '',
    elevator_4_status: '', elevator_4_remarks: '',
    elevator_5_status: '', elevator_5_remarks: '',
    pompa_delivery_a_status: '', pompa_delivery_a_remarks: '',
    pompa_delivery_b_status: '', pompa_delivery_b_remarks: '',
    pompa_boster_1a_status: '', pompa_boster_1a_remarks: '',
    pompa_boster_2a_status: '', pompa_boster_2a_remarks: '',
    pompa_boster_1b_status: '', pompa_boster_1b_remarks: '',
    pompa_boster_2b_status: '', pompa_boster_2b_remarks: '',
    ground_tank_status: '', ground_tank_remarks: '',
    roof_tank_a_status: '', roof_tank_a_remarks: '',
    roof_tank_b_status: '', roof_tank_b_remarks: '',
    air_alarm_status: '', air_alarm_remarks: '',
    sound_system_status: '', sound_system_remarks: '',
    access_control_status: '', access_control_remarks: '',
    cctv_status: '', cctv_remarks: '',
    easv_status: '', easv_remarks: '',
    p_pabx_status: '', p_pabx_remarks: '',
    tv_cable_status: '', tv_cable_remarks: '',
    general_remarks: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/check-sheets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
    } catch (error) { toast.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/check-sheets/${id}`, {
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
      await axios.post(`${API_BASE_URL}/api/check-sheets`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Check sheet berhasil disimpan!');
      setShowForm(false);
      fetchData();
    } catch (error) { toast.error('Gagal menyimpan'); }
  };

  const renderStatusSelect = (field, label, isLevel = false) => (
    <div className="grid grid-cols-2 gap-2">
      <select
        value={formData[field] || ''}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className="rounded-lg border-gray-300 border p-2 text-sm"
      >
        {(isLevel ? levelOptions : statusOptions).map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <input
        type="text"
        value={formData[`${field}_remarks`] || ''}
        onChange={(e) => setFormData({ ...formData, [`${field}_remarks`]: e.target.value })}
        placeholder="Remarks"
        className="rounded-lg border-gray-300 border p-2 text-sm"
      />
    </div>
  );

  const EquipmentRow = ({ label, field, isLevel = false }) => (
    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-gray-100">
      <div className="col-span-5 text-sm font-medium text-gray-700">{label}</div>
      <div className="col-span-7">{renderStatusSelect(field, label, isLevel)}</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Building Equipment Check Sheet</h1>
          <p className="text-gray-600 mt-1">Pemeriksaan Peralatan Gedung (3 Shift)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg font-medium"
        >
          {showForm ? '✕ Cancel' : '+ New Check Sheet'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">New Building Equipment Check</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={formData.reading_date} onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                <select value={formData.shift_id} onChange={(e) => setFormData({ ...formData, shift_id: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 border p-2.5" required>
                  <option value="1">Shift 1 (07:00-15:00)</option>
                  <option value="2">Shift 2 (15:00-22:00)</option>
                  <option value="3">Shift 3 (22:00-07:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Petugas</label>
                <input type="text" value={formData.petugas} onChange={(e) => setFormData({ ...formData, petugas: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
            </div>

            {/* SHIFT 1 */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-blue-900 mb-3 bg-blue-50 p-2 rounded">🌅 Shift 1 (07:00-15:00) - STP Equipment</h3>
              <div className="space-y-1">
                <EquipmentRow label="Water Level" field="water_level_status" isLevel={true} />
                <EquipmentRow label="Motor Equalizing 1" field="motor_equalizing_1_status" />
                <EquipmentRow label="Motor Equalizing 2" field="motor_equalizing_2_status" />
                <EquipmentRow label="Motor Boster 1" field="motor_boster_1_status" />
                <EquipmentRow label="Motor Boster 2" field="motor_boster_2_status" />
                <EquipmentRow label="Buzzer" field="buzzer_status" />
                <EquipmentRow label="Screen" field="screen_status" />
                <EquipmentRow label="Exhaust Fan" field="exhaust_fan_status" />
                <EquipmentRow label="Pressure Air" field="pressure_air_status" />
                <EquipmentRow label="Chiller/Dosing Pump" field="chiller_dosing_pump_status" />
                <EquipmentRow label="Water Level Dosing Pump" field="water_level_dosing_pump_status" isLevel={true} />
              </div>
            </div>

            {/* SHIFT 2 */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-green-900 mb-3 bg-green-50 p-2 rounded">☀️ Shift 2 (15:00-22:00) - Electrical & Pump</h3>
              <div className="space-y-1">
                <EquipmentRow label="Floor Ceiling Light (GFF)" field="floor_ceiling_light_status" />
                <EquipmentRow label="Facade Light" field="facade_light_status" />
                <EquipmentRow label="Swimming Light" field="swimming_light_status" />
                <EquipmentRow label="Light B1" field="light_b1_status" />
                <EquipmentRow label="Light B2" field="light_b2_status" />
                <EquipmentRow label="Stairs Zone A" field="stairs_zone_a_status" />
                <EquipmentRow label="Stairs Zone B" field="stairs_zone_b_status" />
                <EquipmentRow label="Radiator Water" field="radiator_water_status" />
                <EquipmentRow label="Jocky Pump" field="jocky_pump_status" />
                <EquipmentRow label="Hydrant Pump" field="hydrant_pump_status" />
                <EquipmentRow label="Hydrant Diesel" field="hydrant_diesel_status" />
                <EquipmentRow label="Sumpit Pump 1" field="sumpit_pump_1_status" />
                <EquipmentRow label="Sumpit Pump 2" field="sumpit_pump_2_status" />
                <EquipmentRow label="Sumpit Pump 3" field="sumpit_pump_3_status" />
                <EquipmentRow label="Sumpit Pump 4" field="sumpit_pump_4_status" />
              </div>
            </div>

            {/* SHIFT 3 */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-purple-900 mb-3 bg-purple-50 p-2 rounded">🌙 Shift 3 (22:00-07:00) - Other Equipment</h3>
              <div className="space-y-1">
                <EquipmentRow label="Panel Control Genset" field="panel_control_genset_status" />
                <EquipmentRow label="Elevator 1" field="elevator_1_status" />
                <EquipmentRow label="Elevator 2" field="elevator_2_status" />
                <EquipmentRow label="Elevator 3" field="elevator_3_status" />
                <EquipmentRow label="Elevator 4" field="elevator_4_status" />
                <EquipmentRow label="Elevator 5" field="elevator_5_status" />
                <EquipmentRow label="Pompa Delivery A" field="pompa_delivery_a_status" />
                <EquipmentRow label="Pompa Delivery B" field="pompa_delivery_b_status" />
                <EquipmentRow label="Pompa Boster 1A" field="pompa_boster_1a_status" />
                <EquipmentRow label="Pompa Boster 2A" field="pompa_boster_2a_status" />
                <EquipmentRow label="Pompa Boster 1B" field="pompa_boster_1b_status" />
                <EquipmentRow label="Pompa Boster 2B" field="pompa_boster_2b_status" />
                <EquipmentRow label="Ground Tank" field="ground_tank_status" isLevel={true} />
                <EquipmentRow label="Roof Tank A" field="roof_tank_a_status" isLevel={true} />
                <EquipmentRow label="Roof Tank B" field="roof_tank_b_status" isLevel={true} />
                <EquipmentRow label="Air Alarm" field="air_alarm_status" />
                <EquipmentRow label="Sound System" field="sound_system_status" />
                <EquipmentRow label="Access Control" field="access_control_status" />
                <EquipmentRow label="CCTV" field="cctv_status" />
                <EquipmentRow label="EASV" field="easv_status" />
                <EquipmentRow label="P-PABX" field="p_pabx_status" />
                <EquipmentRow label="TV-Cable" field="tv_cable_status" />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">General Remarks</label>
              <textarea value={formData.general_remarks} onChange={(e) => setFormData({ ...formData, general_remarks: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" rows="3" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">
              Save Check Sheet
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-x-auto">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Check Sheets</h3>
          <p className="text-sm text-gray-500 mt-1">{data.length} records found</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Petugas</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water Level</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motor Eq.1</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motor Boster 1</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buzzer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Elevator 1</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CCTV</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr><td colSpan="10" className="px-6 py-8 text-center text-gray-500">No check sheets yet.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm">{item.reading_date}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.shift_id === 1 ? 'bg-blue-100 text-blue-800' :
                      item.shift_id === 2 ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.shift_name || `Shift ${item.shift_id}`}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">{item.petugas || item.user_name}</td>
                  <td className="px-4 py-4 text-sm"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{item.water_level_status || '-'}</span></td>
                  <td className="px-4 py-4 text-sm">{item.motor_equalizing_1_status || '-'}</td>
                  <td className="px-4 py-4 text-sm">{item.motor_boster_1_status || '-'}</td>
                  <td className="px-4 py-4 text-sm">{item.buzzer_status || '-'}</td>
                  <td className="px-4 py-4 text-sm">{item.elevator_1_status || '-'}</td>
                  <td className="px-4 py-4 text-sm">{item.cctv_status || '-'}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Status Codes:</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-blue-800">
          <div><strong>B</strong> = Baik</div>
          <div><strong>R</strong> = Rusak</div>
          <div><strong>N</strong> = Normal</div>
          <div><strong>T</strong> = Tidak beroperasi</div>
          <div><strong>G</strong> = Ganti spare part</div>
          <div><strong>P</strong> = Perlu perbaikan</div>
          <div><strong>E</strong> = Level kurang</div>
          <div><strong>F</strong> = Level penuh</div>
          <div><strong>C</strong> = Jernih</div>
          <div><strong>D</strong> = Kotor</div>
        </div>
      </div>
    </div>
  );
};

export default CheckSheets;